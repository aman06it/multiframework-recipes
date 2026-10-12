/**
 * Display Modal — host side
 *
 * Guest asks the host to open a modal (viewSDK.displayModal); resolves when the user closes it.
 * The host only embeds the guest; `<lightning-ui-embedding>` handles the request.
 */
import { LightningElement, api } from "lwc";

export default class UiEmbeddingDisplayModal extends LightningElement {
  @api baseUrl = "http://localhost:5173";

  get computedSrc() {
    const url = new URL(this.baseUrl);
    url.pathname = "/embedding/display-modal";
    return url.toString();
  }
}
