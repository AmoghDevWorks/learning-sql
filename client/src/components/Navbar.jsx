import React, { useContext, useState } from 'react'
import { X, Sprout } from 'lucide-react';
import userContext from '../utils/UserContext';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { user,setUser } = useContext(userContext)

    const navItems = [
        { name: 'Home', to:'home'},
        { name: 'About', to:'about'}
    ];

    const handleLogout = () =>{
        setUser(null)
    }

    return (
        <nav className="bg-green-600 shadow-lg p-3 flex items-center justify-between">
            <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                <Sprout className="h-8 w-8 text-green-200" />
                <span className="ml-2 text-xl font-bold text-white">FarmTracker</span>
                </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
                {navItems.map((item) => (
                <a
                    key={item.name}
                    href={item.href}
                    className="flex hover:cursor-pointer items-center px-3 py-2 rounded-md text-sm font-medium text-green-100 hover:text-white hover:bg-green-600 transition-colors duration-150"
                >
                    {item.name}
                </a>
                ))}
            </div>
            <div>
                { !user && 
                    <div className='px-3 py-2 bg-white text-green-600 rounded-2xl text-md font-semibold hover:cursor-pointer'>
                        Login
                    </div>
                }
                {
                    user && 
                    <div 
                        className='px-3 py-2 bg-white text-green-600 rounded-2xl text-md font-semibold hover:cursor-pointer'
                        onClick={handleLogout}
                    >
                        Logout
                    </div>  
                }
            </div>
        </nav>
    )
}

export default Navbar
