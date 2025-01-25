import { ToolbarType } from "@/types/toolbar";
import { insertContent } from "@/utils/insert-content";
import { template, TemplateVal } from "./template";

// 插入到编辑区内容
const InsertTextEvent = (type: ToolbarType) => {
  const { content, selection } = template[type] as TemplateVal;
  insertContent.insertContent(content, selection);
};

// 插入图片

// 撤销

// 重做

// 全屏

// 只写

// 仅预览

// 打开目录

// 帮助

// HTML代码预览

// 导出为PDF

export { InsertTextEvent };
