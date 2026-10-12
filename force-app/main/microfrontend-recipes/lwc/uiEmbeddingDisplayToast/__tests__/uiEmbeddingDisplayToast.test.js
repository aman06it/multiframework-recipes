import { createElement } from "lwc";
import UiEmbeddingDisplayToast from "c/uiEmbeddingDisplayToast";

describe("c-ui-embedding-display-toast", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("embeds the guest at /embedding/display-toast", () => {
    const el = createElement("c-ui-embedding-display-toast", {
      is: UiEmbeddingDisplayToast
    });
    el.baseUrl = "https://guest.example.com";
    document.body.appendChild(el);

    const embed = el.shadowRoot.querySelector("lightning-ui-embedding");
    expect(embed.src).toBe("https://guest.example.com/embedding/display-toast");
  });
});
