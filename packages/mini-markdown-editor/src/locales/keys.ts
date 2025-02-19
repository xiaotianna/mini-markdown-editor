// // 映射表
// export const TRANSLATION_KEYS = {
//   TOOLBAR: {
//     HEADING: "TOOLBAR.HEADING",
//     BOLD: "TOOLBAR.BOLD",
//     ITALIC: "TOOLBAR.ITALIC",
//     UNDERLINE: "TOOLBAR.UNDERLINE",
//     DELETE: "TOOLBAR.DELETE",
//     BLOCKQUOTE: "TOOLBAR.BLOCKQUOTE",
//     UL: "TOOLBAR.UL",
//     OL: "TOOLBAR.OL",
//     INLINE_CODE: "TOOLBAR.INLINE_CODE",
//     CODE: "TOOLBAR.CODE",
//     LINK: "TOOLBAR.LINK",
//     IMAGE: "TOOLBAR.IMAGE",
//     TABLE: "TOOLBAR.TABLE",
//     UNDO: "TOOLBAR.UNDO",
//     REDO: "TOOLBAR.REDO",
//     HEADING_ITEMS: {
//       H1: "TOOLBAR.HEADING_ITEMS.H1",
//       H2: "TOOLBAR.HEADING_ITEMS.H2",
//       H3: "TOOLBAR.HEADING_ITEMS.H3",
//       H4: "TOOLBAR.HEADING_ITEMS.H4",
//       H5: "TOOLBAR.HEADING_ITEMS.H5",
//       H6: "TOOLBAR.HEADING_ITEMS.H6",
//     },
//     IMAGE_ITEMS: {
//       LINK: "TOOLBAR.IMAGE_ITEMS.LINK",
//       UPLOAD: "TOOLBAR.IMAGE_ITEMS.UPLOAD",
//     },
//   },
// } as const;

import { BaseToolbarType } from "@/types/toolbar";

export const TOOLBAR_KEYS = {
  TOOLBAR: {
    // 基础工具栏项
    [BaseToolbarType.HEADING]: "TOOLBAR.HEADING",
    [BaseToolbarType.BOLD]: "TOOLBAR.BOLD",
    [BaseToolbarType.ITALIC]: "TOOLBAR.ITALIC",
    [BaseToolbarType.UNDERLINE]: "TOOLBAR.UNDERLINE",
    [BaseToolbarType.DELETE]: "TOOLBAR.DELETE",
    [BaseToolbarType.BLOCKQUOTE]: "TOOLBAR.BLOCKQUOTE",
    [BaseToolbarType.UL]: "TOOLBAR.UL",
    [BaseToolbarType.OL]: "TOOLBAR.OL",
    [BaseToolbarType.INLINECODE]: "TOOLBAR.INLINE_CODE",
    [BaseToolbarType.CODE]: "TOOLBAR.CODE",
    [BaseToolbarType.LINK]: "TOOLBAR.LINK",
    [BaseToolbarType.IMAGE]: "TOOLBAR.IMAGE",
    [BaseToolbarType.TABLE]: "TOOLBAR.TABLE",
    [BaseToolbarType.UNDO]: "TOOLBAR.UNDO",
    [BaseToolbarType.REDO]: "TOOLBAR.REDO",
    [BaseToolbarType.FULLSCREEN]: "TOOLBAR.FULLSCREEN",
    [BaseToolbarType.WRITE]: "TOOLBAR.WRITE",
    [BaseToolbarType.PREVIEW]: "TOOLBAR.PREVIEW",
    [BaseToolbarType.CONTENTS]: "TOOLBAR.CONTENTS",
    [BaseToolbarType.HELP]: "TOOLBAR.HELP",
    [BaseToolbarType.OUTPUT]: "TOOLBAR.OUTPUT",
    [BaseToolbarType.EMOJI]: "TOOLBAR.EMOJI",
    [BaseToolbarType.SAVE]: "TOOLBAR.SAVE",

    // 标题子项
    HEADING_ITEMS: {
      [BaseToolbarType.HEADING_1]: "TOOLBAR.HEADING_ITEMS.H1",
      [BaseToolbarType.HEADING_2]: "TOOLBAR.HEADING_ITEMS.H2",
      [BaseToolbarType.HEADING_3]: "TOOLBAR.HEADING_ITEMS.H3",
      [BaseToolbarType.HEADING_4]: "TOOLBAR.HEADING_ITEMS.H4",
      [BaseToolbarType.HEADING_5]: "TOOLBAR.HEADING_ITEMS.H5",
      [BaseToolbarType.HEADING_6]: "TOOLBAR.HEADING_ITEMS.H6",
    },

    // 图片相关
    IMAGE_ITEMS: {
      [BaseToolbarType.IMAGE_LINK]: "TOOLBAR.IMAGE_ITEMS.LINK",
      [BaseToolbarType.IMAGE_UPLOAD]: "TOOLBAR.IMAGE_ITEMS.UPLOAD",
    },
  },
} as const;
