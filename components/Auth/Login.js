import React, { useState, useRef, useEffect } from 'react';

// Next
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

// HEROICONS
import { MailIcon, LockClosedIcon, EyeIcon, EyeOffIcon, GoogleIcon } from '@heroicons/react/outline';

// Loader
import RiseLoader from "react-spinners/RiseLoader";

// Auth
import firebase, { auth } from '../../firebase.js';

const Login = () => {
  // Refs
  const passwordRef = useRef(null);
  const errorInfoRef = useRef(null);

  // Router
  const router = useRouter();

  // State Vars
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [blocking, setBlocking] = useState(false);

  // Error State
  const [emailErr, setEmailErr] = useState(null);
  const [passwordErr, setPasswordErr] = useState(null);

  const handleEmail = e => {
    setEmail(e.target.value);
  }

  const handlePassword = e => {
    setPassword(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    // resetForm();
    if (checkForm()) {
      // Block UI
      toggleBlocking(true);

      auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        let newUser = {
          "email": userCredential.user.email,
          "id": userCredential.user.uid,
          "deviceCheckedOutCount": 0
        }
        // Storage and caching
        window.localStorage.setItem('currentGarageUser', JSON.stringify(newUser));
        // Redirect
        setTimeout(() =>  router.push('/garage'), 2000);
      })
      .catch((error) => {
        // Block UI
        toggleBlocking(false);
        let errorCode = error.code;
        let errorMessage = error.message;
        // Update UI
        errorInfoRef.current.innerHTML = "Invalid Password or Email";
        console.log(errorMessage, errorCode, error);
      });
    } else {
      // Block UI
      toggleBlocking(false);
      return;
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
    if(passwordRef.current && isPasswordVisible) {
      passwordRef.current.type = "text";
    } else {
      passwordRef.current.type = "password";
    }
  }

  // Toogle UI BLock
  const toggleBlocking = (status) => {
    setBlocking(status);
  }

  const handleGoogleAUth = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      let credential = result.credential;
      console.log(credential);

      // This gives you a Google Access Token. You can use it to access the Google API.
      let token = credential.accessToken;
      // The signed-in user info.
      let user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // The email of the user's account used.
      let email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      let credential = error.credential;
      console.error(error);
      // ...
    });
  }

  const resetForm = () => {
    setEmail('');
    setPassword('');
  }

  const checkForm = () => {
    if (checkEmail() && checkPassword()) {
      return true;
    }
    else {
      return false;
    }
  }

  const checkEmail = () => {
    if(email === "") {
      errorInfoRef.current.innerHTML = "Email can't be Empty!";
      setEmailErr(true);
      return false;
    }
    else {
      if (validateEmail(email)) {
        errorInfoRef.current.innerHTML = "";
        setEmailErr(false);
        return true;
      }
      else {
        errorInfoRef.current.innerHTML = "Invalid Email!";
        setEmailErr(true);
        return false
      }
    }
  }

  const checkPassword = () => {
    if(password === "") {
      errorInfoRef.current.innerHTML = "Password can't be Empty!";
      setPasswordErr(true);
      return false;
    }
    else {
      errorInfoRef.current.innerHTML = "";
      setPasswordErr(false);
      return true;
    }
  }

  const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  useEffect(() => {
    if(window.localStorage.getItem('currentGarageUser')) {
      router.push('/garage');
    }
    return;
  }, [])

  return (
    <div className="h-screen bg-blue-500 fixed top-0 left-0 bottom-0 right-0 z-40 flex justify-center items-center">
      <div className="bg-white h-auto w-11/12 rounded-lg relative shadow-2xl md:max-w-sm md:mx-auto">
        {/* Header */}
        <div className="text-center m-3 mt-10 font-san">
          <b className="text-xl text-gray-900">Access The Garage</b> <br />
          <span className="text-sm text-gray-400">Fill in your details below to gain access</span>
          <div className="text-red-500 text-xs flex flex-col items-center justify-center w-11/12 mx-auto my-2" ref={errorInfoRef}></div>
        </div>

        {/* Form */}
        <form className="w-11/12 mx-auto flex flex-col justify-center items-center my-10" onSubmit={handleSubmit}>
        {/* Email */}
          <div className="flex w-11/12 relative overflow-hidden items-center my-2">
            <MailIcon className="h-5 absolute top-2 left-2 text-sm text-gray-300" />
            <input 
            className={`border border-gray-200 p-2 rounded-md flex-grow pl-10 text-sm font-sans text-gray-500 font-light focus:outline-none 
            ${emailErr === true ? 'border border-red-500' : emailErr === false ? 'border border-green-500' : 'border border-gray-200'}`}
            type="text" 
            placeholder="Email" 
            value={email}
            onChange={handleEmail}
            />
          </div>
          {/* Password */}
          <div className="flex w-11/12 relative overflow-hidden items-center my-2">
            <LockClosedIcon className="h-5 absolute top-2 left-2 text-sm text-gray-300" />
            <input 
            ref={passwordRef} 
            className={`border border-gray-200 p-2 rounded-md flex-grow pl-10 text-sm font-sans text-gray-500 font-light focus:outline-none 
             ${passwordErr === true ? 'border border-red-500' : passwordErr === false ? 'border border-green-500' : 'border border-gray-200'}`}
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={handlePassword}
            />
            {
              isPasswordVisible ? <EyeOffIcon className="h-5 absolute top-2 right-2 text-sm text-gray-300" onClick={togglePasswordVisibility} /> : 
              <EyeIcon className="h-5 absolute top-2 right-2 text-sm text-gray-300"  onClick={togglePasswordVisibility} />
            }
          </div>

          {/* Submit */}
          <button type="submit" className="my-3 bg-blue-500 focus:outline-none text-white p-3 w-11/12 rounded-md shadow-xl hover:shadow-none">Gain Access</button>

          {/* Alternative Auth with Providers */}
          <div className="flex justify-between items-center w-11/12 my-5">
            <span className="h-[0.5px] bg-gray-300 w-6/12"></span>
            <span className="text-sm text-gray-500 mx-4">OR</span>
            <span className="h-[0.5px] bg-gray-300 w-6/12"></span>
          </div>

          <div className="my-3 focus:outline-none bg-white text-blue-700 p-3 w-11/12 rounded-md 
          border border-blue-500 relative active:bg-blue-500 active:text-white flex items-center justify-center cursor-pointer"
          onClick={handleGoogleAUth}
          >
            <i className="la la-google-plus text-blue-500 text-3xl absolute left-5"></i> Signin With Google
          </div>

          {/* Register */}
          <div className="my-4">
            <div onClick={() => router.push('/register')} className="hover:underline text-blue-500 text-sm font-sans text-center cursor-pointer">New here? Register an Account</div>
          </div>
        </form>
      </div>

      {/* Blocking Ui */}
      {
        blocking ? (
          <div className="bg-[rgba(255,255,255,0.7)] flex items-center justify-center h-screen w-full overflow-hidden fixed top-0 left-0 bottom-0 right-0 z-50">
            <RiseLoader color={'#3b82f6'} size={10} />
          </div>
        ) : null
      }
    </div>
  )
}

export default Login;