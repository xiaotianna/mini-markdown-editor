import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import EditorWrapper from "./EditorWrapper";
import { Callback } from "./types/global-config";
import { Button, message } from "antd";
// 可根据需要引入不同的主题
import "highlight.js/styles/atom-one-dark.css";
// import { ViewUpdate } from "./types/code-mirror";
import { EditorView } from "@uiw/react-codemirror";
import { EditorRef } from "./types/ref";
// import { toolbarConfig as toolbarManager } from "./config/toolbar";
import UlIcon from "@/assets/images/ul.svg?raw";
// import { toolbarConfig } from "./config/toolbar";
// import { insertContent } from "./utils/insert-content";
// import { insertContent } from "@/utils/insert-content";
// import { toolbarConfig } from "./config/toolbar";
// import { ToolbarEvents, ToolbarItem } from "./types/toolbar";

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

  // const handleChange = (val: string, view: ViewUpdate) => {
  //   // console.log(val, view);
  // };

  const handleSave = (content: string, view: EditorView) => {
    console.log(content, view);
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

  // useEffect(() => {
  //   try {
  //     // toolbarConfig.addToolItem({
  //     //   type: "abc",
  //     //   title: "我是测试abc",
  //     //   icon: UlIcon,
  //     //   description: "我是描述abc",
  //     //   hotkey: {
  //     //     command: "Mod-l",
  //     //     description: "控制台输出def",
  //     //     handle: () => {
  //     //       console.log("我是快捷键输出def");
  //     //     },
  //     //   },
  //     //   onClick: () => {
  //     //     console.log("我是输出abc");
  //     //     // InsertText("123", {anchor: 1, head: 1});
  //     //     insertContent.insertTextAtCursor("123");
  //     //   },
  //     // });
  //     console.log(toolbarConfig.getAllToolbarsOrder());

  //     // 单个顺序修改测试
  //     // toolbarConfig.setToolbarOrder("bold", 0);

  //     // 批量设置顺序
  //     // toolbarConfig.setToolbarsOrder({
  //     //   bold: 0,
  //     //   italic: 1,
  //     //   underline: 2,
  //     // });

  //     // 完全重排序
  //     // 此方法需要所有工具栏都传入，否则会报错
  //     // toolbarConfig.reorderToolbar([""])

  //     toolbarConfig.swapToolbarsPosition("heading", "bold");
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, []);

  return (
    <AppWrapper>
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
      {/* <EditorWrapper theme={theme as "light" | "dark"} onSave={handleSave} /> */}
      <EditorWrapper
        // locale="tw"
        placeholder={"请输入内容..."}
        // status={true}
        onUpload={handleUpload}
        // local={false}
        lineNumbers={true}
        theme={theme as "light" | "dark"}
        // onChange={handleChange}
        onSave={handleSave}
        onDragUpload={handlePatseUpload}
        onPatseUpload={handlePatseUpload}
        ref={editorRef}
        toolbars={{
          // excludeTools: ["italic"],
          addTools: [
            {
              type: "123",
              title: "我是测试123",
              icon: UlIcon,
              description: "我是描述123",
              hotkey: {
                command: "Mod-p",
                description: "控制台输出123",
                handle: () => {
                  console.log("我是快捷键输出123");
                },
              },
              onClick: () => {
                console.log("我是快捷键输出123");
              },
            },
          ],
          orderTools: [{ type: "123", order: 0 }],
        }}
        value="## Hello World."
      />
    </AppWrapper>
  );
};

export default App;
