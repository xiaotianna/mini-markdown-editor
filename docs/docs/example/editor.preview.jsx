import { Editor } from "@mini-markdown-rc/editor";
import { useDark, usePageData } from "rspress/runtime";

export default function () {
  const dark = useDark();
  const theme = dark ? "dark" : "light";
  const pageData = usePageData();

  return (
    <>
      <Editor theme={theme} local={false} value={pageData.page.frontmatter.initVal} />
    </>
  );
}
