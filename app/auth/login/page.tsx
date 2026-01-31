'use client';

import React, { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, Dumbbell, AlertCircle } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const GymLoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('=== LOGIN CREDENTIALS ===');
        console.log('Email:', formData.email);
        console.log('Password:', formData.password);
        console.log('========================');
        
        alert('Login successful! Check console for credentials.');
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Diagonal Stripe Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 40px,
            rgba(255,255,255,0.03) 40px,
            rgba(255,255,255,0.03) 80px
          )`
        }} />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-8 text-white">
            <div className="space-y-6">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/50 rotate-12 hover:rotate-0 transition-transform duration-500">
                  <Dumbbell className="w-10 h-10 text-white -rotate-12" />
                </div>
                <div>
                  <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    EAGLE<span className="text-orange-500"> GYM</span>
                  </h1>
                  <p className="text-slate-400 text-sm tracking-widest uppercase font-semibold">
                    Management System
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-4 border-l-4 border-orange-500 pl-6">
                <h2 className="text-4xl font-black leading-tight">
                  Transform Your
                  <br />
                  <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                    Strength Journey
                  </span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                  Professional gym management system designed for trainers, receptionists, and gym administrators.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="space-y-1">
                  <div className="text-3xl font-black text-orange-500">500+</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Members</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-orange-500">24/7</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Access</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-orange-500">15+</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Trainers</div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="relative pt-12">
              <div className="absolute -left-8 top-0 w-1 h-32 bg-gradient-to-b from-orange-500 to-transparent" />
              <div className="space-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Secure & Encrypted Login</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Real-time Member Tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Advanced Analytics Dashboard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              
              {/* Form Header */}
              <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      STAFF LOGIN
                    </h3>
                    <p className="text-orange-100 text-sm">
                      Enter your credentials
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors">
                        <Mail className={`w-5 h-5 ${
                          errors.email 
                            ? 'text-red-400' 
                            : formData.email 
                            ? 'text-orange-500' 
                            : 'text-slate-400 group-focus-within:text-orange-500'
                        }`} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-4 bg-white/10 border-2 ${
                          errors.email 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-white/20 focus:border-orange-500'
                        } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-white/15 transition-all duration-300`}
                        placeholder="Enter your Email"
                      />
                      {errors.email && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                        <span>•</span> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors">
                        <Lock className={`w-5 h-5 ${
                          errors.password 
                            ? 'text-red-400' 
                            : formData.password 
                            ? 'text-orange-500' 
                            : 'text-slate-400 group-focus-within:text-orange-500'
                        }`} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-12 py-4 bg-white/10 border-2 ${
                          errors.password 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-white/20 focus:border-orange-500'
                        } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-white/15 transition-all duration-300`}
                        placeholder="Enter your Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                        <span>•</span> {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-slate-300 group-hover:text-white transition-colors">
                        Remember me
                      </span>
                    </label>
                    <button 
                      type="button"
                      className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-lg rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          LOGGING IN...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          LOGIN TO DASHBOARD
                        </>
                      )}
                    </span>
                    {!isLoading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-wider">
                      Secure Access
                    </span>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="text-center space-y-3">
                  <p className="text-slate-400 text-sm">
                    Need access? Contact your gym administrator
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Lock className="w-3 h-3" />
                    <span>Protected by 256-bit encryption</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Logo - Visible only on small screens */}
            <div className="lg:hidden mt-8 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/50">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-black text-white tracking-tight">
                    GYM<span className="text-orange-500">FLEX</span>
                  </h1>
                  <p className="text-slate-500 text-xs tracking-widest uppercase font-semibold">
                    Management System
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-orange-500/30 rounded-tl-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-orange-500/30 rounded-br-3xl" />
    </div>
  );
};

export default GymLoginPage;