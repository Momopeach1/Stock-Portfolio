import React, { useContext, useEffect } from 'react';
import UserContext from '../contexts/UserContext';
import server from '../apis/server';

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
    <div className="transaction-log">  
      <div>BUY </div>
      <div>({item.ticker}) - </div>
      <div>{item.shares} Shares </div>
      <div> @ {item.atPrice}</div>
    </div>
    <hr/>
    </>
  ));
  return(
    <div className="transaction-page">
      <h1>Transactions</h1>
      <div className="transaction-log-container">
      {renderTransactions()}
      </div>
    </div>
  );
}

export default Transactions;