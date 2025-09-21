import React from 'react';
import { Shield, Droplets, User, Lock, Globe, Users, Phone, Eye, EyeOff, LogIn, Wifi } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'community' | 'asha' | 'admin';
  language: string;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
  language: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, language }) => {
  const [formData, setFormData] = React.useState({
    phone: '',
    password: '',
    role: 'community' as 'community' | 'asha' | 'admin',
    language: 'en'
  });
  const [loading, setLoading] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'as', name: 'অসমীয়া (Assamese)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'kh', name: 'Khasi' },
    { code: 'ko', name: 'Kokborok' },
    { code: 'mn', name: 'মৈতৈলোন্ (Manipuri)' },
    { code: 'mi', name: 'Mizo' },
    { code: 'ne', name: 'नेपाली (Nepali)' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock authentication - replace with real API
    setTimeout(() => {
      const user: User = {
        id: Date.now().toString(),
        name: isSignUp ? 'New User' : getDemoUserName(formData.role),
        role: formData.role,
        language: formData.language
      };
      onLogin(user);
      setLoading(false);
    }, 1000);
  };

  const getDemoUserName = (role: string) => {
    switch (role) {
      case 'community': return 'Ravi Kumar';
      case 'asha': return 'Priya Sharma (ASHA)';
      case 'admin': return 'Dr. Ankit Mehta';
      default: return 'User';
    }
  };

  const handleDemoLogin = (role: 'community' | 'asha' | 'admin') => {
    const user: User = {
      id: Date.now().toString(),
      name: getDemoUserName(role),
      role,
      language: formData.language
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-niro-blue to-niro-aqua relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-8 h-8 bg-white rounded-full animate-pulse delay-700"></div>
      </div>
      
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo Section */}
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
                  <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                  <Droplets className="h-6 w-6 sm:h-8 sm:w-8 text-niro-light-blue absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">NiroGuard</h1>
            <p className="text-blue-100 text-sm sm:text-base font-medium">Smart Health Monitoring System</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600 text-sm">
                {isSignUp ? 'Join the health monitoring network' : 'Sign in to continue your health journey'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Language Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline-block h-4 w-4 mr-2" />
                  Language / ভাষা / Basa / Bhasa
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-niro-blue focus:border-transparent transition-all duration-200"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'community', label: 'Community', subtitle: 'Local Member', icon: Users },
                    { value: 'asha', label: 'ASHA/ANM', subtitle: 'Health Worker', icon: User },
                    { value: 'admin', label: 'Official', subtitle: 'Administrator', icon: Shield }
                  ].map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: role.value as any })}
                        className={`p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                          formData.role === role.value
                            ? 'border-niro-blue bg-gradient-to-br from-niro-blue to-blue-600 text-white shadow-lg'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-niro-blue hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <IconComponent className="h-4 w-4" />
                          <span className="text-xs font-semibold">{role.label}</span>
                          <span className="text-xs opacity-75 hidden sm:block">{role.subtitle}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-niro-blue transition-colors" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-niro-blue focus:border-transparent transition-all duration-200"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-niro-blue transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-niro-blue focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-niro-blue transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-niro-blue focus:ring-niro-blue border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-niro-blue hover:text-niro-dark-blue font-medium hover:underline transition-all"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-niro-blue to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-niro-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </div>
                )}
              </button>

              {/* Toggle Sign Up/Login */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-gray-600 hover:text-niro-blue font-medium transition-colors"
                >
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                  <span className="text-niro-blue font-semibold hover:underline">
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </span>
                </button>
              </div>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
                🚀 Quick Demo Access
              </h3>
              <p className="text-xs text-gray-600 text-center mb-3">
                Try the system with these demo accounts
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleDemoLogin('community')}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-niro-blue transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Community Member</p>
                      <p className="text-xs text-gray-600">Ravi Kumar • Local Resident</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleDemoLogin('asha')}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:border-green-500 transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">ASHA Worker</p>
                      <p className="text-xs text-gray-600">Priya Sharma • Health Worker</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleDemoLogin('admin')}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:border-purple-500 transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Health Official</p>
                      <p className="text-xs text-gray-600">Dr. Ankit Mehta • Administrator</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Offline Mode Info */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-niro-blue/10 border border-blue-200 rounded-2xl">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Wifi className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-blue-800 mb-1 text-sm">Offline Support Available</p>
                  <p className="text-xs text-blue-600">
                    This app works offline. Data will sync automatically when you reconnect to the internet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-white font-semibold mb-3 text-base">Need Help? We're Here for You</p>
              <div className="grid grid-cols-3 gap-3 text-xs text-white">
                <div className="flex flex-col items-center space-y-1 p-2 bg-white/10 rounded-xl">
                  <div className="text-lg">📞</div>
                  <p className="font-medium">Helpline</p>
                  <p className="text-niro-light-blue">1800-XXX-XXXX</p>
                </div>
                <div className="flex flex-col items-center space-y-1 p-2 bg-white/10 rounded-xl">
                  <div className="text-lg">💬</div>
                  <p className="font-medium">SMS Support</p>
                  <p className="text-niro-light-blue">Local languages</p>
                </div>
                <div className="flex flex-col items-center space-y-1 p-2 bg-white/10 rounded-xl">
                  <div className="text-lg">🎙️</div>
                  <p className="font-medium">Voice Support</p>
                  <p className="text-niro-light-blue">IVR assistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;