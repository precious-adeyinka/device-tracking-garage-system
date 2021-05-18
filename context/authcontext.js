import React, { createContext, useReducer, useState } from 'react';

const authContext = createContext();

// Initial State
const initialState = {
  auth: {
    isLoggedIn: false,
    user: {
      email: '',
      token: "",
      id: ""
    }
  },
  devices: {
    total: 10,
    data: []
  }
};

export const authProvider = ({ children }) => {
  const [] = useState();

  return (
    <div></div>
  )
};