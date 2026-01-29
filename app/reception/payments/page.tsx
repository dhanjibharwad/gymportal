'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Eye,
  DollarSign,
  Calendar,
  User,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Receipt,
  Banknote,
  Edit,
  X,
  Save
} from 'lucide-react';

interface Payment {
  id: number;
  member_id: number;
  membership_id: number;
  full_name: string;
  phone_number: string;
  plan_name: string;
  total_amount: number;
  paid_amount: number;
  payment_mode: string;
  payment_status: string;
  next_due_date: string;
  created_at: string;
  start_date: string;
  end_date: string;
  profile_photo_url: string;
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentModeFilter, setPaymentModeFilter] = useState('all');
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [editForm, setEditForm] = useState({
    paid_amount: 0,
    payment_mode: '',
    payment_status: '',
    next_due_date: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setEditForm({
      paid_amount: payment.paid_amount,
      payment_mode: payment.payment_mode,
      payment_status: payment.payment_status,
      next_due_date: payment.next_due_date ? payment.next_due_date.split('T')[0] : ''
    });
    document.body.style.overflow = 'hidden';
  };

  const handleUpdatePayment = async () => {
    if (!editingPayment) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/payments/${editingPayment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPayments();
        setEditingPayment(null);
        alert('Payment updated successfully!');
      } else {
        alert('Failed to update payment: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Error updating payment');
    } finally {
      setUpdating(false);
    }
  };

  const closeEditModal = () => {
    setEditingPayment(null);
    setEditForm({
      paid_amount: 0,
      payment_mode: '',
      payment_status: '',
      next_due_date: ''
    });
    document.body.style.overflow = 'unset';
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments');
      const result = await response.json();
      
      if (result.success) {
        setPayments(result.payments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.phone_number.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || payment.payment_status === statusFilter;
    const matchesMode = paymentModeFilter === 'all' || payment.payment_mode === paymentModeFilter;
    
    return matchesSearch && matchesStatus && matchesMode;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      full: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      partial: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      pending: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentModeIcon = (mode: string) => {
    const modeConfig = {
      Cash: { icon: Banknote, color: 'text-green-600' },
      UPI: { icon: CreditCard, color: 'text-blue-600' },
      Card: { icon: CreditCard, color: 'text-purple-600' },
      Online: { icon: CreditCard, color: 'text-indigo-600' }
    };
    
    const config = modeConfig[mode as keyof typeof modeConfig] || modeConfig.Cash;
    const Icon = config.icon;
    
    return <Icon className={`w-4 h-4 ${config.color}`} />;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // Calculate summary statistics
  const totalRevenue = payments.reduce((sum, payment) => {
    const amount = parseFloat(payment.paid_amount.toString()) || 0;
    return sum + amount;
  }, 0);
  const pendingAmount = payments
    .filter(p => p.payment_status === 'pending' || p.payment_status === 'partial')
    .reduce((sum, payment) => {
      const total = parseFloat(payment.total_amount.toString()) || 0;
      const paid = parseFloat(payment.paid_amount.toString()) || 0;
      return sum + (total - paid);
    }, 0);
  const fullPayments = payments.filter(p => p.payment_status === 'full').length;
  const overduePayments = payments.filter(p => p.payment_status !== 'full' && isOverdue(p.next_due_date)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Track and manage member payments</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">
            Total Payments: <span className="font-semibold text-gray-900">{payments.length}</span>
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Revenue
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  ₹{Math.round(totalRevenue).toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pending Amount
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  ₹{Math.round(pendingAmount).toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Paid Full
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {fullPayments}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Overdue
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {overduePayments}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by member name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="full">Paid Full</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Payment Mode Filter */}
          <div>
            <select
              value={paymentModeFilter}
              onChange={(e) => setPaymentModeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Payment Modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Online">Online Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  {/* Member Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {payment.profile_photo_url ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={payment.profile_photo_url}
                            alt={payment.full_name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {payment.full_name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.phone_number}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.plan_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(payment.start_date)} - {formatDate(payment.end_date)}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.paid_amount)} / {formatCurrency(payment.total_amount)}
                    </div>
                    {payment.payment_status !== 'full' && (
                      <div className="text-sm text-red-600">
                        Pending: {formatCurrency(payment.total_amount - payment.paid_amount)}
                      </div>
                    )}
                  </td>

                  {/* Payment Mode */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPaymentModeIcon(payment.payment_mode)}
                      <span className="ml-2 text-sm text-gray-900">
                        {payment.payment_mode}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.payment_status)}
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.next_due_date ? (
                      <div className={`text-sm ${
                        isOverdue(payment.next_due_date) ? 'text-red-600 font-medium' : 'text-gray-900'
                      }`}>
                        {formatDate(payment.next_due_date)}
                        {isOverdue(payment.next_due_date) && (
                          <div className="text-xs text-red-500">Overdue</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditPayment(payment)}
                        className="text-orange-600 hover:text-orange-900 p-1 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || paymentModeFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No payment records available.'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Payment Modal */}
      {editingPayment && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Payment</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Member: <span className="font-medium text-gray-900">{editingPayment.full_name}</span></p>
                <p className="text-sm text-gray-600">Plan: <span className="font-medium text-gray-900">{editingPayment.plan_name}</span></p>
                <p className="text-sm text-gray-600">Total Amount: <span className="font-medium text-gray-900">{formatCurrency(editingPayment.total_amount)}</span></p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paid Amount *
                </label>
                <input
                  type="number"
                  value={editForm.paid_amount}
                  onChange={(e) => setEditForm({...editForm, paid_amount: parseFloat(e.target.value) || 0})}
                  max={editingPayment.total_amount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Mode *
                </label>
                <select
                  value={editForm.payment_mode}
                  onChange={(e) => setEditForm({...editForm, payment_mode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online Transfer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status *
                </label>
                <select
                  value={editForm.payment_status}
                  onChange={(e) => setEditForm({...editForm, payment_status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="full">Full</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Due Date
                </label>
                <input
                  type="date"
                  value={editForm.next_due_date}
                  onChange={(e) => setEditForm({...editForm, next_due_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePayment}
                disabled={updating}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {updating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {updating ? 'Updating...' : 'Update Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;