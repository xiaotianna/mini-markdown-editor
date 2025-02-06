import { Button, message } from "antd";
import { FC } from "react";
import code from "@/mock/preview.md?raw";

interface CopyCodeButtonProps {
  textToCopy?: string;
  successMessage?: string;
  errorMessage?: string;
}

export const CopyCodeButton: FC<CopyCodeButtonProps> = ({
  textToCopy = code,
  successMessage = "已复制！",
  errorMessage = "复制失败",
}) => {
  // 仅在开发环境下展示
  if (import.meta.env.PROD) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      message.success({
        content: successMessage,
        duration: 1.5,
      });
    } catch (err) {
      console.error("复制失败:", err);
      message.error({
        content: errorMessage,
        duration: 2,
      });
    }
  };

  return (
    <Button type="primary" size="small" onClick={handleCopy} style={{ fontSize: "12px" }}>
      复制测试代码
    </Button>
  );
};
