// Markdown 快捷键
type Command = string;
type Description = string;
export class Hotkey {
  // Tools
  static readonly TITLE = {
    FIRST: new Hotkey("mod+1", "heading-1"),
    SECOND: new Hotkey("mod+2", "heading-2"),
    THIRD: new Hotkey("mod+3", "heading-3"),
    FOURTH: new Hotkey("mod+4", "heading-4"),
    FIFTH: new Hotkey("mod+5", "heading-5"),
    SIXTH: new Hotkey("mod+6", "heading-6"),
  } as const;
  static readonly BOLD = new Hotkey("mod+b", "bold"); // **text**
  static readonly ITALIC = new Hotkey("mod+i", "italic"); // _text_
  static readonly UNDERLINE = new Hotkey("mod+u", "underline"); // --text--
  static readonly DELETE = new Hotkey("mod+shift+x", "delete"); // ~~text~~
  static readonly BLOCKQUOTE = new Hotkey("mod+shift+9", "blockquote"); // > text
  static readonly UNORDERED_LIST = new Hotkey("mod+shift+8", "ul"); // - item
  static readonly ORDERED_LIST = new Hotkey("mod+shift+7", "ol"); // 1. item
  static readonly INLINE_CODE = new Hotkey("mod+`", "inlinecode"); // `code`
  static readonly CODE_BLOCK = new Hotkey("mod+alt+c", "code"); // ```code```
  static readonly LINK = new Hotkey("mod+k", "link"); // [text](url)
  static readonly TABLE = new Hotkey("mod+alt+t", "table"); // table
  //! 为避免冲突，此处使用cm的history插件，不手动实现undo和redo功能
  static readonly UNDO = new Hotkey("mod+z", "undo"); // undo
  static readonly REDO = new Hotkey("mod+shift+z", "redo"); // redo
  static readonly FULL_SCREEN = new Hotkey("mod+alt+f", "fullscreen"); // fullscreen

  // Actions
  static readonly SAVE = new Hotkey("mod+s", "Save");

  constructor(
    public readonly command: Command,
    public readonly description: Description,
    public readonly handle?: () => void,
  ) {
    Hotkey.validateCommand(command);
  }

  // 检测是否为 Mac 系统
  private static readonly isMac = (() => {
    if ("userAgentData" in navigator) {
      return (navigator as any).userAgentData?.platform === "macOS";
    }
    return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  })();

  // 调整为 CodeMirror 支持的快捷键形式
  get codeMirrorCommand(): string {
    return this.command
      .split("+")
      .map((key) => {
        if (key === "mod") return "Mod";
        if (key === "shift") return "Shift";
        if (key === "alt") return "Alt";
        if (key === "ctrl") return "Ctrl";
        return key.charAt(0).toLowerCase() + key.slice(1);
      })
      .join("-");
  }

  // 键值映射表
  private static readonly KEY_MAPPING = {
    mod: Hotkey.isMac ? "⌘" : "Ctrl",
    shift: "⇧",
    alt: Hotkey.isMac ? "⌥" : "Alt",
    ctrl: Hotkey.isMac ? "⌃" : "Ctrl",
  } as const;

  // 供工具栏使用的可读性更好的快捷键
  get readableCommand(): string {
    return this.command
      .split("+")
      .map(
        (key) =>
          Hotkey.KEY_MAPPING[key as keyof typeof Hotkey.KEY_MAPPING] ||
          key.charAt(0).toUpperCase() + key.slice(1),
      )
      .join(" + ");
  }

  // 供帮助文档使用的可读性更好的快捷键
  get helpCommand(): string {
    return this.command
      .split("+")
      .map((key) => {
        if (key === "mod") return Hotkey.isMac ? "⌘" : "Ctrl";
        if (key === "shift") return "Shift";
        if (key === "alt") return "Alt";
        if (key === "ctrl") return "Ctrl";
        return key.charAt(0).toUpperCase() + key.slice(1);
      })
      .join("+");
  }

  // 添加修饰键验证机制
  //! 如果后续添加单键支持要修改这里，否则不生效
  private static validateCommand(command: string) {
    const validModifiers = ["mod", "shift", "alt", "ctrl"];
    const parts = command.split("+");

    if (!parts.some((part) => validModifiers.includes(part))) {
      throw new Error(`This is must!: ${command}`);
    }
  }

  // 生成配置对象的方法
  public toConfig() {
    return {
      command: this.codeMirrorCommand,
      description: this.description,
      handle: this.handle,
    };
  }
}
