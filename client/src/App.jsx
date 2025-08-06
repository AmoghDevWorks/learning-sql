import React, { useState } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import About from './components/About'
import Home from './components/Home'
import UserContext from './utils/UserContext'
import RoleContext from './utils/RoleContext'
import FarmerProducts from './buyer/FarmerProducts'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FarmerSignIn from './farmer/FarmerSignIn'
import FarmerSignUp from './farmer/FarmerSignUp'
import BuyerSignUp from './buyer/BuyerSignUp'
import BuyerSignIn from './buyer/BuyerSignIn'
import ContactUs from './components/ContactUs'
import UploadProduct from './farmer/UploadProduct'
import AllProducts from './farmer/AllProducts'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Structure = () =>{
  return (
    <div>
      <ToastContainer />
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
      },
      {
        path:'/contactUs',
        element:<ContactUs />
      },
      {
        path:'/uploadProduct',
        element:<UploadProduct />
      },
      {
        path:'/viewFarmerProducts',
        element:<FarmerProducts />
      },
      {
        path:'/allProducts',
        element:<AllProducts />
      }
    ]
  }
])

const App = () => {

  const [ user,setUser ] = useState(null)
  const [ role,setRole ] = useState(null)

  return (
    <RoleContext.Provider value={{ role,setRole }}>
      <UserContext.Provider value={{ user, setUser }}>
        <RouterProvider router={appRouter} />
      </UserContext.Provider>
    </RoleContext.Provider>
  )
}

export default App
