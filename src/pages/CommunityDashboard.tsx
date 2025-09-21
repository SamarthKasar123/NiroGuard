import React from 'react';
import { 
  AlertTriangle, 
  Droplets, 
  Thermometer, 
  MapPin, 
  Phone, 
  MessageCircle,
  Camera,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Heart,
  User,
  Calendar
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'community' | 'asha' | 'admin';
  language: string;
}

interface CommunityDashboardProps {
  user: User;
  language: string;
}

interface SymptomReport {
  id: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  date: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

interface WaterComplaint {
  id: string;
  issue: string;
  location: string;
  date: string;
  status: 'pending' | 'investigating' | 'resolved';
}

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  date: string;
}

const CommunityDashboard: React.FC<CommunityDashboardProps> = ({ user, language }) => {
  const [activeTab, setActiveTab] = React.useState<'report' | 'status' | 'alerts' | 'education'>('report');
  const [symptoms, setSymptoms] = React.useState<string[]>([]);
  const [waterIssue, setWaterIssue] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [severity, setSeverity] = React.useState<'mild' | 'moderate' | 'severe'>('mild');

  // Mock data
  const [reports, setReports] = React.useState<SymptomReport[]>([
    {
      id: '1',
      symptoms: ['fever', 'diarrhea'],
      severity: 'moderate',
      date: '2024-09-20',
      status: 'reviewed'
    }
  ]);

  const [waterComplaints, setWaterComplaints] = React.useState<WaterComplaint[]>([
    {
      id: '1',
      issue: 'Water appears cloudy and has strange smell',
      location: 'Village Well #3',
      date: '2024-09-19',
      status: 'investigating'
    }
  ]);

  const [alerts, setAlerts] = React.useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Health Advisory',
      message: 'Increased cases of gastroenteritis reported in nearby areas. Boil water before drinking.',
      date: '2024-09-20'
    },
    {
      id: '2',
      type: 'info',
      title: 'Vaccination Drive',
      message: 'Free hepatitis vaccination camp on September 25th at Primary Health Center.',
      date: '2024-09-18'
    }
  ]);

  const commonSymptoms = [
    'fever', 'diarrhea', 'vomiting', 'nausea', 'stomach_pain', 
    'headache', 'weakness', 'dehydration', 'loss_of_appetite'
  ];

  const symptomLabels: { [key: string]: string } = {
    fever: 'Fever',
    diarrhea: 'Diarrhea',
    vomiting: 'Vomiting',
    nausea: 'Nausea',
    stomach_pain: 'Stomach Pain',
    headache: 'Headache',
    weakness: 'Weakness',
    dehydration: 'Dehydration',
    loss_of_appetite: 'Loss of Appetite'
  };

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSymptomReport = () => {
    if (symptoms.length === 0) return;
    
    const newReport: SymptomReport = {
      id: Date.now().toString(),
      symptoms,
      severity,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    setReports(prev => [newReport, ...prev]);
    setSymptoms([]);
    setSeverity('mild');
    
    // Show success message
    alert('Symptom report submitted successfully. A health worker will review it soon.');
  };

  const handleWaterComplaint = () => {
    if (!waterIssue || !location) return;
    
    const newComplaint: WaterComplaint = {
      id: Date.now().toString(),
      issue: waterIssue,
      location,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    setWaterComplaints(prev => [newComplaint, ...prev]);
    setWaterIssue('');
    setLocation('');
    
    alert('Water quality complaint submitted. Local authorities will investigate.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'reviewed': case 'investigating': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'danger': return 'alert-red';
      case 'warning': return 'alert-amber';
      case 'info': return 'alert-green';
      default: return 'alert-green';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600">
            Report health issues and stay informed about water quality in your community
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
            <div className="text-sm text-gray-600">Health Reports</div>
          </div>
          
          <div className="card text-center">
            <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{waterComplaints.length}</div>
            <div className="text-sm text-gray-600">Water Issues</div>
          </div>
          
          <div className="card text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{alerts.length}</div>
            <div className="text-sm text-gray-600">Active Alerts</div>
          </div>
          
          <div className="card text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {reports.filter(r => r.status === 'resolved').length}
            </div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'report', label: 'Report Issues', icon: Send },
              { id: 'status', label: 'My Reports', icon: User },
              { id: 'alerts', label: 'Health Alerts', icon: AlertTriangle },
              { id: 'education', label: 'Health Tips', icon: Heart }
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
        {activeTab === 'report' && (
          <div className="space-y-6">
            {/* Symptom Reporting */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                Report Health Symptoms
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select symptoms you are experiencing:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonSymptoms.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => handleSymptomToggle(symptom)}
                        className={`p-2 text-sm rounded border text-left transition-colors ${
                          symptoms.includes(symptom)
                            ? 'bg-niro-blue text-white border-niro-blue'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-niro-blue'
                        }`}
                      >
                        {symptomLabels[symptom]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity Level:
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="input-field max-w-xs"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>

                <button
                  onClick={handleSymptomReport}
                  disabled={symptoms.length === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Symptom Report
                </button>
              </div>
            </div>

            {/* Water Quality Reporting */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                Report Water Quality Issue
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Describe the water quality issue:
                  </label>
                  <textarea
                    value={waterIssue}
                    onChange={(e) => setWaterIssue(e.target.value)}
                    className="input-field h-24"
                    placeholder="e.g., Water has unusual color, smell, or taste..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="input-field pl-10"
                      placeholder="e.g., Village Well #2, Community Tap"
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleWaterComplaint}
                    disabled={!waterIssue || !location}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Water Complaint
                  </button>
                  
                  <button className="btn-secondary flex items-center space-x-2">
                    <Camera className="h-4 w-4" />
                    <span>Add Photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="card bg-red-50 border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Emergency Contacts
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-red-700">Local Health Center:</span>
                  <a href="tel:+919876543210" className="text-red-800 font-medium">+91 98765 43210</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-700">ASHA Worker:</span>
                  <a href="tel:+919876543211" className="text-red-800 font-medium">+91 98765 43211</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-700">Emergency Helpline:</span>
                  <a href="tel:108" className="text-red-800 font-medium">108</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="space-y-6">
            {/* Health Reports */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">My Health Reports</h3>
              {reports.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reports submitted yet</p>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{report.date}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm">
                        <strong>Symptoms:</strong> {report.symptoms.map(s => symptomLabels[s]).join(', ')}
                      </p>
                      <p className="text-sm">
                        <strong>Severity:</strong> {report.severity}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Water Complaints */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Water Quality Complaints</h3>
              {waterComplaints.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No complaints submitted yet</p>
              ) : (
                <div className="space-y-3">
                  {waterComplaints.map((complaint) => (
                    <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{complaint.date}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>
                      <p className="text-sm mb-1">
                        <strong>Issue:</strong> {complaint.issue}
                      </p>
                      <p className="text-sm">
                        <strong>Location:</strong> {complaint.location}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`${getAlertColor(alert.type)} flex items-start space-x-3`}>
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold">{alert.title}</h4>
                  <p className="text-sm mt-1">{alert.message}</p>
                  <p className="text-xs mt-2 opacity-75">{alert.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'education' && (
          <div className="space-y-6">
            {/* Health Tips */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">Water Safety Tips</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <Droplets className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Always boil water for at least 1 minute before drinking</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Droplets className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Store boiled water in clean, covered containers</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Droplets className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Use water purification tablets when boiling is not possible</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Droplets className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Avoid drinking from unknown or contaminated sources</span>
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-3 text-green-800">Hygiene Practices</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Wash hands frequently with soap and clean water</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use hand sanitizer when soap is not available</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Keep food covered and consume freshly cooked meals</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Maintain clean surroundings and proper waste disposal</span>
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-3 text-red-800">Warning Signs</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Severe diarrhea lasting more than 24 hours</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>High fever with chills and body ache</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Signs of dehydration (dry mouth, dizziness)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Blood in stool or persistent vomiting</span>
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-3 text-purple-800">Prevention Tips</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <Heart className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Get vaccinated against preventable diseases</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Heart className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Maintain good nutrition and adequate rest</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Heart className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Stay informed about local health advisories</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Heart className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Report suspicious symptoms early</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDashboard;