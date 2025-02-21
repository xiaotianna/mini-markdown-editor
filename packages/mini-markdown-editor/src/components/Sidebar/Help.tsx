import { CLASS_PREFIX } from "@/common";
import { grammar, shortcuts } from "@/common/help";
import { FC } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .title {
    font-weight: 600;
    margin: 5px 0 16px;
    /* color: #3f4a54; */
    color: ${(props) => props.theme.silderHelpTitleColor};
  }
  .grammar-list {
    margin: 0;
    padding: 0;
    list-style: none;
    /* color: #959da5; */
    color: ${(props) => props.theme.silderHelpTextColor};
    padding-bottom: 5px;
    box-sizing: content-box;
    .grammar-item {
      display: flex;
      align-items: center;
      font-size: 13px;
      margin-bottom: 12px;
      .icon {
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 7.5px;
        /* fill: #959da5; */
        fill: ${(props) => props.theme.silderHelpTextColor};
      }
      .rule {
        margin-left: auto;
        code {
          font-size: 12px;
        }
      }
    }
  }
`;

// 语法
const RenderRules: FC<{
  title: string;
  rules: Array<{
    title: string;
    icon: string;
    rule: string;
  }>;
}> = ({ title, rules }) => {
  return (
    <>
      <p className="title">{title}</p>
      <ul className="grammar-list">
        {rules.map((item, index) => {
          return (
            <div key={`grammar-${index}`} className="grammar-item">
              <div className="icon" dangerouslySetInnerHTML={{ __html: item.icon }}></div>
              <div>{item.title}</div>
              <div className="rule">
                <code>{item.rule}</code>
              </div>
            </div>
          );
        })}
      </ul>
    </>
  );
};

const Help: FC = () => {
  return (
    <Wrapper className={`${CLASS_PREFIX}-sidebar-help`}>
      {/* 语法规则 */}
      <RenderRules title="Markdown 语法" rules={grammar} />
      {/* 快捷键 */}
      <RenderRules title="快捷键" rules={shortcuts} />
    </Wrapper>
  );
};

export default Help;
