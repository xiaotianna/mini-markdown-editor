const path = require("path");
const fs = require("fs");

/**
 * 自定义loader，用于将 mdx 文件中自定义源数据（ initVal 的值转为某个文件的内容）
 * 例如：
 * ---
 * pageType: custom
 * initVal: './data.raw.txt'
 * ---
 *
 * 使用：
 * import { usePageData } from "rspress/runtime";
 * const pageData = usePageData()
 * pageData.page.frontmatter.initVal
 */
module.exports = function (source) {
  // 使用正则表达式匹配 initVal 后的内容
  const initValMatch = source.match(/initVal:\s*['"]([^'"]+)['"]/);
  if (initValMatch && initValMatch[1]) {
    const initVal = initValMatch[1].trim();
    // 获取当前文件的绝对路径 resourcePath(webpack内置的)
    const currentFilePath = this.resourcePath;
    // 将相对路径转换为绝对路径
    const absolutePath = path.resolve(path.dirname(currentFilePath), initVal);

    // 读取文件内容
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const newSource = source.replace(initValMatch[0], `initVal: '${fileContent}'`);
    return newSource;
  }
  return source;
};
