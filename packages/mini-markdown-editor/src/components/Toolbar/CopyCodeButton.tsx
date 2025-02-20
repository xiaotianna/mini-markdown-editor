import { Button, message } from "antd";
import { FC } from "react";
import codeCN from "@/mock/preview-cn.md?raw";
import codeEN from "@/mock/preview-en.md?raw";
import { getCurrentLocale } from "@/locales";

interface CopyCodeButtonProps {
  textToCopy?: string;
  successMessage?: string;
  errorMessage?: string;
  buttonText?: string;
}

export const CopyCodeButton: FC<CopyCodeButtonProps> = ({
  textToCopy,
  successMessage,
  errorMessage,
  buttonText,
}) => {
  // 仅在开发环境下展示
  if (import.meta.env.PROD) {
    return null;
  }

  const currentLocale = getCurrentLocale();
  if (currentLocale === "cn") {
    textToCopy = codeCN;
    successMessage = "已复制！";
    errorMessage = "复制失败";
    buttonText = "复制测试代码";
  } else {
    textToCopy = codeEN;
    successMessage = "Copied!";
    errorMessage = "Copy failed";
    buttonText = "Copy Test Code";
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      message.success({
        content: successMessage,
        duration: 1.5,
      });
    } catch (err) {
      console.error("Copy Error:", err);
      message.error({
        content: errorMessage,
        duration: 2,
      });
    }
  };

  return (
    <Button type="primary" size="small" onClick={handleCopy} style={{ fontSize: "12px" }}>
      {buttonText}
    </Button>
  );
};
