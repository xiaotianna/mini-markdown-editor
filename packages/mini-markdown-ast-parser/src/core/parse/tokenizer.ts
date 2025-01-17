import type { RootTokens } from '@/types/tokens'
import { type BlockFnParams, blocksParser } from './blocks'

// 词法分析器
export const tokenizer = (lines: string[], root: RootTokens) => {
  if (!Array.isArray(lines)) {
    return new Error('The parameter is an array')
  }

  let currentOffset = 0
  let currentStatus = {
    currentBlockquote: null,
    currentList: null,
    currentListItem: null
  }

  // 遍历每一行
  lines.forEach((line, index) => {
    // 去除首尾空格
    const trimmedLine = line.trim()

    // 分类存储不同 enforce 值的函数
    let preFunctions: ((params: BlockFnParams) => boolean)[] = []
    let noneFunctions: ((params: BlockFnParams) => void)[] = []

    // 第一版
    // for (const [key, block] of Object.entries(blocksParser)) {
    //   block({ trimmedLine, currentOffset, index, root, currentStatus })
    // }
    // 第二版（添加了 enforce 执行顺序）
    for (const [key, block] of Object.entries(blocksParser)) {
      if (typeof block === 'function') {
        noneFunctions.push(block)
      } else if (typeof block === 'object' && block !== null) {
        const { parse, enforce } = block
        if (typeof parse === 'function') {
          switch (enforce) {
            case 'pre':
              preFunctions.push(parse)
              break
            case 'none':
              noneFunctions.push(parse)
              break
          }
        }
      }
    }

    // 按顺序调用函数
    // let preFunctionExecuted = false
    // for (const fn of preFunctions) {
    //   if (fn({ trimmedLine, currentOffset, index, root, currentStatus })) {
    //     preFunctionExecuted = true
    //     break
    //   }
    // }

    // if (!preFunctionExecuted) {
    //   noneFunctions.forEach((fn) => {
    //     fn({ trimmedLine, currentOffset, index, root, currentStatus })
    //   })
    // }

    // 重置
    preFunctions = []
    noneFunctions = []
  })
}
