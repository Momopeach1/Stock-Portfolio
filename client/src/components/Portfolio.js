import React, { useContext, useState, useEffect } from 'react'

import UserContext from '../contexts/UserContext';
import server from '../apis/server';
import '../styles/Portfolio.css';

const Portfolio = () => {
  const { user, fetchUser } = useContext(UserContext);
  const [invValue, setInvValue] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ ticker: '', shares: 0 });

  const portValue = () => {
    server.get('/user/inventory')
      .then(result => {
        console.log(result.data);
        let sum = 0;
        result.data.inventory.forEach(d => sum += d.latestPrice* d.shares);
        setInvValue(sum);
        setInventory(result.data.inventory);
      })
      .catch(() => console.log('asdfsdfsd'));
  }

  const renderInventory = () => {
    return inventory.map(i => {
      return (
        <>
        <div className="inventory-item">
          <div className="inventory-ticker">{i.ticker} - </div>
          <div className="inventory-shares"> {i.shares} Shares </div>
          <div className="inventory-price" style={{ color: getColor(i.latestPrice, i.openPrice) }}>${i.latestPrice*i.shares}</div> 
        </div>
        <hr/>
        </>
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
      .then(() => {
        portValue();
        setErr('');
        fetchUser();
      })
      .catch(err => setErr(err.response.data.message || err.response.data));
  };

  const getColor = (latestPrice, openPrice) => {
    if(latestPrice === openPrice) return 'gray';
    else if(latestPrice>openPrice) return 'green';
    else return 'red';
  };



  useEffect(() => {
    portValue();
    return () => { setErr(''); };
  }, [])



  return(
    <>
    <h1 className="portfolio-title">Portfolio (${Number.parseFloat(invValue).toFixed(2)})</h1>
    <br/>
    <div className="portfolio-container">
      <div className="inventory-container">
        {renderInventory()}
      </div>
      <div className="buy-menu">
        <div className="user-balance">Cash - ${Number.parseFloat(user.balance).toFixed(2)}</div>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Buy Menu:</legend>
            <div className="error-message">{err}</div>
            <label htmlFor="ticker" >Ticker </label>
            <input onChange={handleInputChange} name="ticker" id="ticker" type="text" />
            <br/>
            <label htmlFor="shares" >Shares </label>
            <input min="1" onChange={handleInputChange} id="shares" name="shares" type="number"/>
            <br/>
            <button>BUY</button>
          </fieldset>
        </form>
      </div>
    </div>
    </>
  )
}

export default Portfolio;