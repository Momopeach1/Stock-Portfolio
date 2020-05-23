import React, { useContext, useState, useEffect } from 'react'


import UserContext from '../contexts/UserContext';
import server from '../apis/server';
import '../styles/Portfolio.css';

const Portfolio = () => {
  const { user } = useContext(UserContext);
  const [invValue, setInvValue] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({ ticker: '', shares: 0 });

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
        <div className="inventory-item">
          <div className="inventory-ticker">{i.ticker}</div>
          <div className="inventory-shares">{i.shares}</div>
          <div className="inventory-price">${i.latestPrice}</div>
        </div>
      )
    })
  }

  const handleInputChange = e => {
    console.log('e', e);
    console.log('e.target', e.target);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    server.put('/user/buy', form)
      .then(() => portValue())
      .catch(err => console.log(err));
  }

  useEffect(() => {
    portValue();
  }, [])

  return(
    <div className="portfolio-container">
      <div className="inventory-container">
        <h2>Portfolio (${invValue})</h2>
        {renderInventory()}
      </div>
      <hr/>
      <div className="buy-menu">
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Buy Menu:</legend>
            <label htmlFor="ticker" >Ticker </label>
            <input onChange={handleInputChange} name="ticker" id="ticker" type="text" />
            <br/>
            <label htmlFor="shares" >Shares </label>
            <input onChange={handleInputChange} id="shares" name="shares" type="number"/>
            <br/>
            <button>BUY</button>
          </fieldset>
        </form>
      </div>

    </div>
  )
}

export default Portfolio;