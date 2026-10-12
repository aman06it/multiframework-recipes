import { createElement } from "lwc";
import UiEmbeddingNavigateTo from "c/uiEmbeddingNavigateTo";

describe("c-ui-embedding-navigate-to", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("embeds the guest at /embedding/navigate-to", () => {
    const el = createElement("c-ui-embedding-navigate-to", {
      is: UiEmbeddingNavigateTo
    });
    el.baseUrl = "https://guest.example.com";
    document.body.appendChild(el);

    const embed = el.shadowRoot.querySelector("lightning-ui-embedding");
    expect(embed.src).toBe("https://guest.example.com/embedding/navigate-to");
  });
});
