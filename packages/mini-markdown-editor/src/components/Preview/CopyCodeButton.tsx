import { FC, useState } from "react";
import styled from "styled-components";
import CopyIcon from "@/assets/images/copy.svg?raw";
import CopyDoneIcon from "@/assets/images/copy-done.svg?raw";

interface CopyButtonProps {
  content: string;
  className?: string;
}

export const CopyButton: FC<CopyButtonProps> = ({ content, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // TODO: 错误处理
      console.log(err);
    }
  };

  return (
    <StyledButton
      className={`copy-code-button ${className} ${copied ? "copied" : ""}`}
      onClick={handleCopy}
    >
      <IconWrapper
        className="icon-wrapper"
        dangerouslySetInnerHTML={{
          __html: copied ? CopyDoneIcon : CopyIcon,
        }}
      />
    </StyledButton>
  );
};

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    color: #ffffff;
  }

  &:active {
    transform: scale(0.95);
  }

  &.copied {
    color: #67c23a;
  }

  .icon-wrapper {
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  &:hover .icon-wrapper {
    opacity: 1;
  }
`;

export default CopyButton;
