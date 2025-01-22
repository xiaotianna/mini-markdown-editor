import { useEditorContentStore } from '@/store/editor-content'
import React, { FC } from 'react'
import styled from 'styled-components'

const ScrollWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 5px 10px;
  .editor-content {
    width: 100%;
    min-height: 100%;
    font-size: 16px;
    line-height: 24px;
    outline: none; // 移除默认的边框
  }
`

const Editor: FC = () => {
  const { setContent } = useEditorContentStore()
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = (e.currentTarget as HTMLDivElement).innerText
    // console.log(newContent);
    setContent(newContent)
  }

  return (
    <ScrollWrapper>
      <div
        className='editor-content'
        contentEditable={true} // 允许内容可编辑
        spellCheck={false} // 关闭拼写检查
        suppressContentEditableWarning={true} // 关闭内容不可编辑警告
        autoFocus={true} // 自动聚焦
        onInput={handleInput}
      >
      </div>
    </ScrollWrapper>
  )
}

export default Editor
