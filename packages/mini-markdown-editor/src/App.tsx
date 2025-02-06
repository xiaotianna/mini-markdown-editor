import { FC, useState } from "react";
import styled from "styled-components";
import EditorWrapper from "./EditorWrapper";
import { Callback } from "./types/global-config";
import { Button, message } from "antd";
// 可根据需要引入不同的主题
import "highlight.js/styles/atom-one-dark.css";
import { ViewUpdate } from "./types/code-mirror";

const AppWrapper = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #fafafa;
  padding: 50px;
  // 修改默认颜色
  .mini-md-h1 {
    color: orange;
  }
`;

const App: FC = () => {
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

  const [theme, setTheme] = useState("light");
  const changeTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleChange = (val: string, view: ViewUpdate) => {
    console.log(val, view);
  };

  return (
    <AppWrapper>
      <Button onClick={changeTheme}>主题切换{theme}</Button>
      <EditorWrapper
        status={true}
        onUpload={handleUpload}
        local={true}
        lineNumbers={true}
        theme={theme as "light" | "dark"}
        onChange={handleChange}
      />
    </AppWrapper>
  );
};

export default App;
