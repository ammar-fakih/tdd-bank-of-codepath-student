import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { formatAmount, formatDate } from '../../utils/format';
import './TransactionDetail.css';

import { API_PORT } from '../../../constants';

export default function TransactionDetail() {
  const [hasFetched, setHasFetched] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { transactionId } = useParams(null);

  useEffect(() => {
    const fetchTransactionById = async () => {
      setIsLoading(true);
      setHasFetched(false);
      try {
        console.log(
          `http://localhost:${API_PORT}/bank/transactions/${transactionId}`
        );
        const response = await axios.get(
          `http://localhost:${API_PORT}/bank/transactions/${transactionId}`
        );
        if (response.status !== 200) {
          setError(response.data);
        }
        setTransaction(response.data.transaction);
      } catch (e) {
        setError(e);
        console.log('transaction error: ', e);
      }
      setIsLoading(false);
      setHasFetched(true);
    };

    fetchTransactionById();

    return () => {
      setHasFetched(false);
      setTransaction({});
      setIsLoading(false);
      setError(null);
    };
  }, [transactionId]);

  return (
    <div className="transaction-detail">
      <TransactionCard
        transaction={transaction}
        transactionId={transactionId}
        isLoading={isLoading}
        hasFetched={hasFetched}
      />
    </div>
  );
}

export function TransactionCard({ transaction, transactionId = null, error }) {
  return (
    <div>
      {!error && transaction ? (
        <div className="transaction-card card">
          <div className="card-header">
            <h3>Transaction #{transactionId}</h3>
            <p className="category">{transaction.category}</p>
          </div>

          <div className="card-content">
            <p className="description">{transaction.description}</p>
          </div>

          <div className="card-footer">
            <p className={`amount ${transaction.amount < 0 ? 'minus' : ''}`}>
              {formatAmount(transaction.amount)}
            </p>
            <p className="date">{formatDate(transaction.postedAt)}</p>
          </div>
        </div>
      ) : (
        <div className="card-header">
          <h3>Transaction #{transactionId}</h3>
          <h1>Not Found</h1>
        </div>
      )}
    </div>
  );
}
