import React, { useContext, useState, useEffect } from 'react';

import UserContext from '../contexts/UserContext';
import server from '../apis/server';
import '../styles/Portfolio.css';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import Typography from '@material-ui/core/Typography';

const Portfolio = () => {
  const { user, fetchUser } = useContext(UserContext);
  const [invValue, setInvValue] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ ticker: '', shares: 0 });

  const portValue = () => {
    server.get('/user/inventory')
      .then(result => {
        let sum = 0;
        result.data.inventory.forEach(d => sum += d.latestPrice* d.shares);
        setInvValue(sum);
        setInventory(result.data.inventory);
      })
      .catch(() => console.log('Error retreving inventory'));
  }

  const renderInventory = () => {
    return inventory.map(i => {
      return (
        <>
        <div className="inventory-item">
          <Button variant="outlined" disabled style={{ color: getColor(i.latestPrice, i.openPrice, i.change) }} >{i.ticker}</Button>
          <div> -> </div>
          <div> {i.shares} Shares </div>
          <Button 
          variant="contained" 
          disabled 
          style={{ color: getColor(i.latestPrice, i.openPrice, i.change) }}
          >
            ${Number.parseFloat(i.latestPrice*i.shares).toFixed(2)}
          </Button>
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
    if(form.shares <= 0){
      setErr('Enter a number greater than zero!');
      return;
    } 
    server.put('/user/buy', form)
      .then(() => {
        portValue();
        setErr('');
        fetchUser();
      })
      .catch(err => setErr(err.response.data.message || err.response.data));
  };

  //OpenPrice is null at times for IEX so we can use change if that happens
  const getColor = (latestPrice, openPrice, change) => {
    console.log(latestPrice, openPrice, change);
    if(openPrice){
      if(latestPrice === openPrice) return 'gray';
      else if(latestPrice>openPrice) return 'green';
      else return 'red';
    } else{
      if(change>0) return 'green';
      else if (change <0) return 'red';
      else return 'gray';
    }
  };



  useEffect(() => {
    portValue();
    //updated the portfolio every x seconds to reflect stock changes
    const interval = setInterval(() => {
      portValue();
    }, 5000);

    return () => { 
      setErr('');
      clearInterval(interval); 
    };
  }, [])

  
  



  return(
    <>
    <div className="portfolio-title">
    <FolderOpenOutlinedIcon color="green" style={{ fontSize: 50, paddingRight: 20 }} />
    <Typography variant="h2" color="green">
      Portfolio (${Number.parseFloat(invValue).toFixed(2)})
    </Typography>
    </div>
    <br/>
    <div className="portfolio-container">
      <div className="inventory-container">
        {renderInventory()}
      </div>
      <div className="buy-menu">
        <Paper elevation={3} className="paper">
          <Avatar className="avatar">
            <AttachMoneyIcon/>
          </Avatar>
          <div className="user-balance">Cash - ${Number.parseFloat(user.balance).toFixed(2)}</div>
          <form onSubmit={handleSubmit} className="form" noValidate>
            <div className="error-message">{err}</div>
            <TextField 
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Ticker"
              name="ticker" 
              id="ticker" 
              type="text"
              autoFocus
              onChange={handleInputChange} 
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Amount of shares"
              min="1" 
              id="shares" 
              name="shares" 
              type="number"
              onChange={handleInputChange} 
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="submit">
                Buy Stock(s)
              </Button>
          </form>
        </Paper>
      </div>
    </div> 
    </>
  )
}

export default Portfolio;