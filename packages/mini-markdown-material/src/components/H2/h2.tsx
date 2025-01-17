import { FC } from 'react'
import styled from 'styled-components'

const HeadingStyle = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

const Heading: FC<{
  level: number,
  children: React.ReactNode
}> = ({ level, children }) => {
  switch (level) {
    case 1:
      return <HeadingStyle>
        <h1># {children}</h1>
      </HeadingStyle>
    case 2:
      return <h2>## {children}</h2>
    case 3:
      return <h3>### {children}</h3>
    case 4:
      return <h4>#### {children}</h4>
    case 5:
      return <h5>##### {children}</h5>
    case 6:
      return <h6>###### {children}</h6>
    default:
      return <></>
  }
}

export {
  Heading
}
