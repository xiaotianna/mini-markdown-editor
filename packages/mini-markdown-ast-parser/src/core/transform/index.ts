import type { RootTokens, Tokens } from '../../types/tokens'
import type { TokenTypeVal } from '../../types/tokens-types'
import { renderRoot } from './render/root'
import { renderHeading } from './render/heading'
import { renderText } from './render/text'
import { renderParagraph } from './render/paragraph'
import { renderBold } from './render/bold'
import { renderItalic } from './render/italic'
import { renderUnderline } from './render/underline'
import { renderDelete } from './render/delete'
import { renderThematicBreak } from './render/thematicBreak'
import { renderLink } from './render/link'
import { renderImage } from './render/image'
import { renderInlineCode } from './render/inlineCode'
import { renderCode } from './render/code'
import { renderBlockquote } from './render/blockquote'
import { renderList } from './render/list'
import { renderListItem } from './render/listItem'
import { renderTable } from './render/table'
import { renderTableRow } from './render/tableRow'
import { renderTableCell } from './render/tableCell'
import { renderHtml } from './render/html'

const nodeMap: Record<
  Partial<TokenTypeVal | 'root'>,
  (node: Tokens) => string
> = {
  root: renderRoot,
  heading: renderHeading,
  text: renderText,
  paragraph: renderParagraph,
  bold: renderBold,
  italic: renderItalic,
  underline: renderUnderline,
  delete: renderDelete,
  thematicBreak: renderThematicBreak,
  link: renderLink,
  image: renderImage,
  inlineCode: renderInlineCode,
  code: renderCode,
  blockquote: renderBlockquote,
  list: renderList,
  listItem: renderListItem,
  table: renderTable,
  tableRow: renderTableRow,
  tableCell: renderTableCell,
  html: renderHtml,
}

export const astToHtml = (node: RootTokens | Tokens): string => {
  const nodeType = node.type
  const nodeMapFn = nodeMap[nodeType]
  if (nodeMapFn) {
    return nodeMapFn(node as Tokens)
  }
  return ''
}

export const transformHtml = (ast: RootTokens): string => {
    const html = astToHtml(ast)
    return html
}
