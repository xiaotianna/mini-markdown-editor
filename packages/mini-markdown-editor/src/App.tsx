import { FC } from "react";
import styled from "styled-components";
import EditorWrapper from "./EditorWrapper";
import { Callback } from "./types/global-config";
import { message } from "antd";

const AppWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #fafafa;
  padding: 50px;
  display: flex;
  justify-content: center;
`;

const App: FC = () => {
  // 请求测试
  const handleUpload = async (file: File, callback: Callback) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("settimout 上传成功", file);
        resolve({});
      }, 1500);
    });
    callback({
      url: "https://www.baidu.com/img/flexible/logo/pc/result@2.png",
      alt: "alt",
    });
    message.success("上传成功");
  };
  return (
    <AppWrapper>
      <EditorWrapper status={true} onUpload={handleUpload} />
    </AppWrapper>
  );
};

export default App;
