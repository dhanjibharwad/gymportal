'use client';

import { useState, useEffect } from 'react';

interface MembershipPlan {
  id: number;
  plan_name: string;
  duration_months: number;
  price: number;
  created_at: string;
}

export default function MembershipPlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/membership-plans');
      const data = await response.json();
      
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Membership Plans</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.plan_name}</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">₹{plan.price}</div>
              <div className="text-gray-600 mb-4">
                {plan.duration_months} {plan.duration_months === 1 ? 'Month' : 'Months'}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                ₹{(plan.price / plan.duration_months).toFixed(0)}/month
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                Select Plan
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {plans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No membership plans available</p>
        </div>
      )}
    </div>
  );
}