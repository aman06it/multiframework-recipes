/**
 * Ready State
 *
 * Shows how the host observes the guest's lifecycle. There is nothing to call
 * from the guest for the happy path: the bridge posts a readiness heartbeat as
 * soon as the Platform SDK resolves (see GuestLayout), and once the bootstrap
 * handshake completes the host's <lightning-ui-embedding> element dispatches a
 * reserved `sf-embedding.component.ready` event on itself. Failures surface the
 * same way through `sf-embedding.component.error`.
 *
 * Key concept: readiness and errors are host-observable events, not something
 * the guest polls or the host races on. The host listens:
 *   embedding.addEventListener('sf-embedding.component.ready', ...)
 *   embedding.addEventListener('sf-embedding.component.error', ...)
 * The error detail carries { phase, code, message, retryable } so the host can
 * decide whether a remount is worth attempting. See the mfeReadyState LWC.
 *
 * @see BasicEmbed — detecting the embedding context from the guest
 */
import { isSfEmbeddingIframe } from '@salesforce/platform-sdk';
import { useSdk } from '../sdk-context';

export default function ReadyState() {
    // Consuming the SDK here means this component only renders once the SDK has
    // resolved — the same moment the host receives the ready event.
    useSdk();
    const connected = isSfEmbeddingIframe();

    return (
        <div className="recipe-container">
            <h2 className="recipe-title">Ready State</h2>
            <p className="recipe-description">
                By the time this renders, the Platform SDK has resolved and the bridge has
                reported readiness to the host. The host hears{' '}
                <code>sf-embedding.component.ready</code> and swaps its spinner for the
                embedded content. On failure it hears{' '}
                <code>sf-embedding.component.error</code> instead.
            </p>

            {!connected && (
                <div className="recipe-alert alert-info">
                    Running standalone — no host is listening for the ready event. Embed
                    this app in the mfeReadyState LWC to see the host lifecycle react.
                </div>
            )}

            <div className="recipe-card">
                <p className="recipe-label">Guest status</p>
                <p className="recipe-value">
                    <span className={`status-dot ${connected ? 'dot-green' : 'dot-gray'}`} />
                    {connected ? 'Booted — host was notified ready' : 'Booted standalone'}
                </p>

                <p className="recipe-label">Host signals</p>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12 }}>
                    <li>
                        <code>sf-embedding.component.ready</code> — handshake complete
                    </li>
                    <li>
                        <code>sf-embedding.component.error</code> —{' '}
                        <code>{'{ phase, code, message, retryable }'}</code>
                    </li>
                </ul>
            </div>
        </div>
    );
}
