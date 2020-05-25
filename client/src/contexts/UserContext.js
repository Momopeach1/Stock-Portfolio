import React, { useState } from 'react';

import server from '../apis/server';

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

  const fetchUser = () => {
    server.get('/user/check')
      .then(response => setUser(response.data))
      .catch(err => console.log(err));
  }

  return(
    <UserContext.Provider value={{ user, setUser, isAuth, setIsAuth, fetchUser }}>
      { children }
    </UserContext.Provider>
  );
}

export default UserContext;