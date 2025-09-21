import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MapPin, 
  Calendar,
  Award,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart,
  Activity,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface User {
  id: string;
  name: string;
  role: 'community' | 'asha' | 'admin';
  language: string;
}

interface ImpactDashboardProps {
  user: User;
  language: string;
}

const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ user, language }) => {
  const [timeRange, setTimeRange] = React.useState<'1M' | '3M' | '6M' | '1Y'>('6M');
  const [selectedMetric, setSelectedMetric] = React.useState<'detection' | 'prevention' | 'response' | 'education'>('detection');

  // Mock impact data
  const overallMetrics = {
    totalCases: 1247,
    casesTrend: -23.5,
    earlyDetection: 89.3,
    detectionTrend: 12.1,
    responsiveTime: 2.4,
    timeTrend: -18.7,
    livesImpacted: 15678,
    impactTrend: 34.2
  };

  // Early Detection Data
  const detectionTrendData = [
    { month: 'Jan 2024', traditional: 45, niroguard: 78, improved: 73 },
    { month: 'Feb 2024', traditional: 52, niroguard: 82, improved: 58 },
    { month: 'Mar 2024', traditional: 48, niroguard: 85, improved: 77 },
    { month: 'Apr 2024', traditional: 41, niroguard: 89, improved: 117 },
    { month: 'May 2024', traditional: 38, niroguard: 91, improved: 139 },
    { month: 'Jun 2024', traditional: 44, niroguard: 93, improved: 111 }
  ];

  // Disease Prevention Impact
  const preventionData = [
    { name: 'Cholera', prevented: 234, historical: 89, reduction: 61.9 },
    { name: 'Typhoid', prevented: 187, historical: 156, reduction: 16.6 },
    { name: 'Diarrheal Diseases', prevented: 445, historical: 298, reduction: 33.0 },
    { name: 'Hepatitis A', prevented: 98, historical: 67, reduction: 31.7 },
    { name: 'E.coli Infections', prevented: 156, historical: 134, reduction: 14.1 }
  ];

  // Response Time Improvement
  const responseTimeData = [
    { stage: 'Detection', before: 7.2, after: 2.1, improvement: 70.8 },
    { stage: 'Reporting', before: 12.5, after: 0.5, improvement: 96.0 },
    { stage: 'Verification', before: 24.8, after: 4.2, improvement: 83.1 },
    { stage: 'Response', before: 48.2, after: 18.6, improvement: 61.4 },
    { stage: 'Recovery', before: 168.5, after: 89.2, improvement: 47.1 }
  ];

  // Regional Impact Distribution
  const regionalData = [
    { region: 'Assam', cases: 342, prevented: 89, coverage: 94.2, population: 125000 },
    { region: 'Meghalaya', cases: 278, prevented: 67, coverage: 87.5, population: 98000 },
    { region: 'Tripura', cases: 189, prevented: 45, coverage: 91.8, population: 78000 },
    { region: 'Manipur', cases: 156, prevented: 38, coverage: 89.3, population: 65000 },
    { region: 'Nagaland', cases: 134, prevented: 32, coverage: 85.7, population: 54000 },
    { region: 'Mizoram', cases: 98, prevented: 24, coverage: 88.1, population: 42000 },
    { region: 'Arunachal Pradesh', cases: 89, prevented: 21, coverage: 82.4, population: 38000 },
    { region: 'Sikkim', cases: 67, prevented: 16, coverage: 91.2, population: 25000 }
  ];

  // Cost-Benefit Analysis
  const costBenefitData = [
    { category: 'Healthcare Savings', amount: 2450000, percentage: 68.2 },
    { category: 'Productivity Gains', amount: 780000, percentage: 21.7 },
    { category: 'Infrastructure Avoided', amount: 365000, percentage: 10.1 }
  ];

  // Success Stories Data
  const successStories = [
    {
      id: 1,
      title: 'Cholera Outbreak Prevention in Guwahati Suburb',
      region: 'Assam',
      date: 'March 2024',
      impact: 'Prevented 45+ cases',
      description: 'Early detection through community reporting prevented a major cholera outbreak in a densely populated area.',
      metrics: { casesAvoided: 45, peopleProtected: 2400, responseTime: '4 hours' }
    },
    {
      id: 2,
      title: 'Rapid Response to Contaminated Water Source',
      region: 'Meghalaya',
      date: 'April 2024',
      impact: 'Protected 1,800 residents',
      description: 'IoT sensors detected contamination, triggering immediate community alerts and alternative water arrangements.',
      metrics: { casesAvoided: 23, peopleProtected: 1800, responseTime: '2 hours' }
    },
    {
      id: 3,
      title: 'Community Health Education Success',
      region: 'Tripura',
      date: 'May 2024',
      impact: '89% behavior change',
      description: 'Multilingual education campaign resulted in significant improvement in hygiene practices.',
      metrics: { casesAvoided: 67, peopleProtected: 3200, responseTime: 'Preventive' }
    }
  ];

  const COLORS = ['#0077B6', '#48CAE4', '#90E0EF', '#ADE8F4', '#CAF0F8'];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendColor = (trend: number) => {
    return trend > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Impact Dashboard
              </h1>
              <p className="text-gray-600">
                Measuring the real-world impact of NiroGuard on community health outcomes
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-white rounded-lg border border-gray-300">
                {['1M', '3M', '6M', '1Y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range as any)}
                    className={`px-4 py-2 text-sm font-medium ${
                      timeRange === range
                        ? 'bg-niro-blue text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    } ${range === '1M' ? 'rounded-l-lg' : range === '1Y' ? 'rounded-r-lg' : ''}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              
              <button className="btn-secondary flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
              
              <button className="btn-primary flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cases Prevented</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(overallMetrics.totalCases)}</p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(overallMetrics.casesTrend)}
                <span className={`text-sm font-medium ${getTrendColor(overallMetrics.casesTrend)}`}>
                  {Math.abs(overallMetrics.casesTrend)}%
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Early Detection Rate</p>
                <p className="text-2xl font-bold text-gray-900">{overallMetrics.earlyDetection}%</p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(overallMetrics.detectionTrend)}
                <span className={`text-sm font-medium ${getTrendColor(overallMetrics.detectionTrend)}`}>
                  {Math.abs(overallMetrics.detectionTrend)}%
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{overallMetrics.responsiveTime}h</p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(overallMetrics.timeTrend)}
                <span className={`text-sm font-medium ${getTrendColor(overallMetrics.timeTrend)}`}>
                  {Math.abs(overallMetrics.timeTrend)}%
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lives Impacted</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(overallMetrics.livesImpacted)}</p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(overallMetrics.impactTrend)}
                <span className={`text-sm font-medium ${getTrendColor(overallMetrics.impactTrend)}`}>
                  {Math.abs(overallMetrics.impactTrend)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Selection Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'detection', label: 'Early Detection', icon: Target },
              { id: 'prevention', label: 'Disease Prevention', icon: CheckCircle },
              { id: 'response', label: 'Response Time', icon: Activity },
              { id: 'education', label: 'Education Impact', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedMetric(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedMetric === tab.id
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

        {/* Content Based on Selected Metric */}
        {selectedMetric === 'detection' && (
          <div className="space-y-6">
            {/* Early Detection Trend */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Early Detection Improvement</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={detectionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="traditional" 
                    stroke="#EF4444" 
                    name="Traditional Methods (%)"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="niroguard" 
                    stroke="#0077B6" 
                    name="With NiroGuard (%)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Detection Method Comparison */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <h4 className="font-semibold mb-2">Community Reporting</h4>
                <div className="text-3xl font-bold text-blue-600 mb-1">78%</div>
                <p className="text-sm text-gray-600">Detection rate improvement</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div className="card">
                <h4 className="font-semibold mb-2">IoT Sensor Integration</h4>
                <div className="text-3xl font-bold text-green-600 mb-1">92%</div>
                <p className="text-sm text-gray-600">Water quality detection</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div className="card">
                <h4 className="font-semibold mb-2">ASHA Worker Reports</h4>
                <div className="text-3xl font-bold text-purple-600 mb-1">85%</div>
                <p className="text-sm text-gray-600">Field verification accuracy</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'prevention' && (
          <div className="space-y-6">
            {/* Disease Prevention Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Disease Cases Prevented by Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={preventionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="prevented" fill="#0077B6" name="Cases Prevented" />
                  <Bar dataKey="historical" fill="#EF4444" name="Historical Average" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>

            {/* Prevention Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="font-semibold mb-4">Prevention Effectiveness</h4>
                <div className="space-y-4">
                  {preventionData.map((disease, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{disease.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600 font-medium">{disease.reduction}%</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min(disease.reduction, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h4 className="font-semibold mb-4">Cost Savings</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={costBenefitData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {costBenefitData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'response' && (
          <div className="space-y-6">
            {/* Response Time Improvement */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Response Time Improvement by Stage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="before" fill="#EF4444" name="Before NiroGuard (hours)" />
                  <Bar dataKey="after" fill="#0077B6" name="After NiroGuard (hours)" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>

            {/* Response Metrics */}
            <div className="grid md:grid-cols-5 gap-4">
              {responseTimeData.map((stage, index) => (
                <div key={index} className="card text-center">
                  <h4 className="font-semibold text-sm mb-2">{stage.stage}</h4>
                  <div className="text-2xl font-bold text-green-600 mb-1">{stage.improvement}%</div>
                  <p className="text-xs text-gray-600">Faster</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {stage.before}h → {stage.after}h
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedMetric === 'education' && (
          <div className="space-y-6">
            {/* Regional Coverage */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Regional Coverage and Impact</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Region
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Population
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Coverage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cases Handled
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Impact
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {regionalData.map((region, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {region.region}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatNumber(region.population)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${region.coverage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{region.coverage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {region.cases}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          +{region.prevented} prevented
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Success Stories */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-6">Success Stories & Case Studies</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {successStories.map((story) => (
              <div key={story.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-sm leading-tight">{story.title}</h4>
                  <Award className="h-5 w-5 text-yellow-500 flex-shrink-0 ml-2" />
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {story.region}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {story.date}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{story.description}</p>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">{story.metrics.casesAvoided}</div>
                    <div className="text-xs text-gray-500">Cases Avoided</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{formatNumber(story.metrics.peopleProtected)}</div>
                    <div className="text-xs text-gray-500">Protected</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{story.metrics.responseTime}</div>
                    <div className="text-xs text-gray-500">Response</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {story.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 card bg-gradient-to-r from-niro-blue to-niro-aqua text-white">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              Help Us Reach More Communities
            </h3>
            <p className="mb-6">
              Your participation in NiroGuard helps protect more lives. Share the impact in your community.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-niro-blue px-6 py-2 rounded-lg font-medium hover:bg-gray-100">
                Share Success Story
              </button>
              <button className="border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-niro-blue">
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;