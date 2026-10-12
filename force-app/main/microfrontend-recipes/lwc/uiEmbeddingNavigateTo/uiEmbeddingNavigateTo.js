/**
 * Navigate To — host side
 *
 * Guest asks the host to navigate (viewSDK.navigateTo) — the host runs lightning/navigation.
 * The host only embeds the guest; `<lightning-ui-embedding>` handles the request.
 */
import { LightningElement, api } from "lwc";

export default class UiEmbeddingNavigateTo extends LightningElement {
  @api baseUrl = "http://localhost:5173";

  get computedSrc() {
    const url = new URL(this.baseUrl);
    url.pathname = "/embedding/navigate-to";
    return url.toString();
  }
}
