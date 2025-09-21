import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Droplets, Users, AlertTriangle, MapPin, Smartphone, Globe, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  language: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ language }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-niro-blue to-niro-aqua text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="relative">
                <Shield className="h-16 w-16 text-white" />
                <Droplets className="h-8 w-8 text-niro-light-blue absolute -bottom-2 -right-2" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              NiroGuard
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-niro-light-blue">
              Smart Health, Safe Water, Strong Communities
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Smart Community Health Monitoring & Early Warning System for Water-Borne Diseases in Rural Northeast India
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-white text-niro-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/education"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-niro-blue transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Addressing Water-Borne Disease Challenges
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Water-borne diseases affect millions in rural Northeast India. Our smart monitoring system enables early detection and rapid response to protect vulnerable communities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">22.5% Disease Prevalence</h3>
              <p className="text-gray-600">High rates of water-borne diseases in rural areas compared to 12.2% in urban settings</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Droplets className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">&lt;15% Piped Water</h3>
              <p className="text-gray-600">Limited access to safe piped water coverage in most Northeast states</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3X Higher Risk</h3>
              <p className="text-gray-600">Increased waterborne disease risk during flood seasons</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Smart Monitoring Features
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive health surveillance and early warning capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Community Reporting */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Smartphone className="h-8 w-8 text-niro-blue mr-3" />
                <h3 className="text-xl font-semibold">Community Reporting</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Mobile app for community members to report symptoms and water quality issues in real-time
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Symptom tracking</li>
                <li>• Water quality complaints</li>
                <li>• Offline functionality</li>
              </ul>
            </div>

            {/* AI Prediction */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-niro-green mr-3" />
                <h3 className="text-xl font-semibold">AI-Powered Prediction</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Machine learning models detect patterns and predict potential disease outbreaks
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Pattern recognition</li>
                <li>• Outbreak prediction</li>
                <li>• Risk assessment</li>
              </ul>
            </div>

            {/* GIS Mapping */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <MapPin className="h-8 w-8 text-niro-aqua mr-3" />
                <h3 className="text-xl font-semibold">GIS Mapping</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Interactive maps showing disease hotspots and resource allocation
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Hotspot visualization</li>
                <li>• Resource tracking</li>
                <li>• Geographic analysis</li>
              </ul>
            </div>

            {/* Real-time Alerts */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
                <h3 className="text-xl font-semibold">Real-time Alerts</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Instant notifications to health officials and community leaders
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Push notifications</li>
                <li>• SMS alerts</li>
                <li>• IVR system</li>
              </ul>
            </div>

            {/* Multilingual Support */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Globe className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold">Multilingual Support</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Support for 8 Northeast Indian languages with voice assistance
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Local languages</li>
                <li>• Voice assistance</li>
                <li>• Cultural adaptation</li>
              </ul>
            </div>

            {/* Community Engagement */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">Community Engagement</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Training and awareness programs for ASHA workers and communities
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Health education</li>
                <li>• Training modules</li>
                <li>• Awareness campaigns</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SDG Alignment Section */}
      <section className="py-16 bg-niro-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Supporting UN Sustainable Development Goals
            </h2>
            <p className="text-lg text-niro-light-blue mb-8">
              Our mission aligns with global health and water safety objectives
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <div className="text-4xl font-bold mb-2">SDG 3</div>
                <h3 className="text-xl font-semibold mb-2">Good Health and Well-being</h3>
                <p className="text-niro-light-blue">
                  Ensuring healthy lives and promoting well-being for all at all ages through early disease detection and prevention
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <div className="text-4xl font-bold mb-2">SDG 6</div>
                <h3 className="text-xl font-semibold mb-2">Clean Water and Sanitation</h3>
                <p className="text-niro-light-blue">
                  Ensuring availability and sustainable management of water and sanitation for all through quality monitoring
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Expected Impact
            </h2>
            <p className="text-lg text-gray-600">
              Data-driven results from pilot implementations
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-niro-blue mb-2">42%</div>
              <p className="text-gray-600">Reduction in water-borne disease cases</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-niro-green mb-2">65%</div>
              <p className="text-gray-600">Decrease in outbreak severity</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-niro-aqua mb-2">78%</div>
              <p className="text-gray-600">Faster response time from authorities</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">3.2X</div>
              <p className="text-gray-600">Return on investment ratio</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-niro-green to-niro-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Fight Against Water-Borne Diseases
          </h2>
          <p className="text-lg mb-8 text-gray-100">
            Together, we can build healthier communities across Northeast India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white text-niro-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Monitoring
            </Link>
            <Link
              to="/education"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-niro-blue transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-niro-aqua" />
                <span className="text-xl font-bold">NiroGuard</span>
              </div>
              <p className="text-gray-400">
                Smart Community Health Monitoring for a healthier Northeast India
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/education" className="hover:text-white">Health Education</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Partners</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Ministry of Health & Family Welfare</li>
                <li>Ministry of Jal Shakti</li>
                <li>State Health Departments</li>
                <li>PHED</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Coverage</h3>
              <p className="text-gray-400 mb-2">8 Northeast States:</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>Assam, Arunachal Pradesh</li>
                <li>Manipur, Meghalaya</li>
                <li>Mizoram, Nagaland</li>
                <li>Sikkim, Tripura</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NiroGuard. All rights reserved. Built for Smart India Hackathon 2024.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;