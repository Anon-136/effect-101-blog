import { marked } from "marked";
import { codeToHtml } from "shiki";
import { transformerTwoslash } from "@shikijs/twoslash";
import content from "./content.md?raw";

const app = document.querySelector<HTMLElement>("#app");

if (!app) {
  throw new Error("Missing #app root element");
}

const render = async () => {
  const blocks: Array<{ placeholder: string; html: string }> = [];
  const fencePattern = /```([\w-]+)([^\n]*)\n([\s\S]*?)```/g;

  const highlightCode = async (
    code: string,
    lang: string,
    useTwoslash: boolean,
  ) => {
    if (!useTwoslash) {
      return codeToHtml(code, {
        lang,
        theme: "github-light",
      });
    }

    try {
      return await codeToHtml(code, {
        lang,
        theme: "github-light",
        transformers: [transformerTwoslash()],
      });
    } catch (error) {
      console.warn(
        "Twoslash rendering failed. Falling back to regular highlighting.",
        error,
      );

      return codeToHtml(code, {
        lang,
        theme: "github-light",
      });
    }
  };

  let index = 0;
  let rewritten = "";
  let cursor = 0;

  for (const match of content.matchAll(fencePattern)) {
    const full = match[0];
    const offset = match.index ?? 0;
    const lang = match[1];
    const meta = (match[2] || "").trim();
    const code = match[3];

    rewritten += content.slice(cursor, offset);

    if (meta.includes("twoslash")) {
      const placeholder = `TWOSLASH_SLOT_${index++}`;
      const html = await highlightCode(code, lang, true);

      blocks.push({ placeholder, html });
      rewritten += placeholder;
    } else {
      rewritten += full;
    }

    cursor = offset + full.length;
  }

  rewritten += content.slice(cursor);

  let html = await marked.parse(rewritten);

  for (const block of blocks) {
    html = html.replace(`<p>${block.placeholder}</p>`, block.html);
  }

  app.innerHTML = html;
};

render().catch((err) => {
  app.innerHTML = `<pre><code>${String(err)}</code></pre>`;
});
