import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import UploadCom from "../Upload";
import { useGlobalConfig } from "@/hooks/use-global-config";
import { InsertImageEvent } from "@/config/toolbar/event";
import { t } from "@/locales";
import type { UploadProps } from "antd";
import { RcFile } from "antd/es/upload";
import { TOOLBAR_KEYS } from "@/locales/keys";

// 模拟依赖项
vi.mock("@/hooks/use-global-config", () => ({
  useGlobalConfig: vi.fn(() => ({
    onUpload: vi.fn(),
  })),
}));

vi.mock("@/config/toolbar/event", () => ({
  InsertImageEvent: vi.fn(),
}));

vi.mock("@/locales", () => ({
  t: vi.fn((key: string) => key + "_translated"),
}));

// 模拟 Ant Design 的 Upload 组件
vi.mock("antd", async (importOriginal) => {
  const actual = await importOriginal<typeof import("antd")>();
  return {
    ...actual,
    Upload: ({ children, beforeUpload }: UploadProps) => (
      <div data-testid="upload-mock">
        <input
          data-testid="upload-input"
          type="file"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file && beforeUpload) {
              await beforeUpload(file as RcFile, [file] as [RcFile]);
            }
          }}
        />
        {children}
      </div>
    ),
  };
});

describe("Upload 组件测试", () => {
  const mockOnUpload = vi.fn();
  const mockInsertImageEvent = vi.mocked(InsertImageEvent);
  const mockUseGlobalConfig = vi.mocked(useGlobalConfig);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGlobalConfig.mockReturnValue({ onUpload: mockOnUpload });
  });

  test("应正确渲染上传按钮", () => {
    render(<UploadCom />);
    expect(screen.getByTestId("upload-mock")).toBeInTheDocument();
    expect(
      screen.getByText(`${TOOLBAR_KEYS.TOOLBAR.IMAGE_ITEMS["image-upload"]}_translated`),
    ).toBeInTheDocument();
  });

  test("上传文件应触发回调链", async () => {
    const mockFile = new File(["test"], "test.png", { type: "image/png" });

    render(<UploadCom />);
    await userEvent.upload(screen.getByTestId("upload-input"), mockFile);

    // 验证 onUpload 调用
    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(mockFile, expect.any(Function));
    });

    // 模拟 onUpload 回调
    const uploadCallback = mockOnUpload.mock.calls[0][1];
    uploadCallback({ url: "test-url", alt: "test-alt" });

    // 验证图片插入事件
    expect(mockInsertImageEvent).toHaveBeenCalledWith("test-url", "test-alt");
  });

  test("无 onUpload 配置时应跳过处理", async () => {
    mockUseGlobalConfig.mockReturnValue({});
    const mockFile = new File(["test"], "test.png", { type: "image/png" });

    render(<UploadCom />);
    await userEvent.upload(screen.getByTestId("upload-input"), mockFile);

    expect(mockOnUpload).not.toHaveBeenCalled();
    expect(mockInsertImageEvent).not.toHaveBeenCalled();
  });

  test("应正确使用国际化", () => {
    render(<UploadCom />);
    expect(t).toHaveBeenCalledWith(TOOLBAR_KEYS.TOOLBAR.IMAGE_ITEMS["image-upload"]);
  });
});
