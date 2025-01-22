import { NavLink, Outlet } from 'react-router-dom';
export default function CssTest() {
  return (
    <>
        <nav className='w-full h-10 flex justify-center items-center gap-5'>
            <NavLink to={'/css-test/css-in-js'}>css-in-js</NavLink>
            <NavLink to={'/css-test/module-css'}>module-css</NavLink>
            <NavLink to={'/css-test/tailwindcss'}>原子化css</NavLink>
        </nav>
        <main>
            <Outlet />
        </main>
    </>
  )
}
