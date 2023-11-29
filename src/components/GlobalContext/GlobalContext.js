import React, { createContext, useContext, useState, useEffect } from 'react';
import {GET} from "../../functionHelper/APIFunction"
const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {

  const [globalPackage, setGlobalPackage] = useState('Initial Value');

  const getData = () => {
    let apiURL = "api/user/get_profile";
      GET(
        process.env.REACT_APP_BASE_URL + apiURL
      ).then((res) => {
        setGlobalPackage(res.current_service_pack)
      })
    
  };
  useEffect(() => getData(), []);
  return (
    <GlobalContext.Provider value={{ globalPackage, setGlobalPackage }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

export { GlobalProvider, useGlobalContext };
