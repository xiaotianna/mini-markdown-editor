import { RouteObject, Navigate } from 'react-router-dom'
import UITest from '@/pages/ui-test'
import CssTest from '@/pages/css-test'
import CssInJs from '@/pages/css-in-js'
import ModuleCSS from '@/pages/module-css'
import Tailwindcss from '@/pages/tailwindcss'

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Navigate to='/ui-test' />
    },
    {
        path: '/ui-test',
        element: <UITest />
    },
    {
        path: '/css-test',
        element: <CssTest />,
        children: [
            {
                index: true,
                element: <Navigate to='/css-test/css-in-js' />
            },
            {
                path: 'css-in-js',
                element: <CssInJs />
            },
            {
                path: 'module-css',
                element: <ModuleCSS />
            },
            {
                path: 'tailwindcss',
                element: <Tailwindcss />
            }
        ]
    }
]

export default routes