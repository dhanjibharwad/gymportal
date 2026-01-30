'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  CreditCard,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Target
} from 'lucide-react';

interface Member {
  id: number;
  full_name: string;
  membership_status: string;
  created_at: string;
  end_date: string;
  plan_name: string;
}

interface Payment {
  id: number;
  paid_amount: number | string;
  payment_status: string;
  created_at: string;
}

interface RecentMember {
  id: number;
  name: string;
  plan: string;
  joinDate: string;
  status: string;
}

interface ExpiringMember {
  id: number;
  name: string;
  plan: string;
  expiryDate: string;
  daysLeft: number;
}

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalMembers: 0,
    activeMembers: 0,
    newMembersToday: 0,
    expiringThisWeek: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    recentMembers: [] as RecentMember[],
    expiringMembers: [] as ExpiringMember[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [membersRes, paymentsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/payments')
      ]);
      
      const membersData = await membersRes.json();
      const paymentsData = await paymentsRes.json();
      
      if (membersData.success && paymentsData.success) {
        const members: Member[] = membersData.members;
        const payments: Payment[] = paymentsData.payments;
        
        // Calculate stats
        const totalMembers = members.length;
        const activeMembers = members.filter((m: Member) => m.membership_status === 'active').length;
        
        // New members today
        const today = new Date().toISOString().split('T')[0];
        const newMembersToday = members.filter((m: Member) => 
          new Date(m.created_at).toISOString().split('T')[0] === today
        ).length;
        
        // Expiring this week
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const expiringThisWeek = members.filter((m: Member) => {
          if (!m.end_date) return false;
          const endDate = new Date(m.end_date);
          return endDate <= nextWeek && endDate >= new Date();
        }).length;
        
        // Revenue calculations with proper number handling
        const todayRevenue = payments
          .filter((p: Payment) => new Date(p.created_at).toISOString().split('T')[0] === today)
          .reduce((sum: number, p: Payment) => {
            const amount = typeof p.paid_amount === 'number' ? p.paid_amount : parseFloat(String(p.paid_amount)) || 0;
            return sum + amount;
          }, 0);
          
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        console.log('Current month/year:', currentMonth, currentYear);
        
        const monthlyRevenue = payments
          .filter((p: Payment) => {
            const paymentDate = new Date(p.created_at);
            const isCurrentMonth = paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
            if (isCurrentMonth) {
              console.log('Monthly payment found:', p.paid_amount, paymentDate);
            }
            return isCurrentMonth;
          })
          .reduce((sum: number, p: Payment) => {
            const amount = typeof p.paid_amount === 'number' ? p.paid_amount : parseFloat(String(p.paid_amount)) || 0;
            console.log('Adding to monthly total:', amount, 'current sum:', sum);
            return sum + amount;
          }, 0);
          
        console.log('Final monthly revenue:', monthlyRevenue);
        
        // Pending payments
        const pendingPayments = payments.filter((p: Payment) => 
          p.payment_status === 'pending' || p.payment_status === 'partial'
        ).length;
        
        // Recent members
        const recentMembers: RecentMember[] = members
          .sort((a: Member, b: Member) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 4)
          .map((m: Member) => ({
            id: m.id,
            name: m.full_name,
            plan: m.plan_name,
            joinDate: new Date(m.created_at).toLocaleDateString('en-IN'),
            status: m.membership_status === 'active' ? 'Active' : 'Inactive'
          }));
        
        // Expiring members
        const expiringMembers: ExpiringMember[] = members
          .filter((m: Member) => {
            if (!m.end_date) return false;
            const endDate = new Date(m.end_date);
            const today = new Date();
            const diffTime = endDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays >= 0;
          })
          .slice(0, 3)
          .map((m: Member) => {
            const endDate = new Date(m.end_date);
            const today = new Date();
            const diffTime = endDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return {
              id: m.id,
              name: m.full_name,
              plan: m.plan_name,
              expiryDate: new Date(m.end_date).toLocaleDateString('en-IN'),
              daysLeft
            };
          });
        
        setDashboardData({
          totalMembers,
          activeMembers,
          newMembersToday,
          expiringThisWeek,
          todayRevenue,
          monthlyRevenue,
          pendingPayments,
          recentMembers,
          expiringMembers
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Reception Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening at your gym today.</p>
        </div>
        <div className="mt-4 sm:mt-0 text-sm text-gray-500">
          {currentTime && `Last updated: ${currentTime}`}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.totalMembers.toLocaleString()}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {dashboardData.totalMembers > 0 ? `${((dashboardData.activeMembers / dashboardData.totalMembers) * 100).toFixed(1)}% active` : 'No data'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Active Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.activeMembers.toLocaleString()}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <CheckCircle className="w-3 h-3 mr-1" />
                {dashboardData.totalMembers > 0 ? `${((dashboardData.activeMembers / dashboardData.totalMembers) * 100).toFixed(1)}% active rate` : '0% active rate'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{Math.round(dashboardData.todayRevenue).toLocaleString()}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Today's earnings
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring This Week</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.expiringThisWeek}</p>
              <p className="text-xs text-amber-600 flex items-center mt-1">
                <AlertCircle className="w-3 h-3 mr-1" />
                Needs attention
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">New Today</p>
              <p className="text-xl font-bold text-gray-900">{dashboardData.newMembersToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-xl font-bold text-gray-900">{dashboardData.pendingPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Checked In Today</p>
              <p className="text-xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-xl font-bold text-gray-900">₹{Math.round(dashboardData.monthlyRevenue).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Members</h3>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.recentMembers.length > 0 ? dashboardData.recentMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.plan} • {member.joinDate}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {member.status}
                  </span>
                </div>
              )) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No recent members</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expiring Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Expiring Soon</h3>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.expiringMembers.length > 0 ? dashboardData.expiringMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.plan} • Expires {member.expiryDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.daysLeft <= 1 
                        ? 'bg-red-100 text-red-700' 
                        : member.daysLeft <= 3
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {member.daysLeft} day{member.daysLeft !== 1 ? 's' : ''} left
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No expiring memberships</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all">
            <UserPlus className="w-5 h-5" />
            <span className="font-medium">Add New Member</span>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">Process Payment</span>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Renewal Reminder</span>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all">
            <Users className="w-5 h-5" />
            <span className="font-medium">View All Members</span>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;