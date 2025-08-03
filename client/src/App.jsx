import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import About from './components/About'
import Home from './components/Home'

const Structure = () =>{
  return (
    <div>
      <Outlet />
    </div>
  )
}

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Structure />,
    children:[
      {
        path:'/',
        element:<Home />
      },
      {
        path:'/about',
        element:<About />
      }
    ]
  }
])

const App = () => {
  return (
    <RouterProvider router={appRouter}>
      <Structure />
    </RouterProvider>
  )
}

export default App
