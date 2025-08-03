import React, { useState } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import About from './components/About'
import Home from './components/Home'
import userContext from './utils/UserContext'

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

  const [ user,setUser ] = useState(null)

  return (
    <userContext.Provider value={{ user, setUser }}>
      <RouterProvider router={appRouter} />
    </userContext.Provider>
  )
}

export default App
