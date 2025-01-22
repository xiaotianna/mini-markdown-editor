import { useState } from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

const theme = {
  light: {
    backgroundColor: 'white',
    textColor: 'black'
  },
  dark: {
    backgroundColor: 'black',
    textColor: 'white'
  }
}

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props) => {
      // console.log(props); // 获取到 ThemeProvider 的 theme 对象
      return props.theme.textColor
    }};
    transition: 0.5s all;
  }
`

export default function CssInJs() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  // 取反，等于切换主题样式
  const changeTheme = () => setIsDarkMode(!isDarkMode)
  return (
    <>
      <button 
        onClick={changeTheme} 
        className='px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 ease-in-out'
      >
        切换主题
      </button>
      <ThemeProvider theme={isDarkMode ? theme.dark : theme.light}>
        <GlobalStyle />
        css-test
      </ThemeProvider>
    </>
  )
}
