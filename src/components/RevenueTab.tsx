import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import PieChart from './PieChart';

interface Revenue {
  _id?: string;
  id?: string;
  amount: number;
  source: string;
  createdAt: string | Date;
}

interface Expense {
  _id?: string;
  id?: string;
  amount: number;
  reason: string;
  createdAt: string | Date;
}

const RevenueTab: React.FC = () => {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newRevenue, setNewRevenue] = useState({ amount: '', source: '' });
  const [newExpense, setNewExpense] = useState({ amount: '', reason: '' });

  const API_URL = 'https://5udebzye8d.execute-api.eu-west-3.amazonaws.com';

  // Load data from API
  useEffect(() => {
    // Fetch revenues
    fetch(`${API_URL}/revenues`)
      .then(res => res.json())
      .then(data => {
        setRevenues(data.map((r: Revenue) => ({
          ...r,
          createdAt: new Date(r.createdAt)
        })));
      })
      .catch(error => console.error('Error fetching revenues:', error));
  
    // Fetch expenses
    fetch(`${API_URL}/expenses`)
      .then(res => res.json())
      .then(data => {
        setExpenses(data.map((e: Expense) => ({
          ...e,
          createdAt: new Date(e.createdAt)
        })));
      })
      .catch(error => console.error('Error fetching expenses:', error));
  }, []);

  const addRevenue = () => {
    if (!newRevenue.amount || !newRevenue.source.trim()) return;
    
    const data = {
      amount: parseFloat(newRevenue.amount),
      source: newRevenue.source.trim(),
      createdAt: new Date()
    };
    
    fetch(`${API_URL}/revenues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(r => {
      setRevenues([{ ...r, createdAt: new Date(r.createdAt) }, ...revenues]);
      setNewRevenue({ amount: '', source: '' });
    });
  };

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.reason.trim()) return;
    
    const data = {
      amount: parseFloat(newExpense.amount),
      reason: newExpense.reason.trim().toLowerCase(),
      createdAt: new Date()
    };
    
    fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(e => {
      setExpenses([{ ...e, createdAt: new Date(e.createdAt) }, ...expenses]);
      setNewExpense({ amount: '', reason: '' });
    });
  };

  const deleteRevenue = (id: string) => {
    fetch(`${API_URL}/revenues/${id}`, { method: 'DELETE' })
      .then(() => setRevenues(revenues.filter(r => r._id !== id)));
  };

  const deleteExpense = (id: string) => {
    fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' })
      .then(() => setExpenses(expenses.filter(e => e._id !== id)));
  };

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const availableMoney = totalRevenue - totalExpenses;

  const expensesByReason = expenses.reduce((acc, e) => {
    const reason = e.reason.toLowerCase();
    acc[reason] = (acc[reason] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByReason).map(([name, value]) => ({ 
    name, 
    value 
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
          <p className="text-gray-600">Track revenue and expenses</p>
        </div>
      </div>

      {/* Top Section - Chart and Available Money */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          {chartData.length > 0 ? (
            <PieChart data={chartData} />
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No expenses yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Available Money */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Available Money</h3>
            <TrendingUp className={`w-6 h-6 ${availableMoney >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
          </div>
          
          <div className="space-y-4">
            <div className={`text-3xl font-bold ${availableMoney >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              ${availableMoney.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue:</span>
                <span className="font-medium text-emerald-600">
                  +${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Expenses:</span>
                <span className="font-medium text-red-600">
                  -${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Revenue */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-6 border border-emerald-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>Add Revenue</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                value={newRevenue.amount}
                onChange={(e) => setNewRevenue({ ...newRevenue, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <input
                type="text"
                value={newRevenue.source}
                onChange={(e) => setNewRevenue({ ...newRevenue, source: e.target.value })}
                placeholder="e.g., Client payment, Investment, Sales"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={addRevenue}
              className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Revenue</span>
            </button>
          </div>
        </div>

        {/* Add Expense */}
        <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <span>Add Expense</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <input
                type="text"
                value={newExpense.reason}
                onChange={(e) => setNewExpense({ ...newExpense, reason: e.target.value })}
                placeholder="e.g., marketing, office, equipment"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={addExpense}
              className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Revenue */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Revenue</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {revenues.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No revenue entries yet</p>
            ) : (
              revenues.slice(0, 10).map((revenue) => (
                <div key={revenue._id || revenue.id} className="group flex justify-between items-center p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors duration-200">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{revenue.source}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(revenue.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="font-semibold text-emerald-600">
                      +${revenue.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <button
                      onClick={() => deleteRevenue(revenue._id || revenue.id || '')}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200 rounded"
                      title="Delete revenue entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No expense entries yet</p>
            ) : (
              expenses.slice(0, 10).map((expense) => (
                <div key={expense._id || expense.id} className="group flex justify-between items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 capitalize">{expense.reason}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(expense.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="font-semibold text-red-600">
                      -${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <button
                      onClick={() => deleteExpense(expense._id || expense.id || '')}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200 rounded"
                      title="Delete expense entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTab;