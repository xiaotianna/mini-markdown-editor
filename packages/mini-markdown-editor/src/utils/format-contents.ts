export type Title = {
  key: string;
  href: string;
  title: string;
  children: Title[];
  nodeName: string;
};

// 格式化 preview 区标题的dom节点
export const formatContents = (rootElement: NodeListOf<HTMLElement>) => {
  // 将NodeList转换为数组，提取需要的属性
  const rootElementArr = Array.from(rootElement).map((item) => {
    const dataLine = item.getAttribute("data-line");
    const title = {
      key: dataLine,
      href: `#${dataLine}`,
      title: item.innerText,
      children: [],
      nodeName: item.nodeName,
    };
    return title;
  }) as Title[];

  let result = rootElementArr;
  let preLength = 0;
  let newLength = result.length;
  while (preLength !== newLength) {
    preLength = result.length;
    const list: Title[] = [];
    let childList: Title[] = [];
    for (let index = result.length - 1; index >= 0; index--) {
      if (
        result[index - 1] &&
        result[index - 1].nodeName.charAt(1) === result[index].nodeName.charAt(1)
      ) {
        childList.unshift(result[index]);
      } else if (
        result[index - 1] &&
        result[index - 1].nodeName.charAt(1) < result[index].nodeName.charAt(1)
      ) {
        childList.unshift(result[index]);
        result[index - 1].children = [...(result[index - 1].children as []), ...childList];
        childList = [];
      } else {
        childList.unshift(result[index]);
        if (childList.length > 0) {
          list.unshift(...childList);
        } else {
          list.unshift(result[index]);
        }
        childList = [];
      }
    }
    result = list;
    newLength = result.length;
  }
  return result;
};
