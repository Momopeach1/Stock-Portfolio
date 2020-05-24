import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom'

import UserContext from '../contexts/UserContext';

const NavBar = () => {
  const { isAuth } = useContext(UserContext);

  const renderNavBar = () => {
    return isAuth? ( 
    <div className="navbar-container">
      <NavLink to="/transactions">Transactions</NavLink>
      <div className="navbar-divider"> | </div>
      <NavLink to="/portfolio">Portfolio</NavLink>
    </div>
    ) : null;
  }

  return renderNavBar();
};

export default NavBar;