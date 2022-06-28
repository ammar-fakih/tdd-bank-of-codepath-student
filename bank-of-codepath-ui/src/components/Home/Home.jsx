import * as React from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import { API_PORT } from '../../../constants';
import AddTransaction from '../AddTransaction/AddTransaction';
import BankActivity from '../BankActivity/BankActivity';
import './Home.css';

let test = [];

export default function Home({
  transactions,
  setTransactions,
  transfers,
  setTransfers,
  error,
  setError,
  isLoading,
  setIsLoading,
  filterInputValue,
  isCreating,
  setIsCreating,
  newTransactionForm,
  setNewTransactionForm,
}) {
  useEffect(async () => {
    setIsLoading(true);

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:${API_PORT}/bank/transactions`
        );
        setTransactions([...transactions, ...response.data.transactions]);
      } catch (e) {
        setError(e);
        console.log('transaction error: ', e);
      }
    };

    const fetchTransfers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:${API_PORT}/bank/transfers`
        );
        setTransfers(response.data.transfers);
      } catch (e) {
        setError(e);
      }
    };

    await fetchTransactions();
    await fetchTransfers();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log('transactins', transactions);
  }, [transactions]);

  const handleOnCreateTransaction = async () => {
    while (isLoading) {}
    console.log(isLoading);
    console.log(transactions);
    setIsCreating(true);
    console.log('handle create called');
    try {
      const response = await axios.post(
        `http://localhost:${API_PORT}/bank/transactions`,
        { ...newTransactionForm }
      );
      console.log(response.data);
      setTransactions([response.data.transaction, ...test]);
    } catch (e) {
      setError(e);
    }

    // setNewTransactionForm({ category: '', description: '', amount: 0 });
    setIsCreating(false);
  };

  // console.log('transactions: ', transactions);

  let filteredTransactions = transactions;

  if (filterInputValue) {
    filteredTransactions = transactions.filter((trans) => {
      return trans.description
        .toLowerCase()
        .includes(filterInputValue.toLowerCase());
    });
  }

  return (
    <div className="home">
      <AddTransaction
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        form={newTransactionForm}
        setForm={setNewTransactionForm}
        handleOnSubmit={handleOnCreateTransaction}
      />
      {error && <h2>{error}</h2>}
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <BankActivity
          transactions={filteredTransactions}
          transfers={transfers}
        />
      )}
    </div>
  );
}
