import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom'

import UserContext from '../contexts/UserContext';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';




const NavBar = () => {
  const { isAuth } = useContext(UserContext);

  const renderNavBar = () => {
    return isAuth? ( 
      <div className="navbar-container" >
        <ButtonGroup 
          size="large" color="primary" 
          aria-label="large outlined primary button group"
          >
          <NavLink to="/transactions">
            <Button>Transactions</Button>
          </NavLink>
          <NavLink to="/portfolio">
            <Button>Portfolio</Button>
          </NavLink>
        </ButtonGroup>
      </div>
    ) : null;
  }

  return renderNavBar();
};

export default NavBar;