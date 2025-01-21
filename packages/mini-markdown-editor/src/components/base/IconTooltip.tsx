import React, { FC } from 'react'
import { Tooltip } from '@arco-design/web-react'

const IconTooltip: FC<{
  content: string | React.ReactNode
  children: React.ReactNode
}> = ({ content, children }) => {
  return (
    <Tooltip mini position={'top'} content={content}>
      {children}
    </Tooltip>
  )
}

export default React.memo(IconTooltip)
