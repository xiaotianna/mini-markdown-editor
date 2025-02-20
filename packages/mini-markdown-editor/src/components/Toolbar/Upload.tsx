import { Upload, UploadProps } from "antd";
import { FC } from "react";
import { InsertImageEvent } from "@/config/toolbar/event";
import { useGlobalConfig } from "@/hooks/use-global-config";
import { t, type TRANSLATION_KEYS } from "@/locales";
import { TOOLBAR_KEYS } from "@/locales/keys";

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
      <Upload {...props}>
        {t(TOOLBAR_KEYS.TOOLBAR.IMAGE_ITEMS["image-upload"] as TRANSLATION_KEYS)}
      </Upload>
    </>
  );
};

export default UploadCom;
