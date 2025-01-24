import { prefix } from "@/common/constant";
import { Tokens } from "@/types/tokens";
import hljs from "highlight.js";

export const renderCode = (node: Tokens) => {
  let language = "plaintext";
  try {
    // 检查语言是否有效
    const lang = node.lang || "plaintext";
    if (lang !== "plaintext" && !hljs.getLanguage(lang)) {
      node.lang = "plaintext";
    }
    if (node.lang) {
      hljs.highlight("", { language: node.lang });
      language = node.lang;
    }
  } catch (e) {
    // 如果语言无效，使用plaintext
    language = "plaintext";
  }

  const highlightedCode = hljs.highlight(node.value!, {
    language,
  }).value;
  return `<div class="${prefix}-code-container" data-line="${node.position.start.line}">
    <div class="${prefix}-code-header">
      <div class="${prefix}-code-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="${prefix}-code-right">${language}</div>
    </div>
    <pre><code class="language-${language}">${highlightedCode}</code></pre>
  </div>`;
};
