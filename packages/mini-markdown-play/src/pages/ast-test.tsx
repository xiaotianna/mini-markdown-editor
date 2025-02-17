import { FC, useEffect, useState } from "react";
// 可根据需要引入不同的主题
import "highlight.js/styles/atom-one-dark.css";
import { parseMarkdown, transformHtml } from "@mini-markdown-rc/ast-parser";
import "@mini-markdown-rc/ast-parser/style/index.css";
import mdCode from "./ast-demo.md?raw";

const App: FC = () => {
  const [code, setCode] = useState("");
  useEffect(() => {
    const res = parseMarkdown(mdCode);
    setCode(transformHtml(res));
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: code }}></div>;
};

export default App;
