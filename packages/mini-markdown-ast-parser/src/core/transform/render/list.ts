import { Tokens } from "@/types/tokens";
import { astToHtml } from "..";

export const renderList = (node: Tokens) => {
  const listType = node.ordered ? "ol" : "ul";
  return `<${listType} data-line="${node.position.start.line}">${node.children?.map(astToHtml).join("")}</${listType}>`;
};
