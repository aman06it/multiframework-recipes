import { LightningElement, api, track } from 'lwc';

// Reserved events the <lightning-ui-embedding> element dispatches on itself.
// READY fires when the guest's bootstrap handshake completes; ERROR fires on
// any configuration, bootstrap, or session failure. See the sf-embedding-bridge
// HostReadyEventDetail / HostErrorEventDetail contracts.
const READY_EVENT = 'sf-embedding.component.ready';
const ERROR_EVENT = 'sf-embedding.component.error';

export default class MfeReadyState extends LightningElement {
    @api baseUrl = 'http://localhost:5173';
    debug = false;

    // 'loading' until the guest reports ready or errors.
    @track status = 'loading';
    @track error; // HostErrorEventDetail: { phase, code, message, retryable }
    // Bumped on retry to force a fresh <lightning-ui-embedding> mount.
    @track attempt = 0;

    _onReady;
    _onError;

    get computedSrc() {
        const url = new URL(this.baseUrl);
        url.pathname = '/embedding/ready-state';
        // Cache-bust so a retry re-runs the guest bootstrap instead of reusing
        // a warm iframe that already settled.
        if (this.attempt > 0) url.searchParams.set('attempt', String(this.attempt));
        return url.toString();
    }

    get isLoading() {
        return this.status === 'loading';
    }

    get isReady() {
        return this.status === 'ready';
    }

    get isError() {
        return this.status === 'error';
    }

    // Only offer Retry when the protocol says a remount is plausibly fruitful
    // (handshake timeouts, guest runtime errors) — not for configuration or
    // protocol-violation errors that need a code fix first.
    get canRetry() {
        return this.status === 'error' && Boolean(this.error?.retryable);
    }

    renderedCallback() {
        if (this._onReady) return;
        const embedding = this.refs?.embedding;
        if (!embedding) return;

        this._onReady = (evt) => this.handleReady(evt);
        this._onError = (evt) => this.handleError(evt);
        embedding.addEventListener(READY_EVENT, this._onReady);
        embedding.addEventListener(ERROR_EVENT, this._onError);
    }

    disconnectedCallback() {
        const embedding = this.refs?.embedding;
        if (embedding && this._onReady) {
            embedding.removeEventListener(READY_EVENT, this._onReady);
            embedding.removeEventListener(ERROR_EVENT, this._onError);
        }
        this._onReady = undefined;
        this._onError = undefined;
    }

    handleReady() {
        this.status = 'ready';
        this.error = undefined;
    }

    handleError(evt) {
        // event.detail carries phase, code, message, and the retryable flag.
        this.error = evt.detail ?? { message: 'Unknown embedding error', retryable: false };
        this.status = 'error';
    }

    handleRetry() {
        // Re-mount the embedding: reset to loading and bump the src so the guest
        // boots from scratch. The template rebinds src and the handshake reruns.
        this.error = undefined;
        this.status = 'loading';
        this.attempt += 1;
    }
}
