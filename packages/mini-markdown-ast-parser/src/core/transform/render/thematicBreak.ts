import { prefix } from "@/common/constant";
import { Tokens } from "@/types/tokens";

export const renderThematicBreak = (node: Tokens) => {
  return `<hr class="${prefix}-hr" data-line="${node.position.start.line}" />`;
};
