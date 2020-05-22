import React, { useContext, useState, useEffect } from 'react'
import sever from '../apis/server';


import UserContext from '../contexts/UserContext';
import server from '../apis/server';

const Portfolio = () => {
  const { user } = useContext(UserContext);
  const [invValue, setInvValue] = useState(null);
  const [inventory, setInventory] = useState([]);
  console.log(inventory);

  const portValue = () => {
    server.get('/user/inventory')
      .then(result => {
        console.log(result.data);
        let sum = 0;
        result.data.inventory.forEach(d => sum += d.latestPrice);
        setInvValue(sum);
        setInventory(result.data.inventory);
      })
      .catch(() => console.log('asdfsdfsd'));
  }

  const renderInventory = () => {
    return inventory.map(i => {
      return (
        <div>
          <div>{i.ticker}</div>
          <div>${i.latestPrice}</div>
        </div>
      )
    })
  }

  useEffect(() => {
    portValue();
  }, [])

  return(
    <>
      <h2>Portfolio</h2>
      <div>${invValue}</div>
      {renderInventory()}
    </>
  )
}

export default Portfolio;