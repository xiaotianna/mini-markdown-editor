import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import EmojiIcon from "@/assets/images/emoji.svg?raw";
import { DropDownMenu } from "../base/DropDownMenu";
import { FC, useContext, useMemo } from "react";
import { InsertEmojiEvent } from "@/config/toolbar/event";
import { ConfigContext } from "@/components/providers/config-provider";

export const Emoji: FC = () => {
  const { theme } = useContext(ConfigContext);

  // Emoji 选择器
  const EmojiPickerComponent = useMemo(
    () => (
      <Picker
        data={data}
        onEmojiSelect={(emoji: any) => InsertEmojiEvent(emoji)}
        locale="zh"
        theme={theme === "dark" ? "dark" : "light"}
        previewPosition="none"
        searchPosition="top"
        // skinTonePosition="none"
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
