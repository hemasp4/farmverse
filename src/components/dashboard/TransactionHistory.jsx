import React, { useState, useEffect } from 'react';
import { getTransactions } from '../../services/transactionService';
import LoadingSpinner from '../common/LoadingSpinner';

export default function TransactionHistory({ onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchTransactions();
  }, []);

  const getTransactionDescription = (transaction) => {
    switch (transaction.type) {
      case 'sell':
        return `Sold ${transaction.quantity} ${transaction.cropType}(s)`;
      case 'reward':
        return 'Daily Login Reward';
      case 'plant':
        return `Planted ${transaction.cropType}`; // Assuming you'll add plant transactions
      default:
        return transaction.type;
    }
  };

  const getAmountDisplay = (transaction) => {
    const sign = transaction.totalEarnings > 0 ? '+' : '';
    const colorClass = transaction.totalEarnings > 0 ? 'text-green-600' : 'text-red-600';
    return <span className={colorClass}>{`${sign}${transaction.totalEarnings} coins`}</span>;
  };

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

        {loading ? (
          <LoadingSpinner />
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
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
