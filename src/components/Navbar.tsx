import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Droplets, Menu, X, Globe, Bell, LogOut, User } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'community' | 'asha' | 'admin';
  language: string;
}

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'as', name: 'Assamese' },
  { code: 'bn', name: 'Bengali' },
  { code: 'hi', name: 'Hindi' },
  { code: 'kh', name: 'Khasi' },
  { code: 'ko', name: 'Kokborok' },
  { code: 'mn', name: 'Manipuri' },
  { code: 'mi', name: 'Mizo' },
  { code: 'ne', name: 'Nepali' }
];

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const location = useLocation();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'community': return '/community';
      case 'asha': return '/asha';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  const getNavItems = () => {
    if (!user) {
      return [
        { path: '/', label: 'Home' },
        { path: '/education', label: 'Health Education' },
        { path: '/login', label: 'Login' }
      ];
    }

    const baseItems = [
      { path: getDashboardLink(), label: 'Dashboard' },
      { path: '/water-monitoring', label: 'Water Quality' },
      { path: '/education', label: 'Education' }
    ];

    if (user.role === 'asha' || user.role === 'admin') {
      baseItems.push({ path: '/training', label: 'Training' });
    }

    if (user.role === 'admin') {
      baseItems.push({ path: '/impact', label: 'Impact' });
    }

    return baseItems;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Shield className="h-8 w-8 text-niro-blue" />
              <Droplets className="h-4 w-4 text-niro-aqua absolute -bottom-1 -right-1" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-niro-blue">NiroGuard</span>
              <span className="text-xs text-gray-500 -mt-1">Smart Health Monitoring</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-niro-blue border-b-2 border-niro-blue pb-1'
                    : 'text-gray-700 hover:text-niro-blue'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-niro-blue transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">{languages.find(l => l.code === language)?.name || 'English'}</span>
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            {user && (
              <button className="relative p-2 text-gray-700 hover:text-niro-blue transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-niro-blue"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              {getNavItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-niro-blue'
                      : 'text-gray-700 hover:text-niro-blue'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {user && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;