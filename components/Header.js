import React, { useState, useEffect } from 'react';

// NEXT
import { useRouter } from 'next/router';

// Hero Icons
import { CogIcon } from '@heroicons/react/outline';

// Firebase
import firebase, { auth } from '../firebase';

// components
import Avatar from './Avatar';

const Header = () => {
  // router
  const router = useRouter();

  // state
  const [username, setUsername] = useState(null);

  const logout = () => {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      // Remove storage and cache
      window.localStorage.clear();
      // Redirect
      router.push('/');
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
    
  }

  useEffect(() => {
   if (window.localStorage.getItem('currentGarageUser')) {
    let currentUser = window.localStorage.getItem('currentGarageUser');
    let name = JSON.parse(currentUser).email.substring(0,2).toUpperCase();
    setUsername(name);
   }
   return;
  }, [])

  return (
    <header className="sticky top-0 z-10 bg-white w-full h-20 bg-white-800 shadow-sm flex items-center justify-between">
      <div className="h-full w-6/12 md:w-3/12 flex items-center">
        <div className="h-full w-4/12 border border-gray-100 flex items-center justify-center">
          <CogIcon className="h-10 cursor-pointer transition duration-100 hover:scale-125 text-blue-500" />
        </div>
        <h1 className="text-lg text-gray-700 ml-3 font-normal font-sans">Testing Garage</h1>
      </div>

      {/* Right */}
      <div className="h-full w-3/12 md:w-44 flex justify-end items-center pr-5 relative group cursor-pointer">
        {/* <Avatar url="pflash.jpg" altText="user image" /> */}
        <div className="flex items-center justify-center bg-purple-800 text-white font-sans rounded-full h-9 w-9 shadow-xl cursor-pointer">{username}</div>
        {/* Tooltip */}
        <div className="absolute top-4 -left-20 -m-2 md:-left-5 md:top-2 md:m-0 w-32">
          {/* <span className="flex justify-center items-center p-2 bg-black text-white rounded-md text-xs shadow-lg w-full">Precious Adeyinka</span>
          <span className="border-8 border-solid border-black absolute -top-3 right-2"></span> */}
          <span className="tooltip-left hidden group-hover:block cursor-pointer" onClick={logout}>
            <div className="text-white text-sm flex items-center space-x-2 m-0"><i className="la la-sign-in-alt text-xl"></i> <span>Signout</span></div>
          </span>
          {/* <div className="bg-blue-500 rounded-lg h-8 w-full shadow-lg my-3 z-50 flex flex-col items-center justify-center p-2 tooltip">
            <div className="text-white text-sm flex items-center space-x-2"><i className="la la-sign-in-alt text-xl"></i> <span>Signout</span></div>
          </div> */}
        </div>
      </div>
    </header>
  )
}

export default Header;