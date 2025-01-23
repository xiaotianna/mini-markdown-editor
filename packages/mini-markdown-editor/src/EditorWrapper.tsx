import { FC } from 'react'
import styled from 'styled-components'
import { useEditorContentStore } from '@/store/editor-content'
import Toolbar from '@/components/Toolbar'
import Editor from '@/components/Editor'
import Preview from '@/components/Preview'
import Status from '@/components/Status'
import { Grid } from '@arco-design/web-react'
const Row = Grid.Row
const Col = Grid.Col

const Container = styled.div`
  width: 100%;
  min-width: 700px;
  max-width: 1200px;
  min-height: 500px;
  height: 100%;
  border: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  background-color: #fff;
`

const StyledRow = styled(Row)`
  flex: 1;
  overflow: hidden;
  display: flex;
  position: relative;
  .arco-col {
    height: 100%;
  }
`

const Divider = styled.div`
  background-color: #e6e6e6;
  display: inline-block;
  height: 100%;
  width: 1px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const EditorWrapper: FC = () => {
  const { content } = useEditorContentStore()

  return (
    <>
      <Container>
        {/* 工具栏 */}
        <Toolbar />
        <StyledRow>
          <Col span={12}>
            {/* 编辑区 */}
            <Editor />
          </Col>
          {/* 分割线 */}
          <Divider />
          <Col span={12}>
            {/* 渲染区 */}
            <Preview content={content} />
          </Col>
        </StyledRow>
        {/* 底部状态栏 */}
        <Status />
      </Container>
    </>
  )
}

export default EditorWrapper
