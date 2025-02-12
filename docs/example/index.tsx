import React, { FC, useEffect, useRef, useState } from "react";
import { Editor, insertContent, ToolbarManager } from "@mini-markdown/editor";
import type { Callback, EditorRef } from "@mini-markdown/editor";
import { Button, message } from "antd";
// 可根据需要引入不同的主题
import "highlight.js/styles/atom-one-dark.css";
import { ViewUpdate } from "@mini-markdown/editor";

export const frontmatter = {
  // 声明布局类型
  pageType: "page",
};

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

  const editorRef = useRef<EditorRef>(null);

  useEffect(() => {
    if (editorRef.current) {
      console.log(editorRef.current);
    }
  }, []);

  return (
    <>
      <Button onClick={changeTheme}>主题切换{theme}</Button>
      <Button
        onClick={() => {
          editorRef.current?.setContent("hello world");
        }}
      >
        插入内容
      </Button>
      <Button
        onClick={() => {
          const text = editorRef.current?.getContent();
          console.log(text);
        }}
      >
        获取内容
      </Button>
      <Button
        onClick={() => {
          editorRef.current?.clear();
        }}
      >
        清空内容
      </Button>
      <Button
        onClick={() => {
          editorRef.current?.setCursor(100, 100);
        }}
      >
        设置光标位置（100，100）
      </Button>
      <Button
        onClick={() => {
          const pos = editorRef.current?.getCursor();
          console.log(pos);
        }}
      >
        获取光标位置
      </Button>
      <Button
        onClick={() => {
          const text = editorRef.current?.getSelection();
          console.log(text);
        }}
      >
        获取选中内容
      </Button>
      <Button
        onClick={() => {
          editorRef.current?.focus();
        }}
      >
        聚焦
      </Button>
      <Button
        onClick={() => {
          const instance = editorRef.current?.getEditorInstance();
          console.log(instance);
        }}
      >
        获取编辑器实例
      </Button>
      <Button
        onClick={() => {
          const instance = editorRef.current?.getPreviewInstance();
          console.log(instance);
        }}
      >
        获取预览区实例
      </Button>
      <div style={{ height: "600px" }}>
        <Editor
          status={true}
          onUpload={handleUpload}
          local={false}
          theme={theme}
          onChange={handleChange}
          enableShortcuts={true}
          onDragUpload={handlePatseUpload}
          onPatseUpload={handlePatseUpload}
          ref={editorRef}
          value={
            "# 标题\n## 二级标题\n### 三级标题\n#### 四级标题\n##### 五级标题\n###### 六级标题\n"
          }
        />
      </div>
    </>
  );
};

export default App;
