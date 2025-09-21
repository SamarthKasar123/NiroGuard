import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Droplets, 
  Shield, 
  Activity,
  Calendar,
  Download,
  Filter,
  Search,
  Bell,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface User {
  id: string;
  name: string;
  role: 'community' | 'asha' | 'admin';
  language: string;
}

interface AdminDashboardProps {
  user: User;
  language: string;
}

interface DiseaseData {
  location: string;
  cases: number;
  trend: 'up' | 'down' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

interface WaterQualityData {
  location: string;
  ph: number;
  turbidity: number;
  bacteria: number;
  status: 'safe' | 'warning' | 'critical';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, language }) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'mapping' | 'analytics' | 'alerts' | 'resources'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = React.useState('7d');
  const [alertLevel, setAlertLevel] = React.useState('all');

  // Mock data for charts
  const weeklyData = [
    { day: 'Mon', cases: 12, deaths: 0, recovered: 8 },
    { day: 'Tue', cases: 19, deaths: 0, recovered: 15 },
    { day: 'Wed', cases: 8, deaths: 1, recovered: 12 },
    { day: 'Thu', cases: 15, deaths: 0, recovered: 10 },
    { day: 'Fri', cases: 22, deaths: 0, recovered: 18 },
    { day: 'Sat', cases: 18, deaths: 1, recovered: 20 },
    { day: 'Sun', cases: 14, deaths: 0, recovered: 16 }
  ];

  const diseaseDistribution = [
    { name: 'Diarrhea', value: 45, color: '#0077B6' },
    { name: 'Gastroenteritis', value: 25, color: '#48CAE4' },
    { name: 'Typhoid', value: 15, color: '#2D6A4F' },
    { name: 'Cholera', value: 10, color: '#FFB830' },
    { name: 'Hepatitis A', value: 5, color: '#E63946' }
  ];

  const monthlyTrend = [
    { month: 'Jan', cases: 145, predictions: 150 },
    { month: 'Feb', cases: 130, predictions: 135 },
    { month: 'Mar', cases: 180, predictions: 175 },
    { month: 'Apr', cases: 165, predictions: 170 },
    { month: 'May', cases: 220, predictions: 215 },
    { month: 'Jun', cases: 280, predictions: 290 },
    { month: 'Jul', cases: 320, predictions: 310 },
    { month: 'Aug', cases: 295, predictions: 305 },
    { month: 'Sep', cases: 250, predictions: 245 }
  ];

  const [diseaseHotspots, setDiseaseHotspots] = React.useState<DiseaseData[]>([
    {
      location: 'Kohima District',
      cases: 45,
      trend: 'up',
      riskLevel: 'high',
      lastUpdated: '2024-09-20'
    },
    {
      location: 'Imphal West',
      cases: 32,
      trend: 'stable',
      riskLevel: 'medium',
      lastUpdated: '2024-09-20'
    },
    {
      location: 'Aizawl District',
      cases: 28,
      trend: 'down',
      riskLevel: 'medium',
      lastUpdated: '2024-09-19'
    },
    {
      location: 'Guwahati Rural',
      cases: 15,
      trend: 'stable',
      riskLevel: 'low',
      lastUpdated: '2024-09-20'
    }
  ]);

  // Map data for Northeast India with coordinates
  const mapMarkers = [
    { 
      position: [25.6751, 94.1086] as [number, number], // Kohima
      title: 'Kohima District',
      cases: 45,
      riskLevel: 'high',
      population: '270,000',
      type: 'hotspot'
    },
    { 
      position: [24.8170, 93.9368] as [number, number], // Imphal
      title: 'Imphal West',
      cases: 32,
      riskLevel: 'medium',
      population: '517,000',
      type: 'hotspot'
    },
    { 
      position: [23.7367, 92.7173] as [number, number], // Aizawl
      title: 'Aizawl District',
      cases: 28,
      riskLevel: 'medium',
      population: '400,000',
      type: 'hotspot'
    },
    { 
      position: [26.1445, 91.7362] as [number, number], // Guwahati
      title: 'Guwahati Rural',
      cases: 15,
      riskLevel: 'low',
      population: '1,116,000',
      type: 'hotspot'
    },
    { 
      position: [25.5788, 91.8933] as [number, number], // Shillong
      title: 'Shillong',
      cases: 18,
      riskLevel: 'low',
      population: '354,000',
      type: 'hotspot'
    },
    // Water Quality Monitoring Stations
    { 
      position: [26.2006, 92.9376] as [number, number], // Tezpur
      title: 'Tezpur Water Station',
      status: 'safe',
      ph: 7.2,
      type: 'water_station'
    },
    { 
      position: [24.6637, 93.9063] as [number, number], // Imphal Water Station
      title: 'Imphal Water Station',
      status: 'warning',
      ph: 6.8,
      type: 'water_station'
    },
    { 
      position: [25.5880, 91.8872] as [number, number], // Shillong Water Station
      title: 'Shillong Water Station',
      status: 'safe',
      ph: 7.4,
      type: 'water_station'
    }
  ];

  const getMarkerColor = (riskLevel: string, type: string) => {
    if (type === 'water_station') {
      return '#0077B6'; // Blue for water stations
    }
    
    switch (riskLevel) {
      case 'high': return '#DC2626'; // Red
      case 'medium': return '#F59E0B'; // Yellow
      case 'low': return '#10B981'; // Green
      default: return '#6B7280'; // Gray
    }
  };

  const getCircleRadius = (cases: number) => {
    if (cases > 40) return 8000;
    if (cases > 25) return 6000;
    return 4000;
  };

  const [waterQualityData, setWaterQualityData] = React.useState<WaterQualityData[]>([
    {
      location: 'Village A - Well #1',
      ph: 6.8,
      turbidity: 4.2,
      bacteria: 12,
      status: 'safe'
    },
    {
      location: 'Village B - Community Tap',
      ph: 5.9,
      turbidity: 8.5,
      bacteria: 45,
      status: 'warning'
    },
    {
      location: 'Village C - Hand Pump',
      ph: 8.2,
      turbidity: 15.0,
      bacteria: 120,
      status: 'critical'
    }
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
      case 'stable': return <Activity className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getWaterStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const totalCases = diseaseHotspots.reduce((sum, location) => sum + location.cases, 0);
  const activeCases = Math.floor(totalCases * 0.7);
  const recoveredCases = totalCases - activeCases;
  const criticalLocations = diseaseHotspots.filter(d => d.riskLevel === 'high').length;

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Health Department Dashboard
              </h1>
              <p className="text-gray-600">
                Real-time monitoring and analytics for water-borne disease surveillance
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="3m">Last 3 Months</option>
                <option value="1y">Last Year</option>
              </select>
              
              <button className="btn-primary flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalCases}</div>
            <div className="text-sm text-gray-600">Total Cases</div>
            <div className="text-xs text-blue-600 mt-1">↑ 12% from last week</div>
          </div>
          
          <div className="card text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{activeCases}</div>
            <div className="text-sm text-gray-600">Active Cases</div>
            <div className="text-xs text-yellow-600 mt-1">→ Stable</div>
          </div>
          
          <div className="card text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{recoveredCases}</div>
            <div className="text-sm text-gray-600">Recovered</div>
            <div className="text-xs text-green-600 mt-1">↑ 8% recovery rate</div>
          </div>
          
          <div className="card text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{criticalLocations}</div>
            <div className="text-sm text-gray-600">Critical Areas</div>
            <div className="text-xs text-red-600 mt-1">Requires immediate attention</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'mapping', label: 'GIS Mapping', icon: MapPin },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'alerts', label: 'Alert System', icon: Bell },
              { id: 'resources', label: 'Resources', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-niro-blue text-niro-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly Cases Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Weekly Disease Cases</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cases" fill="#0077B6" />
                    <Bar dataKey="recovered" fill="#2D6A4F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Disease Distribution */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Disease Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={diseaseDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {diseaseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Disease Hotspots */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Disease Hotspots</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cases
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trend
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {diseaseHotspots.map((hotspot, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {hotspot.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {hotspot.cases}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(hotspot.trend)}
                            <span className="capitalize">{hotspot.trend}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${getRiskColor(hotspot.riskLevel)}`}>
                            {hotspot.riskLevel.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {hotspot.lastUpdated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="btn-primary text-xs mr-2">View Details</button>
                          <button className="btn-secondary text-xs">Deploy Resources</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mapping' && (
          <div className="space-y-6">
            {/* GIS Map */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Interactive Disease Surveillance Map</h3>
              <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                <MapContainer
                  center={[25.5, 93.0]} // Center on Northeast India
                  zoom={7}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {mapMarkers.map((marker, index) => (
                    <React.Fragment key={index}>
                      <Marker position={marker.position}>
                        <Popup>
                          <div className="p-2">
                            <h4 className="font-semibold text-gray-800 mb-2">{marker.title}</h4>
                            {marker.type === 'hotspot' ? (
                              <div className="space-y-1 text-sm">
                                <p><strong>Cases:</strong> {marker.cases}</p>
                                <p><strong>Risk Level:</strong> <span className={`font-medium ${
                                  marker.riskLevel === 'high' ? 'text-red-600' :
                                  marker.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                                }`}>{marker.riskLevel?.toUpperCase()}</span></p>
                                <p><strong>Population:</strong> {marker.population}</p>
                              </div>
                            ) : (
                              <div className="space-y-1 text-sm">
                                <p><strong>Status:</strong> <span className={`font-medium ${
                                  marker.status === 'safe' ? 'text-green-600' : 'text-yellow-600'
                                }`}>{marker.status?.toUpperCase()}</span></p>
                                <p><strong>pH Level:</strong> {marker.ph}</p>
                                <p><strong>Type:</strong> Water Monitoring Station</p>
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                      
                      {marker.type === 'hotspot' && marker.cases && (
                        <Circle
                          center={marker.position}
                          radius={getCircleRadius(marker.cases)}
                          pathOptions={{
                            color: getMarkerColor(marker.riskLevel || 'low', marker.type),
                            fillColor: getMarkerColor(marker.riskLevel || 'low', marker.type),
                            fillOpacity: 0.2,
                            weight: 2
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </MapContainer>
              </div>
              
              {/* Map Legend */}
              <div className="mt-4 flex justify-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm">High Risk Hotspots</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Medium Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Low Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Water Stations</span>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Layer Controls</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Disease Hotspots', active: true },
                    { label: 'Water Quality Stations', active: true },
                    { label: 'Health Facilities', active: false },
                    { label: 'ASHA Worker Coverage', active: true },
                    { label: 'Population Density', active: false },
                    { label: 'Transportation Routes', active: false }
                  ].map((layer, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked={layer.active}
                        className="rounded border-gray-300 text-niro-blue focus:ring-niro-blue"
                      />
                      <span className="text-sm">{layer.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full btn-primary text-left justify-start">
                    Generate Risk Assessment Report
                  </button>
                  <button className="w-full btn-secondary text-left justify-start">
                    Identify Resource Gaps
                  </button>
                  <button className="w-full btn-secondary text-left justify-start">
                    Plan Intervention Routes
                  </button>
                  <button className="w-full btn-secondary text-left justify-start">
                    Export Map Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Predictive Analytics */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Predictive Outbreak Analysis</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#0077B6" 
                    strokeWidth={2}
                    name="Actual Cases"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predictions" 
                    stroke="#E63946" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="AI Predictions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Analytics Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <h4 className="font-semibold mb-2">Early Warning Score</h4>
                <div className="text-3xl font-bold text-yellow-600">7.3</div>
                <p className="text-sm text-gray-600">Medium Alert Level</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                </div>
              </div>

              <div className="card">
                <h4 className="font-semibold mb-2">Response Efficiency</h4>
                <div className="text-3xl font-bold text-green-600">92%</div>
                <p className="text-sm text-gray-600">Cases resolved within 48h</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div className="card">
                <h4 className="font-semibold mb-2">Coverage Rate</h4>
                <div className="text-3xl font-bold text-blue-600">85%</div>
                <p className="text-sm text-gray-600">Population under surveillance</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Alert Configuration */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Alert Configuration</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Threshold Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Green Alert (Cases per 1000)
                      </label>
                      <input type="number" defaultValue="5" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amber Alert (Cases per 1000)
                      </label>
                      <input type="number" defaultValue="15" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Red Alert (Cases per 1000)
                      </label>
                      <input type="number" defaultValue="30" className="input-field" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Notification Channels</h4>
                  <div className="space-y-3">
                    {[
                      { channel: 'Push Notifications', enabled: true },
                      { channel: 'SMS Alerts', enabled: true },
                      { channel: 'Email Reports', enabled: true },
                      { channel: 'IVR Calls', enabled: false },
                      { channel: 'WhatsApp Alerts', enabled: true }
                    ].map((item, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked={item.enabled}
                          className="rounded border-gray-300 text-niro-blue focus:ring-niro-blue"
                        />
                        <span className="text-sm">{item.channel}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Active Alerts</h3>
              <div className="space-y-3">
                {[
                  {
                    level: 'red',
                    title: 'High Outbreak Risk - Kohima District',
                    message: '45 cases reported in the last 48 hours. Immediate intervention required.',
                    time: '2 hours ago'
                  },
                  {
                    level: 'amber',
                    title: 'Water Contamination Detected',
                    message: 'Village B community tap showing high bacterial count.',
                    time: '6 hours ago'
                  },
                  {
                    level: 'green',
                    title: 'Successful Intervention',
                    message: 'Aizawl District cases declining after water chlorination program.',
                    time: '1 day ago'
                  }
                ].map((alert, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    alert.level === 'red' ? 'bg-red-50 border-red-500' :
                    alert.level === 'amber' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-green-50 border-green-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{alert.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button className="btn-primary text-xs">View</button>
                        <button className="btn-secondary text-xs">Dismiss</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            {/* Resource Allocation */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Resource Allocation</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Medical Supplies</h4>
                  <div className="space-y-3">
                    {[
                      { item: 'ORS Packets', available: 2500, allocated: 800, needed: 1200 },
                      { item: 'Water Purification Tablets', available: 1800, allocated: 600, needed: 900 },
                      { item: 'Antibiotics', available: 500, allocated: 200, needed: 400 },
                      { item: 'IV Fluids', available: 300, allocated: 150, needed: 200 }
                    ].map((supply, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{supply.item}</span>
                          <span className="text-xs text-gray-500">
                            Available: {supply.available}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Allocated: {supply.allocated} | Needed: {supply.needed}
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-niro-blue h-2 rounded-full" 
                            style={{ width: `${(supply.allocated / supply.needed) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Personnel Deployment</h4>
                  <div className="space-y-3">
                    {[
                      { role: 'ASHA Workers', total: 250, deployed: 180, coverage: '72%' },
                      { role: 'ANM Workers', total: 80, deployed: 65, coverage: '81%' },
                      { role: 'Doctors', total: 25, deployed: 20, coverage: '80%' },
                      { role: 'Lab Technicians', total: 15, deployed: 12, coverage: '80%' }
                    ].map((personnel, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{personnel.role}</span>
                          <span className="text-xs font-medium text-green-600">
                            {personnel.coverage} Coverage
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Deployed: {personnel.deployed} / {personnel.total}
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: personnel.coverage }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Resource Management Actions</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <button className="btn-primary">
                  Request Emergency Supplies
                </button>
                <button className="btn-secondary">
                  Deploy Mobile Health Unit
                </button>
                <button className="btn-secondary">
                  Allocate Additional Staff
                </button>
                <button className="btn-secondary">
                  Generate Resource Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;