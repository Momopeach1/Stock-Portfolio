import React, { useContext, useEffect } from 'react';
import UserContext from '../contexts/UserContext';
import server from '../apis/server';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import BallotIcon from '@material-ui/icons/Ballot';

const Transactions = () => {
  const { user, setUser } = useContext(UserContext);

  const fetchUser = () => {
    server.get('/user/check')
      .then(result => setUser(result.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const renderTransactions = () => user.transactions.map(item => (
    <>
    <div className="inventory-item">  
      <div> BUY </div>
      <Button variant="outlined" disabled style={{ color: "black" }}>({item.ticker})</Button>
      <div> - </div>
      <div>{item.shares} Shares </div>
      <div> @ {item.atPrice}</div>
    </div>
    <hr/>
    </>
  ));
  return(
    <div className="transaction-page">
      <div className="portfolio-title">
        <BallotIcon color="green" style={{ fontSize: 50, paddingRight: 20 }} />
        <Typography variant="h2">
            Transactions
         </Typography>
    </div>
      <div className="transaction-log-container">
      {renderTransactions()}
      </div>
    </div>
  );
}

export default Transactions;