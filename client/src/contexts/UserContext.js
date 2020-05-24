import React, { useState } from 'react';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: '',
    name: '',
    transactions: [],
    balance: 0,
    inventory: []
  });

  const [isAuth, setIsAuth] = useState(null);

  return(
    <UserContext.Provider value={{ user, setUser, isAuth, setIsAuth }}>
      { children }
    </UserContext.Provider>
  );
}

export default UserContext;