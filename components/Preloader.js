import React, { useState } from 'react';

// Preloader
// import { Planets } from 'react-preloaders';
// import RingLoader from "react-spinners/RingLoader";
import ClockLoader from "react-spinners/ClockLoader";
// import RiseLoader from "react-spinners/RiseLoader";
// import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

const Preloader = ({ loading }) => {
  let [color, setColor] = useState("#fff");

  return (
    <>
      {loading === false ? (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#131313] fixed top-0 left-0 z-50">
          {/* <RingLoader color={color} size={150} /> */}
          {/* <RiseLoader color={color} size={50} /> */}
          {/* <ClimbingBoxLoader color={color} size={50} /> */}
          <ClockLoader color={color} size={150} />
          <p className="font-sans text-sm text-[#fff] my-8">Loading garage...</p>
        </div>
      ) : null}
    </>
  )
}

export default Preloader;