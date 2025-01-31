import { Tokens } from "@/types/tokens";
import { astToHtml } from "..";
import { prefix } from "@/common/constant";

export const renderList = (node: Tokens) => {
  const listType = node.ordered ? "ol" : "ul";
  return `<${listType} data-line="${node.position.start.line}" class="${prefix}-${listType}">${node.children?.map(astToHtml).join("")}</${listType}>`;
};
