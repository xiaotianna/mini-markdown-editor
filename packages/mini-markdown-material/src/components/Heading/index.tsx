import { FC } from 'react'
import styled from 'styled-components'
import { LineWrap } from '../../style/LineWrap'

/**
 *  '#' 这个字符，以及后面内容的样式（span包裹）
 */
const HeadingStyle = styled.span`
  color: #3f4a54;
  font-weight: bold;
  .heading-tag {
    color: #0000ff;
  }
`

const Heading: FC<{
  level: number
  children: React.ReactNode
}> = ({ level, children }) => {
  // switch (level) {
  //   case 1:
  //     return <HeadingStyle>
  //       <h1># {children}</h1>
  //     </HeadingStyle>
  //   case 2:
  //     return <h2>## {children}</h2>
  //   case 3:
  //     return <h3>### {children}</h3>
  //   case 4:
  //     return <h4>#### {children}</h4>
  //   case 5:
  //     return <h5>##### {children}</h5>
  //   case 6:
  //     return <h6>###### {children}</h6>
  //   default:
  //     return <></>
  // }
  return (
    <LineWrap>
      <HeadingStyle>
        <span className='heading-tag'>{'#'.repeat(level)}</span>
      </HeadingStyle>
      <HeadingStyle> {children}</HeadingStyle>
    </LineWrap>
  )
}

export { Heading }
