import { useState } from 'react'
import styles from './theme.module.scss'

export default function ModuleCSS() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const changeTheme = () => setIsDarkMode(!isDarkMode)

  return (
    <div
      className={`${styles.container} ${
        isDarkMode ? styles.dark : styles.light
      }`}
    >
      <button
        onClick={changeTheme}
        className='px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 ease-in-out'
      >
        切换主题
      </button>
      <div>css-test</div>
    </div>
  )
}
