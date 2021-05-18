import React from 'react';

const Avatar = ({ url, altText }) => {
  return (
    <img className="h-10 rounded-full shadow-lg cursor-pointer transition duration-150 transform hover:scale-90" src={url} alt={altText}
    loading="lazy"
     />
  )
}

export default Avatar;