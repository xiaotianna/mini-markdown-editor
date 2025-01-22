import { FC, useMemo } from 'react'
import styled from 'styled-components'
import { Checkbox } from '@arco-design/web-react'
import { useEditorContentStore } from '@/store/editor-content'

const StatusWrapper = styled.div`
  width: 100%;
  height: 24px;
  color: #3f4a54;
  border-top: 1px solid #e6e6e6;
  display: flex;
  flex-shrink: 0;
  font-size: 12px;
  height: 24px;
  justify-content: space-between;
  padding: 0 10px;
  .status {
    &-left {
      height: 100%;
      display: flex;
      align-items: center;
    }
    &-right {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      .checkbox {
        .arco-checkbox-text {
          margin-left: 5px;
        }
      }
      .checkbox-text {
        font-size: 12px;
      }
      .scroll-top {
        cursor: pointer;
      }
    }
  }
`

const Status: FC = () => {
  const { content } = useEditorContentStore()
  const contentNum = useMemo(() => {
    return content.replace(/[\s\n]/g, '').length
  }, [content])

  return (
    <StatusWrapper>
      <div className='status-left'>字数: {contentNum}</div>
      <div className='status-right'>
        <Checkbox className={'checkbox'} defaultChecked={true}>
          <span className='checkbox-text'>同步滚动</span>
        </Checkbox>
        <div className='scroll-top'>滚动到顶部</div>
      </div>
    </StatusWrapper>
  )
}
export default Status
