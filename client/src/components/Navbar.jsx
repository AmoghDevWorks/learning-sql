import React, { useContext, useState } from 'react'
import { X, Sprout,Tractor,Users  } from 'lucide-react';
import userContext from '../utils/UserContext';
import { Link, useNavigate } from 'react-router-dom'
import roleContext from '../utils/RoleContext';

const Navbar = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);

    const { user,setUser } = useContext(userContext)
    const { role,setRole } = useContext(roleContext)

    const [ localRole,setlocalRole ] = useState(null)
    const [ error,setError ] = useState(null)

    const navigate = useNavigate()

    const navItems = [
        { name: 'Home', to:'/'},
        { name: 'About', to:'/about'},
        { name: 'Contact',to:'/contactUs'},
    ];

    const farmerNavItems = [
        { name: 'Upload', to:'/uploadProduct'},
        { name: 'Uploaded Products', to:'/allProducts'}
    ]

    const consumerNavItems = [
        { name: 'Order', to:'/viewFarmerProducts'}
    ]

    const handleModal = () =>{
        if(!isOpenModal){
            setlocalRole(null)
            setError(null)
        }
        setIsOpenModal(!isOpenModal)
    }

    const handleLogout = () =>{
        setUser(null)
        setRole(null)
        alert('Successfully signed Out')
        setTimeout(() => {
            navigate('/')
        }, 2000);
    }

    const handleClick = () =>{
        if(!localRole){
            setError('Select your Role')
            return;
        } 

        if(localRole === 'farmer'){
            navigate('/farmerSignIn')
        }else{
            navigate('/buyerSignIn')
        }

        setIsOpenModal(false)
        setlocalRole(null)
        setError(null)
    }

    if(isOpenModal){
        return(
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50">
                <div className="bg-white rounded-lg shadow-lg w-fit max-w-full">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-800">Choose Your localRole</h2>
                        <button onClick={handleModal}>
                            <X className="h-5 w-5 text-gray-600 hover:text-black" />
                        </button>
                    </div>

                    {/* Modal Body (optional) */}
                    <div className="p-4">
                        {/* localRole selection buttons or UI goes here */}
                        <div className='flex items-center gap-10'>
                            <div
                                className={`cursor-pointer min-h-40 min-w-40 bg-slate-100 rounded-xl flex items-center justify-center flex-col ${localRole === 'farmer' ? 'border-2 border-green-700' : ''}`}
                                onClick ={()=>setlocalRole('farmer')}
                            >
                                <Tractor className='h-20 w-20 text-green-700' />
                                <p className='text-2xl font-semibold'>Farmer</p>
                            </div>
                            <div 
                                className={`cursor-pointer min-h-40 min-w-40 bg-slate-100 rounded-xl flex items-center justify-center flex-col ${localRole === 'consumer' ? 'border-2 border-green-700' : ''}`}
                                onClick={()=>setlocalRole('consumer')}
                            >
                                <Users className='h-20 w-20 text-green-700' />
                                <p className='text-2xl font-semibold'>Consumer</p>
                            </div>
                        </div>
                    </div>

                    {error && <div className='text-md text-center font-semibold text-red-700'>{error}</div>}

                    {/* Modal footer */}
                    <div className='flex items-center justify-center py-4'>
                        <button
                            className='text-xl px-4 py-2 bg-green-700 rounded-lg text-slate-50'
                            onClick={handleClick}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <nav className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-800 shadow-lg p-3 flex items-center justify-between">
            <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                <Sprout className="h-8 w-8 text-green-200" />
                <span className="ml-2 text-xl font-bold text-white">FarmTracker</span>
                </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.to}
                        className="flex hover:cursor-pointer items-center px-3 py-2 rounded-md text-md font-semibold text-green-100 hover:text-white hover:bg-green-600 transition-colors duration-150"
                    >
                        {item.name}
                    </Link>
                ))}
                {role === 'farmer' &&  
                    farmerNavItems.map(item => {
                        return(
                            <Link
                                key={item.name}
                                to={item.to}
                                className="flex hover:cursor-pointer items-center px-3 py-2 rounded-md text-md font-semibold text-green-100 hover:text-white hover:bg-green-600 transition-colors duration-150"
                            >
                                {item.name}
                            </Link>
                        )
                    })
                }
                {role === 'consumer' && 
                    consumerNavItems.map(item => (
                            <Link
                                key={item.name}
                                to={item.to}
                                className="flex hover:cursor-pointer items-center px-3 py-2 rounded-md text-md font-semibold text-green-100 hover:text-white hover:bg-green-600 transition-colors duration-150"
                            >
                                {item.name}
                            </Link>
                    ))
                }
            </div>
            <div>
                { 
                    !user ? (
                        <div 
                            className='px-3 py-2 bg-white text-green-600 rounded-2xl text-md font-semibold hover:cursor-pointer' 
                            onClick={handleModal}
                        >
                            Login
                        </div>
                    ):(
                        <div 
                            className='px-3 py-2 bg-white text-green-600 rounded-2xl text-md font-semibold hover:cursor-pointer'
                            onClick={handleLogout}
                        >
                            Logout
                        </div>  
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar
