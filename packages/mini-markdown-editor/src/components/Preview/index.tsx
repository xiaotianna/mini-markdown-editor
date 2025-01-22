import { FC } from 'react'
import { parseMarkdown, transformHtml } from '@mini-markdown/ast-parser'
import '@/assets/styles/preview.css'
import 'highlight.js/styles/atom-one-dark.css'

import styled from 'styled-components'
import { useEditorContentStore } from '@/store/editor-content'

const ScrollWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 10px;
`

const Preview: FC = () => {
  const { content } = useEditorContentStore()
  const ast = parseMarkdown(content)
  console.log(ast);
  
  const node = transformHtml(ast)
  return (
    // className='markdown-editor-preview' 重置样式的节点
    <ScrollWrapper className='markdown-editor-preview'>
      <div dangerouslySetInnerHTML={{ __html: node.toString() }}></div>
    </ScrollWrapper>
  )
}
export default Preview
