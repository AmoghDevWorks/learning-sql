import React from 'react';
import { Copyright } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="bg-green-600 flex items-center justify-center p-4 border-t-2 border-green-800">
      <p className="text-xl font-semibold text-white">
        FarmTracker
      </p>
      <Copyright className="h-6 w-6 text-green-200 mx-2" />
      <p className='text-white'>{year}</p>
    </div>
  );
};

export default Footer;
