import React, { useState } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import About from './components/About'
import Home from './components/Home'
import UserContext from './utils/UserContext'
import FarmerProducts from './buyer/FarmerProducts'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FarmerSignIn from './farmer/FarmerSignIn'
import FarmerSignUp from './farmer/FarmerSignUp'
import BuyerSignUp from './buyer/BuyerSignUp'
import BuyerSignIn from './buyer/BuyerSignIn'

const Structure = () =>{
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
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
      },
      {
        path:'/farmerProducts',
        element:<FarmerProducts />
      },
      {
        path:'/farmerSignIn',
        element:<FarmerSignIn />
      },
      {
        path:'/farmerSignUp',
        element:<FarmerSignUp />
      },
      {
        path:'/buyerSignUp',
        element:<BuyerSignUp />
      },
      {
        path:'/buyerSignIn',
        element:<BuyerSignIn />
      }
    ]
  }
])

const App = () => {

  const [ user,setUser ] = useState(null)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <RouterProvider router={appRouter} />
    </UserContext.Provider>
  )
}

export default App
