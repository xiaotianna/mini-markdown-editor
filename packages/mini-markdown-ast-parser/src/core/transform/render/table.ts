import { Tokens } from '@/types/tokens'
import { astToHtml } from '..'
import { prefix } from '@/common/constant'

export const renderTable = (node: Tokens) => {
  return `<table class="${prefix}-table">${node.children?.map(astToHtml).join('')}</table>`
}
