// 创建类型节点的token
export const createToken = (type: string, value: string, position: number, length: number) => {
  return {
    type,
    value,
    position,
    length,
  }
}