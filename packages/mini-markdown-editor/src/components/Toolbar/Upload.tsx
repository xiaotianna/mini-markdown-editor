import { Upload, UploadProps } from "antd";
import { FC } from "react";
import { InsertImageEvent } from "@/config/toolbar/event";
import { useGlobalConfig } from "@/hooks/use-global-config";

const UploadCom: FC = () => {
  const { onUpload } = useGlobalConfig();
  const props: UploadProps = {
    showUploadList: false,
    beforeUpload: (file) => {
      if (onUpload) {
        onUpload(file, (params) => {
          const { url, alt = "alt" } = params;
          InsertImageEvent(url, alt);
        });
      }
      return false;
    },
  };

  return (
    <>
      <Upload {...props}>上传图片</Upload>
    </>
  );
};

export default UploadCom;
