import { FC } from 'react'
import styled from 'styled-components'
import IconTooltip from '../base/IconTooltip'
import { toolbars } from '@/config/toolbar'

const ToolbarContent = styled.div`
  width: 100%;
  height: 35px;
  border-bottom: 1px solid #e6e6e6;
  padding: 4px;
  display: flex;
  align-items: center;
`

const ToolbarItemWrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-sizing: content-box;
  padding: 3px;
  border-radius: 3px;
  margin: 0 2px;
  transition: all 0.3s;
  &:hover {
    background-color: #e6e6e6;
  }
  img {
    width: 100%;
    height: 100%;
  }
`

const Divider = styled.div`
  background-color: #e6e6e6;
  display: inline-block;
  height: 16px;
  margin: 0 8px;
  position: relative;
  top: 0.1em;
  width: 1px;
`

const Toolbar: FC = () => {
  return (
    <ToolbarContent>
      {/* 渲染工具栏 */}
      {toolbars.map((item, index) => {
        if (item.type !== 'line') {
          // 工具栏 按钮
          const { icon, title } = item
          return (
            <ToolbarItemWrapper
              className='item'
              key={index}
            >
              <IconTooltip content={title}>
                <img
                  src={icon}
                  alt={title}
                />
              </IconTooltip>
            </ToolbarItemWrapper>
          )
        } else {
          // 分割线
          return <Divider key={index} />
        }
      })}
    </ToolbarContent>
  )
}

export default Toolbar
