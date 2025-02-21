import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import EmojiIcon from "@/assets/images/emoji.svg?raw";
import { DropDownMenu } from "../base/DropDownMenu";
import { FC, useMemo } from "react";
import { InsertEmojiEvent } from "@/config/toolbar/event";
import { useGlobalConfig } from "@/hooks/use-global-config";

const Emoji: FC = () => {
  const { theme, locale: globalLocal } = useGlobalConfig();

  const locale = useMemo(() => {
    return globalLocal === "cn" ? "zh" : globalLocal;
  }, [globalLocal]);

  // Emoji 选择器
  const EmojiPickerComponent = useMemo(
    () => (
      <Picker
        data={data}
        onEmojiSelect={(emoji: any) => InsertEmojiEvent(emoji)}
        locale={locale}
        theme={theme === "dark" ? "dark" : "light"}
        previewPosition="none"
        searchPosition="top"
      />
    ),
    [theme],
  );

  return (
    <DropDownMenu dropdownRender={() => EmojiPickerComponent}>
      {EmojiIcon && <div className="icon" dangerouslySetInnerHTML={{ __html: EmojiIcon }} />}
    </DropDownMenu>
  );
};

export default Emoji;
