import { createHighlighter, type BundledLanguage, type BundledTheme } from "shiki";

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["tsx", "typescript", "javascript", "jsx", "css", "json", "bash"],
    });
  }
  return highlighter;
}

export async function highlightCode(
  code: string,
  lang: BundledLanguage = "tsx",
  theme: BundledTheme = "github-dark"
) {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    theme,
  });
}

export async function highlightCodeWithDualTheme(
  code: string,
  lang: BundledLanguage = "tsx"
) {
  const hl = await getHighlighter();

  const darkHtml = hl.codeToHtml(code, {
    lang,
    theme: "github-dark",
  });

  const lightHtml = hl.codeToHtml(code, {
    lang,
    theme: "github-light",
  });

  return { darkHtml, lightHtml };
}
