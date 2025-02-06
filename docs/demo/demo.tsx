import React from "react";
import { Editor } from "@mini-markdown/editor";

export default function Demo() {
  return (
    <div style={{ width: "100vw", padding: "50px" }}>
      <Editor status={true} local={false} />
    </div>
  );
}
