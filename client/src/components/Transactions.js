import React, { useContext } from 'react';
import UserContext from '../contexts/UserContext';

const Transactions = () => {
  const { user } = useContext(UserContext);
  console.log(user);

  const renderTransactions = () => user.transactions.map(item => (
    <div className="transaction-log">  
      <div>BUY </div>
      <div>({item.ticker}) - </div>
      <div>{item.shares} Shares </div>
      <div> @ {item.atPrice}</div>
    </div>
  ));
  return(
    renderTransactions()
  );
}

export default Transactions;