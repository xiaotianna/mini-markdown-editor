import styled from "styled-components";
import { Button, Form, Input, Select } from "antd";
import { exportHTML } from "@/utils/output-html";
import { useEditorContentStore } from "@/store/editor";
import { useState } from "react";
import { exportPdf } from "@/utils/output-pdf";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

type FieldType = {
  "file-type": "PDF" | "HTML";
  "file-name": string;
};

const Output = () => {
  const [form] = Form.useForm<FieldType>();
  const preview = useEditorContentStore((state) => state.previewView);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    const { "file-type": fileType, "file-name": fileName } = form.getFieldsValue();
    setLoading(true);
    switch (fileType) {
      case "PDF": {
        await exportPdf(preview!, fileName);
        break;
      }
      case "HTML": {
        if (!preview) return;
        await exportHTML(preview, fileName);
        break;
      }
      default:
        break;
    }
    setLoading(false);
  };

  return (
    <Wrapper>
      <Form
        layout={"vertical"}
        form={form}
        initialValues={{ "file-type": "PDF", "file-name": "markdown" }}
      >
        <Form.Item<FieldType> label="导出文件类型" name="file-type">
          <Select
            options={[
              { value: "PDF", label: "PDF" },
              { value: "HTML", label: "HTML" },
            ]}
            placeholder="请选择导出文件类型"
          />
        </Form.Item>
        <Form.Item<FieldType> label="导出文件名" name="file-name">
          <Input placeholder="请填入文件名" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" loading={loading} style={{ width: "100%" }} onClick={handleExport}>
            导出
          </Button>
        </Form.Item>
      </Form>
    </Wrapper>
  );
};

export default Output;
