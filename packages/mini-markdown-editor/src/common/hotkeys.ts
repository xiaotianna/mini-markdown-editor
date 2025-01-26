// Markdown 快捷键
type Command = string;
type Description = string;
export class Hotkey {
  // Tools
  static readonly Title = {
    FIRST: new Hotkey("mod+1", "heaing-1"),
    SECOND: new Hotkey("mod+2", "heaing-2"),
    THIRD: new Hotkey("mod+3", "heaing-3"),
    FOURTH: new Hotkey("mod+4", "heaing-4"),
    FIFTH: new Hotkey("mod+5", "heaing-5"),
    SIXTH: new Hotkey("mod+6", "heaing-6"),
  } as const;
  static readonly BOLD = new Hotkey("mod+b", "bold"); // **text**
  static readonly ITALIC = new Hotkey("mod+i", "italic"); // *text*
  static readonly UNDERLINE = new Hotkey("mod+u", "underline"); // --text--
  static readonly DELETE = new Hotkey("mod+shift+x", "delete"); // ~~text~~
  static readonly BLOCKQUOTE = new Hotkey("mod+shift+9", "blockquote"); // > text
  static readonly UNORDERED_LIST = new Hotkey("mod+shift+8", "ul"); // - item
  static readonly ORDERED_LIST = new Hotkey("mod+shift+7", "ol"); // 1. item
  static readonly INLINE_CODE = new Hotkey("mod+`", "inlinecode"); // `code`
  static readonly CODE_BLOCK = new Hotkey("mod+alt+c", "code"); // ```code```
  static readonly LINK = new Hotkey("mod+k", "link"); // [text](url)
  static readonly TABLE = new Hotkey("mod+alt+t", "table"); // table
  //? undo和redo在此不定义，此快捷键在文本框自带
  static readonly FULL_SCREEN = new Hotkey("mod+alt+f", "fullscreen"); // fullscreen

  // Actions
  static readonly SAVE = new Hotkey("mod+s", "Save");

  private constructor(
    public readonly command: Command,
    public readonly description: Description,
  ) {
    Hotkey.validateCommand(command);
  }

  // 键值映射表
  private static readonly KEY_MAPPING = {
    mod: process.platform === "darwin" ? "⌘" : "Ctrl",
    shift: "⇧",
    alt: process.platform === "darwin" ? "⌥" : "Alt",
    ctrl: process.platform === "darwin" ? "⌃" : "Ctrl",
    equal: "=",
    minus: "-",
    plus: "+",
  } as const;

  // 优化后的readableCommand方法
  get readableCommand(): string {
    return this.command
      .split("+")
      .map(
        (key) =>
          Hotkey.KEY_MAPPING[key as keyof typeof Hotkey.KEY_MAPPING] ||
          key.charAt(0).toUpperCase() + key.slice(1),
      )
      .join(" ");
  }
  // 第一版-非常朴素的写法
  // get readableCommand() {
  //   const isMac = process.platform === "darwin";
  //   return this.command
  //     .replace("mod", isMac ? "⌘" : "Ctrl")
  //     .split("+")
  //     .map((value) => {
  //       if (value === "shift") {
  //         return "⇧";
  //       }
  //       if (value === "alt") {
  //         return isMac ? "⌥" : "Alt";
  //       }
  //       if (value === "ctrl") {
  //         return isMac ? "⌃" : "Ctrl";
  //       }
  //       if (value === "equal") {
  //         return "=";
  //       }
  //       if (value === "minus") {
  //         return "-";
  //       }
  //       if (value === "plus") {
  //         return "+";
  //       }
  //       return value.charAt(0).toUpperCase() + value.slice(1);
  //     })
  //     .join(" ");
  // }

  // 添加修饰键验证机制
  //! 如果后续添加单键支持要修改这里，否则不生效
  private static validateCommand(command: string) {
    const validModifiers = ["mod", "shift", "alt", "ctrl"];
    const parts = command.split("+");

    if (!parts.some((part) => validModifiers.includes(part))) {
      throw new Error(`This is must!: ${command}`);
    }
  }
}
