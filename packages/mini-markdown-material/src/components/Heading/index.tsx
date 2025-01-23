import { FC } from 'react'
import styled from 'styled-components'
import { LineWrap } from '@/components/base/LineWrap'

/**
 *  '#' 这个字符，以及后面内容的样式（span包裹）
 */
const HeadingStyle = styled.span`
  color: #3f4a54;
  font-weight: bold;
  font-size: ${props => {
    switch (props.level) {
      case 1: return '2em';
      case 2: return '1.5em';
      case 3: return '1.17em';
      case 4: return '1em';
      case 5: return '0.83em';
      case 6: return '0.67em';
      default: return '1em';
    }
  }};
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
