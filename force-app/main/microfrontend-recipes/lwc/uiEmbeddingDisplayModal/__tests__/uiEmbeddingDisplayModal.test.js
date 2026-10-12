import { createElement } from "lwc";
import UiEmbeddingDisplayModal from "c/uiEmbeddingDisplayModal";

describe("c-ui-embedding-display-modal", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("embeds the guest at /embedding/display-modal", () => {
    const el = createElement("c-ui-embedding-display-modal", {
      is: UiEmbeddingDisplayModal
    });
    el.baseUrl = "https://guest.example.com";
    document.body.appendChild(el);

    const embed = el.shadowRoot.querySelector("lightning-ui-embedding");
    expect(embed.src).toBe("https://guest.example.com/embedding/display-modal");
  });
});
