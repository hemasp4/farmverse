import React, { useState, useEffect } from 'react';
import { getTransactions } from '../../services/transactionService';
import LoadingSpinner from '../common/LoadingSpinner';

export default function TransactionHistory({ onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'profit', 'loss'

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions(); // Initial fetch

    const intervalId = setInterval(fetchTransactions, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const getTransactionDescription = (transaction) => {
    switch (transaction.type) {
      case 'sell':
        return `Sold ${transaction.quantity} ${transaction.cropType}(s)`;
      case 'reward':
        return 'Daily Login Reward';
      case 'plant':
        return `Planted ${transaction.cropType}`; // Assuming you'll add plant transactions
      case 'harvest':
        return `Harvested ${transaction.cropType}`;
      default:
        return transaction.type;
    }
  };

  const getAmountDisplay = (transaction) => {
    const sign = transaction.totalEarnings > 0 ? '+' : '';
    const colorClass = transaction.totalEarnings > 0 ? 'text-green-600' : 'text-red-600';
    return <span className={colorClass}>{`${sign}${transaction.totalEarnings} coins`}</span>;
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'profit') {
      return transaction.totalEarnings > 0;
    }
    if (filter === 'loss') {
      return transaction.totalEarnings < 0;
    }
    return true;
  });

  const totalEarnings = filteredTransactions.reduce((acc, transaction) => acc + transaction.totalEarnings, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Coin Transaction History</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setFilter('all')}
              className={`${filter === 'all' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('profit')}
              className={`${filter === 'profit' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profit
            </button>
            <button
              onClick={() => setFilter('loss')}
              className={`${filter === 'loss' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Loss
            </button>
          </nav>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold">
            {filter === 'all' && 'Net Total'}
            {filter === 'profit' && 'Total Profit'}
            {filter === 'loss' && 'Total Loss'}
          </h4>
          <p className={`text-2xl font-bold ${totalEarnings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalEarnings.toLocaleString()} coins
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getTransactionDescription(transaction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getAmountDisplay(transaction)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No transactions found.</p>
        )}
      </div>
    </div>
  );
}
