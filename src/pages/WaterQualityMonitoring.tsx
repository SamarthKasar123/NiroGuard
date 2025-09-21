import React from 'react';
import { 
  Droplets, 
  TestTube, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  MapPin,
  Calendar,
  Thermometer,
  Activity,
  Plus,
  Download,
  Wifi,
  WifiOff,
  Beaker,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface User {
  id: string;
  name: string;
  role: 'community' | 'asha' | 'admin';
  language: string;
}

interface WaterQualityMonitoringProps {
  user: User;
  language: string;
}

interface WaterStation {
  id: string;
  name: string;
  location: string;
  type: 'iot' | 'manual';
  status: 'online' | 'offline' | 'maintenance';
  lastUpdate: string;
  ph: number;
  turbidity: number;
  bacteria: number;
  temperature: number;
  qualityStatus: 'safe' | 'warning' | 'critical';
}

interface TestResult {
  id: string;
  stationId: string;
  date: string;
  time: string;
  ph: number;
  turbidity: number;
  bacteria: number;
  chlorine: number;
  testedBy: string;
  notes: string;
}

const WaterQualityMonitoring: React.FC<WaterQualityMonitoringProps> = ({ user, language }) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'stations' | 'testing' | 'trends'>('overview');
  const [selectedStation, setSelectedStation] = React.useState<string>('all');
  const [isAddingTest, setIsAddingTest] = React.useState(false);

  // Mock data
  const [waterStations, setWaterStations] = React.useState<WaterStation[]>([
    {
      id: '1',
      name: 'Village A - Community Well',
      location: 'Kohima District',
      type: 'iot',
      status: 'online',
      lastUpdate: '2024-09-20 14:30',
      ph: 7.2,
      turbidity: 3.5,
      bacteria: 8,
      temperature: 22.5,
      qualityStatus: 'safe'
    },
    {
      id: '2',
      name: 'Village B - Hand Pump',
      location: 'Imphal West',
      type: 'manual',
      status: 'offline',
      lastUpdate: '2024-09-19 09:15',
      ph: 6.8,
      turbidity: 12.0,
      bacteria: 45,
      temperature: 24.0,
      qualityStatus: 'warning'
    },
    {
      id: '3',
      name: 'Village C - Borewell',
      location: 'Aizawl District',
      type: 'iot',
      status: 'online',
      lastUpdate: '2024-09-20 14:45',
      ph: 8.5,
      turbidity: 25.0,
      bacteria: 120,
      temperature: 26.0,
      qualityStatus: 'critical'
    },
    {
      id: '4',
      name: 'PHC Water Supply',
      location: 'Guwahati Rural',
      type: 'iot',
      status: 'maintenance',
      lastUpdate: '2024-09-18 16:20',
      ph: 7.0,
      turbidity: 2.0,
      bacteria: 5,
      temperature: 23.0,
      qualityStatus: 'safe'
    }
  ]);

  const [testResults, setTestResults] = React.useState<TestResult[]>([
    {
      id: '1',
      stationId: '2',
      date: '2024-09-20',
      time: '10:00',
      ph: 6.8,
      turbidity: 12.0,
      bacteria: 45,
      chlorine: 0.2,
      testedBy: 'ASHA Worker - Priya Sharma',
      notes: 'Water appears slightly cloudy'
    }
  ]);

  // Mock trend data
  const phTrendData = [
    { time: '00:00', value: 7.2 },
    { time: '04:00', value: 7.1 },
    { time: '08:00', value: 7.3 },
    { time: '12:00', value: 7.0 },
    { time: '16:00', value: 7.2 },
    { time: '20:00', value: 7.4 },
    { time: '24:00', value: 7.1 }
  ];

  const turbidityTrendData = [
    { time: '00:00', value: 3.2 },
    { time: '04:00', value: 3.8 },
    { time: '08:00', value: 4.1 },
    { time: '12:00', value: 3.5 },
    { time: '16:00', value: 3.9 },
    { time: '20:00', value: 3.6 },
    { time: '24:00', value: 3.4 }
  ];

  const bacteriaData = [
    { station: 'Village A', count: 8 },
    { station: 'Village B', count: 45 },
    { station: 'Village C', count: 120 },
    { station: 'PHC Supply', count: 5 }
  ];

  const [newTest, setNewTest] = React.useState({
    stationId: '',
    ph: '',
    turbidity: '',
    bacteria: '',
    chlorine: '',
    notes: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-50 border-green-200';
      case 'offline': return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getQualityColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'offline': return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'maintenance': return <TestTube className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getQualityIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const handleAddTest = () => {
    if (!newTest.stationId || !newTest.ph || !newTest.turbidity || !newTest.bacteria) {
      alert('Please fill in all required fields');
      return;
    }

    const test: TestResult = {
      id: Date.now().toString(),
      stationId: newTest.stationId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      ph: parseFloat(newTest.ph),
      turbidity: parseFloat(newTest.turbidity),
      bacteria: parseInt(newTest.bacteria),
      chlorine: parseFloat(newTest.chlorine) || 0,
      testedBy: user.name,
      notes: newTest.notes
    };

    setTestResults(prev => [test, ...prev]);
    setNewTest({
      stationId: '',
      ph: '',
      turbidity: '',
      bacteria: '',
      chlorine: '',
      notes: ''
    });
    setIsAddingTest(false);
    alert('Test result added successfully');
  };

  const safeStations = waterStations.filter(s => s.qualityStatus === 'safe').length;
  const warningStations = waterStations.filter(s => s.qualityStatus === 'warning').length;
  const criticalStations = waterStations.filter(s => s.qualityStatus === 'critical').length;
  const onlineStations = waterStations.filter(s => s.status === 'online').length;

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Water Quality Monitoring
              </h1>
              <p className="text-gray-600">
                Real-time monitoring and testing of water sources across communities
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAddingTest(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Test Result</span>
              </button>
              
              <button className="btn-secondary flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{safeStations}</div>
            <div className="text-sm text-gray-600">Safe Sources</div>
          </div>
          
          <div className="card text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{warningStations}</div>
            <div className="text-sm text-gray-600">Warning Status</div>
          </div>
          
          <div className="card text-center">
            <div className="flex items-center justify-center mb-2">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{criticalStations}</div>
            <div className="text-sm text-gray-600">Critical Issues</div>
          </div>
          
          <div className="card text-center">
            <div className="flex items-center justify-center mb-2">
              <Wifi className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{onlineStations}</div>
            <div className="text-sm text-gray-600">Online Sensors</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'stations', label: 'Monitoring Stations', icon: MapPin },
              { id: 'testing', label: 'Manual Testing', icon: TestTube },
              { id: 'trends', label: 'Data Trends', icon: TrendingUp }
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
            {/* Water Quality Summary */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Water Quality Status Map</h3>
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Interactive Water Quality Map</p>
                      <p className="text-sm text-gray-500">
                        Real-time visualization of water monitoring stations
                      </p>
                      <div className="mt-4 flex justify-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-xs">Safe</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs">Warning</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-xs">Critical</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="card">
                  <h4 className="font-semibold mb-3">Water Quality Standards</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>pH Level:</span>
                      <span className="font-medium">6.5 - 8.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Turbidity:</span>
                      <span className="font-medium">&lt; 5 NTU</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bacteria Count:</span>
                      <span className="font-medium">&lt; 50 CFU/ml</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chlorine:</span>
                      <span className="font-medium">0.2 - 1.0 mg/L</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h4 className="font-semibold mb-3">Recent Alerts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>Critical bacteria levels in Village C</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span>High turbidity in Village B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bacteria Count Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Bacterial Contamination Levels</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bacteriaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="station" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#48CAE4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'stations' && (
          <div className="space-y-6">
            {/* Station Filter */}
            <div className="card">
              <div className="flex items-center space-x-4">
                <Filter className="h-4 w-4 text-gray-400" />
                <select className="input-field max-w-xs">
                  <option value="all">All Stations</option>
                  <option value="iot">IoT Sensors Only</option>
                  <option value="manual">Manual Testing Only</option>
                  <option value="online">Online Only</option>
                  <option value="critical">Critical Status Only</option>
                </select>
              </div>
            </div>

            {/* Stations Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {waterStations.map((station) => (
                <div key={station.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{station.name}</h3>
                        {getStatusIcon(station.status)}
                      </div>
                      <p className="text-gray-600 mb-1">{station.location}</p>
                      <p className="text-sm text-gray-500">
                        Type: {station.type === 'iot' ? 'IoT Sensor' : 'Manual Testing'}
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(station.status)}`}>
                        {station.status.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getQualityColor(station.qualityStatus)}`}>
                        {station.qualityStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Water Quality Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-blue-600">{station.ph}</div>
                      <div className="text-xs text-gray-600">pH Level</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-green-600">{station.turbidity}</div>
                      <div className="text-xs text-gray-600">Turbidity (NTU)</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-red-600">{station.bacteria}</div>
                      <div className="text-xs text-gray-600">Bacteria (CFU/ml)</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-orange-600">{station.temperature}°C</div>
                      <div className="text-xs text-gray-600">Temperature</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Last updated: {station.lastUpdate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getQualityIcon(station.qualityStatus)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="space-y-6">
            {/* Manual Test Results */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Manual Test Results</h3>
                <button
                  onClick={() => setIsAddingTest(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Test</span>
                </button>
              </div>

              {testResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No manual test results recorded yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Station
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date/Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          pH
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Turbidity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bacteria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tested By
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testResults.map((test) => {
                        const station = waterStations.find(s => s.id === test.stationId);
                        return (
                          <tr key={test.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {station?.name || 'Unknown Station'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {test.date} {test.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {test.ph}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {test.turbidity} NTU
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {test.bacteria} CFU/ml
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {test.testedBy}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Testing Guidelines */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Water Testing Guidelines</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">pH Testing</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use calibrated pH strips or digital meter</li>
                    <li>• Test at room temperature</li>
                    <li>• Safe range: 6.5 - 8.5</li>
                    <li>• Record immediately after testing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Turbidity Testing</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use turbidity meter or visual comparison</li>
                    <li>• Measure in Nephelometric Turbidity Units (NTU)</li>
                    <li>• Safe level: &lt; 5 NTU</li>
                    <li>• Clean equipment before each test</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Bacterial Testing</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use sterile collection bottles</li>
                    <li>• Test within 24 hours of collection</li>
                    <li>• Safe level: &lt; 50 CFU/ml</li>
                    <li>• Follow cold chain during transport</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Safety Protocols</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Wear protective gloves</li>
                    <li>• Use sterile testing equipment</li>
                    <li>• Dispose of materials safely</li>
                    <li>• Report critical results immediately</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            {/* pH Trend */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">pH Level Trends (24 Hours)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={phTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[6, 9]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#0077B6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Turbidity Trend */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Turbidity Trends (24 Hours)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={turbidityTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#48CAE4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Quality Summary */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <h4 className="font-semibold mb-2">Average pH</h4>
                <div className="text-3xl font-bold text-blue-600">7.2</div>
                <p className="text-sm text-gray-600">Within safe range</p>
              </div>
              
              <div className="card">
                <h4 className="font-semibold mb-2">Average Turbidity</h4>
                <div className="text-3xl font-bold text-green-600">3.7 NTU</div>
                <p className="text-sm text-gray-600">Below WHO limit</p>
              </div>
              
              <div className="card">
                <h4 className="font-semibold mb-2">Quality Score</h4>
                <div className="text-3xl font-bold text-green-600">85%</div>
                <p className="text-sm text-gray-600">Good overall quality</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Test Modal */}
      {isAddingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Manual Test Result</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Water Station *
                </label>
                <select
                  value={newTest.stationId}
                  onChange={(e) => setNewTest({...newTest, stationId: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select Station</option>
                  {waterStations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    pH Level *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTest.ph}
                    onChange={(e) => setNewTest({...newTest, ph: e.target.value})}
                    className="input-field"
                    placeholder="7.0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Turbidity (NTU) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTest.turbidity}
                    onChange={(e) => setNewTest({...newTest, turbidity: e.target.value})}
                    className="input-field"
                    placeholder="5.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bacteria Count (CFU/ml) *
                  </label>
                  <input
                    type="number"
                    value={newTest.bacteria}
                    onChange={(e) => setNewTest({...newTest, bacteria: e.target.value})}
                    className="input-field"
                    placeholder="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chlorine (mg/L)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTest.chlorine}
                    onChange={(e) => setNewTest({...newTest, chlorine: e.target.value})}
                    className="input-field"
                    placeholder="0.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newTest.notes}
                  onChange={(e) => setNewTest({...newTest, notes: e.target.value})}
                  className="input-field h-20"
                  placeholder="Any observations about water quality..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsAddingTest(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTest}
                className="btn-primary"
              >
                Add Test Result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterQualityMonitoring;