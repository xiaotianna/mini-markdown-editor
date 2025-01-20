import type { TokenTypeVal } from './tokens-types'

type PositionType = {
  start: {
    line: number
    column: number
    offset: number
  }
  end: {
    line: number
    column: number
    offset: number
  }
}

// 每个节点的类型
export interface Tokens {
  type: TokenTypeVal
  value?: string // 节点的值
  /**
   * 只对 heading 有效
   */
  depth?: number // 标题的层级
  /**
   * 只对 list 有效
   */
  ordered?: boolean // 是否有序
  /**
   * 只对 image、link 有效
   * （注意：link 没有 alt 属性）
   */
  title?: string | null // 图片、链接的标题
  url?: string // 图片、链接的链接
  alt?: string // 图片的alt
  /**
   * 只对 code 有效
   */
  lang?: string // 代码块的lang
  meta?: string | null // 代码块的meta(```js [meta])
  children?: Tokens[]
  position: PositionType
}

// 根节点类型
export interface RootTokens {
  type: 'root'
  children:  Tokens[]
  position: PositionType
}
