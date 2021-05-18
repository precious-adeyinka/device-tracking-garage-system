import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// next
import { useRouter } from 'next/router';

// components
import Header from '../components/Header';
import Preloader from '../components/Preloader';
import Grid from '../components/Grid';

// Firebase
import { database } from '../firebase';



export default function Garage () {
  // router
  const router = useRouter();

  // state
  const [loading, setLoading] = useState(false);

  // Refs
  const appRef = useRef(null);

  useEffect(() => {
    if (appRef.current) {
      setTimeout(() => setLoading(true), 5000)
    } else {
      setLoading(false);
    }

    if (!window.localStorage.getItem('currentGarageUser')) {
      router.push('/');
    }
  }, [])

  return (
    <div className="h-screen bg-blue-50" ref={appRef}>
      <Head>
        <title>Johnson & Johnson Software Garage - Testing Device Tracking System</title>
        <meta charset-="utf-8" />
        <meta name="description" content-="A minimal Testing Device Tracking System" />
        <meta name="author" content-="Precious Adeyinka" />
        {/* <meta name="viewport" content-="width=device-width, initial-scale=1" /> */}
        <link rel="icon" href="/favicon.ico" />
        {/* Line Awesome - Icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/line-awesome/1.3.0/line-awesome/css/line-awesome.min.css" integrity="sha512-vebUliqxrVkBy3gucMhClmyQP9On/HAWQdKDXRaAlb/FKuTbxkjPKUyqVOxAcGwFDka79eTF+YXwfke1h3/wfg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      </Head>
      {/* PRELOADERS */}
      <Preloader loading={loading} />

      {/* HEADER */}
      <Header />

      {/* MAIN */}
      <Grid />
    </div>
  )
}