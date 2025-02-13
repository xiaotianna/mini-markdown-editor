// 用于将 markdown 转换为 ast
export { parseMarkdown } from "./core/parse";
// 用于将 ast 转换为 html
export { transformHtml } from "./core/transform";
// 前缀
export { prefix } from "./common/constant";
// 分词类型
export { TOKENS_TYPES } from "./common/tokens-types";
// 解析的 html 样式
import "./styles/index.css";

// ts 类型
export type { Tokens, RootTokens } from "./types/tokens";
export type { TokensTypes, TokensTypesKey, TokenTypeVal } from "./types/tokens-types";
export type { IncrementalParseOptions } from "./core/parse";
