/**
 * Display Toast — host side
 *
 * Guest asks the host to show a native toast (viewSDK.displayToast) with level, title and mode.
 * The host only embeds the guest; `<lightning-ui-embedding>` handles the request.
 */
import { LightningElement, api } from "lwc";

export default class UiEmbeddingDisplayToast extends LightningElement {
  @api baseUrl = "http://localhost:5173";

  get computedSrc() {
    const url = new URL(this.baseUrl);
    url.pathname = "/embedding/display-toast";
    return url.toString();
  }
}
