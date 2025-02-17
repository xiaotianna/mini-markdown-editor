import { Editor } from "@mini-markdown-rc/editor";
import { useDark } from "rspress/runtime";

export default function () {
  const dark = useDark();
  const theme = dark ? "dark" : "light";

  return (
    <>
      <Editor theme={theme} local={false} />
    </>
  );
}
