import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { markdownLanguage } from "@codemirror/lang-markdown";

export const createMarkdownExtension = () => {
  return markdown({
    base: markdownLanguage,
    codeLanguages: languages,
  });
};
