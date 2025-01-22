import { useRoutes, NavLink } from 'react-router-dom'
import routes from './router'

export default function App() {
  const outlet = useRoutes(routes)
  return (
    <>
      <header className='w-full h-10 flex items-center justify-center gap-5'>
        <NavLink to="/ui-test">组件库测试</NavLink>
        <NavLink to="/css-test">CSS主题切换方案测试</NavLink>
      </header>
      {outlet}
    </>
  )
}
