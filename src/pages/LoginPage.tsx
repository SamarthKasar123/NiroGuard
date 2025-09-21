import React from 'react';
import { Shield, Droplets, User, Lock, Globe } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'community' | 'asha' | 'admin';
  language: string;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = React.useState({
    phone: '',
    password: '',
    role: 'community' as 'community' | 'asha' | 'admin',
    language: 'en'
  });
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-niro-blue to-niro-aqua flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <Shield className="h-16 w-16 text-white" />
              <Droplets className="h-8 w-8 text-niro-light-blue absolute -bottom-2 -right-2" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">NiroGuard</h1>
          <p className="text-niro-light-blue">Smart Health Monitoring System</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSignUp ? 'Join the health monitoring network' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field pl-10"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am a
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="input-field"
              >
                <option value="community">Community Member</option>
                <option value="asha">ASHA/ANM Worker</option>
                <option value="admin">Health Department Official</option>
              </select>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Language
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="input-field pl-10"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-niro-blue hover:text-niro-dark-blue font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* Demo Accounts */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts (For Testing)</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleDemoLogin('community')}
                className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50"
              >
                <strong>Community Member:</strong> Ravi Kumar
              </button>
              <button
                onClick={() => handleDemoLogin('asha')}
                className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50"
              >
                <strong>ASHA Worker:</strong> Priya Sharma
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50"
              >
                <strong>Health Official:</strong> Dr. Ankit Mehta
              </button>
            </div>
          </div>

          {/* Offline Mode Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-blue-800">Offline Support Available</p>
                <p className="text-xs text-blue-600 mt-1">
                  This app works offline. Data will sync when you reconnect to the internet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center text-white">
          <p className="text-sm text-niro-light-blue mb-2">Need help?</p>
          <div className="text-sm space-y-1">
            <p>📞 Helpline: 1800-XXX-XXXX</p>
            <p>💬 SMS Support: Available in local languages</p>
            <p>🎙️ IVR Support: Voice assistance available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;