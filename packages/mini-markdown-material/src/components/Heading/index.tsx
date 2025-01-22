import { FC } from 'react'
import styled from 'styled-components'
import { LineWrap } from '@/components/base/LineWrap'

/**
 *  '#' 这个字符，以及后面内容的样式（span包裹）
 */
const HeadingStyle = styled.span`
  color: #3f4a54;
  font-weight: bold;
  color: #0000ff;
  .heading-tag {
    color: #0000ff;
  }
`

export type PropsType = {
  level: number
  children: React.ReactNode
}

const Heading: FC<PropsType> = ({ level, children }) => {
  return (
    <LineWrap>
      <HeadingStyle>
        <span className='heading-tag'>{'#'.repeat(level)}</span>
      </HeadingStyle>
      <HeadingStyle> {children}</HeadingStyle>
    </LineWrap>
  )
}

export default Heading
