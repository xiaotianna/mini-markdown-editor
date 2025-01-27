import { Tokens } from "@/types/tokens";
import { astToHtml } from "..";
import { prefix } from "@/common/constant";

export const renderLink = (node: Tokens) => {
  return `<a href="${node.url}" class="${prefix}-link" target="_blank">${astToHtml(node.children![0])}</a>`;
};
