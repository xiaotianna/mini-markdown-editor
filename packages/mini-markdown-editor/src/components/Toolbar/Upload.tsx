import { Upload, UploadProps } from "antd";
import { FC, useContext } from "react";
import { ConfigContext } from "../providers/config-provider";
import { InsertImageEvent } from "@/config/toolbar/event";

const UploadCom: FC = () => {
  const { onUpload } = useContext(ConfigContext);
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
