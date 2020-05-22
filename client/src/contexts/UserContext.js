import React, { useState } from 'react';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: null,
    name: null,
    transactions: null,
    balance: null,
    inventory: null
  });

  const [isAuth, setIsAuth] = useState(null);

  return(
    <UserContext.Provider value={{ user, setUser, isAuth, setIsAuth }}>
      { children }
    </UserContext.Provider>
  );
}

export default UserContext;