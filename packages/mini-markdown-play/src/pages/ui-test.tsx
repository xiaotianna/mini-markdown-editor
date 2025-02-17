import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { Editor } from "@mini-markdown-rc/editor";
import type { Callback } from "@mini-markdown-rc/editor";
import { Button, message } from "antd";
// 可根据需要引入不同的主题
import "highlight.js/styles/atom-one-dark.css";
import { ViewUpdate } from "@mini-markdown-rc/editor";
import { parseMarkdown } from "@mini-markdown-rc/ast-parser";
import "@mini-markdown-rc/ast-parser/style/index.css";

const AppWrapper = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #fafafa;
  padding: 50px;
`;

const App: FC = () => {
  useEffect(() => {
    const res = parseMarkdown(`# hello world`);
    console.log(res);
  });
  // 请求测试
  const handleUpload = async (file: File, callback: Callback) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("settimeout 上传成功", file);
        resolve({});
      }, 1500);
    });
    callback({
      url: "https://www.baidu.com/img/flexible/logo/pc/result@2.png",
      alt: "alt",
    });
    message.success("上传成功");
  };

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const changeTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleChange = (val: string, view: ViewUpdate) => {
    console.log(val, view);
  };

  const handlePatseUpload = async (file: File, callback: Callback) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("settimeout 上传成功", file);
        resolve({});
      }, 1500);
    });
    callback({
      url: "https://www.baidu.com/img/flexible/logo/pc/result@2.png",
      alt: "123",
    });
    message.success("上传成功");
  };

  return (
    <AppWrapper>
      <Button onClick={changeTheme}>主题切换{theme}</Button>
      <Editor
        status={true}
        onUpload={handleUpload}
        local={true}
        theme={theme}
        onChange={handleChange}
        enableShortcuts={true}
        onDragUpload={handlePatseUpload}
        onPatseUpload={handlePatseUpload}
      />
    </AppWrapper>
  );
};

export default App;
