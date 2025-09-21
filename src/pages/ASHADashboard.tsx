import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Clock,
  Phone,
  MessageCircle,
  FileText,
  Camera,
  Megaphone,
  Heart,
  Droplets,
  Search,
  Filter,
  Plus,
  Edit,
  Eye
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'community' | 'asha' | 'admin';
  language: string;
}

interface ASHADashboardProps {
  user: User;
  language: string;
}

interface CaseReport {
  id: string;
  patientName: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  location: string;
  date: string;
  status: 'pending' | 'followed_up' | 'referred' | 'resolved';
  followUpRequired: boolean;
}

interface OutbreakAlert {
  id: string;
  location: string;
  diseaseType: string;
  casesCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

interface EducationMaterial {
  id: string;
  title: string;
  type: 'poster' | 'video' | 'audio' | 'document';
  language: string;
  category: 'water_safety' | 'hygiene' | 'symptoms' | 'prevention';
}

const ASHADashboard: React.FC<ASHADashboardProps> = ({ user, language }) => {
  const [activeTab, setActiveTab] = React.useState<'cases' | 'outbreaks' | 'awareness' | 'training'>('cases');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  // Mock data
  const [cases, setCases] = React.useState<CaseReport[]>([
    {
      id: '1',
      patientName: 'Rama Devi',
      symptoms: ['fever', 'diarrhea', 'weakness'],
      severity: 'moderate',
      location: 'Village A, House #23',
      date: '2024-09-20',
      status: 'pending',
      followUpRequired: true
    },
    {
      id: '2',
      patientName: 'Kiran Singh',
      symptoms: ['stomach_pain', 'nausea'],
      severity: 'mild',
      location: 'Village B, House #45',
      date: '2024-09-19',
      status: 'followed_up',
      followUpRequired: false
    },
    {
      id: '3',
      patientName: 'Meera Kumari',
      symptoms: ['fever', 'vomiting', 'dehydration'],
      severity: 'severe',
      location: 'Village A, House #67',
      date: '2024-09-18',
      status: 'referred',
      followUpRequired: true
    }
  ]);

  const [outbreakAlerts, setOutbreakAlerts] = React.useState<OutbreakAlert[]>([
    {
      id: '1',
      location: 'Village A',
      diseaseType: 'Gastroenteritis',
      casesCount: 12,
      riskLevel: 'high',
      lastUpdated: '2024-09-20'
    },
    {
      id: '2',
      location: 'Village C',
      diseaseType: 'Diarrhea',
      casesCount: 5,
      riskLevel: 'medium',
      lastUpdated: '2024-09-19'
    }
  ]);

  const [educationMaterials, setEducationMaterials] = React.useState<EducationMaterial[]>([
    {
      id: '1',
      title: 'Water Boiling Guidelines',
      type: 'poster',
      language: 'assamese',
      category: 'water_safety'
    },
    {
      id: '2',
      title: 'Hand Washing Demonstration',
      type: 'video',
      language: 'english',
      category: 'hygiene'
    },
    {
      id: '3',
      title: 'Symptom Recognition Audio',
      type: 'audio',
      language: 'hindi',
      category: 'symptoms'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'followed_up': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'referred': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'text-red-600 bg-red-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'mild': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredCases = cases.filter(case_ => {
    const matchesStatus = filterStatus === 'all' || case_.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      case_.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateCaseStatus = (caseId: string, newStatus: string) => {
    setCases(prev => prev.map(case_ => 
      case_.id === caseId ? { ...case_, status: newStatus as any } : case_
    ));
  };

  const totalCases = cases.length;
  const pendingCases = cases.filter(c => c.status === 'pending').length;
  const followUpRequired = cases.filter(c => c.followUpRequired).length;
  const resolvedCases = cases.filter(c => c.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            ASHA Worker Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor community health, track cases, and conduct awareness programs
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{totalCases}</div>
            <div className="text-sm text-gray-600">Total Cases</div>
          </div>
          
          <div className="card text-center">
            <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{pendingCases}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          
          <div className="card text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{followUpRequired}</div>
            <div className="text-sm text-gray-600">Follow-ups</div>
          </div>
          
          <div className="card text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{resolvedCases}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'cases', label: 'Case Management', icon: FileText },
              { id: 'outbreaks', label: 'Outbreak Alerts', icon: AlertTriangle },
              { id: 'awareness', label: 'Awareness Tools', icon: Megaphone },
              { id: 'training', label: 'Training', icon: Heart }
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
        {activeTab === 'cases' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="card">
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10 w-full"
                      placeholder="Search by patient name or location..."
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="input-field w-full sm:w-auto"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="followed_up">Followed Up</option>
                      <option value="referred">Referred</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  
                  <button className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    <span>New Case</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cases List */}
            <div className="space-y-4">
              {filteredCases.map((case_) => (
                <div key={case_.id} className="card">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                        <h3 className="text-lg font-semibold mb-2 sm:mb-0">{case_.patientName}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(case_.status)}`}>
                            {case_.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(case_.severity)}`}>
                            {case_.severity}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">
                            <strong>Symptoms:</strong> {case_.symptoms.join(', ')}
                          </p>
                          <p className="text-gray-600">
                            <strong>Location:</strong> {case_.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">
                            <strong>Date:</strong> {case_.date}
                          </p>
                          {case_.followUpRequired && (
                            <p className="text-red-600 font-medium">
                              ⚠️ Follow-up required
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 lg:ml-4">
                      <button className="btn-secondary p-2">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="btn-secondary p-2">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="btn-secondary p-2">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                    {case_.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateCaseStatus(case_.id, 'followed_up')}
                          className="btn-primary text-xs"
                        >
                          Mark as Followed Up
                        </button>
                        <button
                          onClick={() => updateCaseStatus(case_.id, 'referred')}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded"
                        >
                          Refer to PHC
                        </button>
                      </>
                    )}
                    
                    {case_.status === 'followed_up' && (
                      <button
                        onClick={() => updateCaseStatus(case_.id, 'resolved')}
                        className="btn-success text-xs"
                      >
                        Mark as Resolved
                      </button>
                    )}
                    
                    <button className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded">
                      Add Notes
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredCases.length === 0 && (
                <div className="card text-center py-8">
                  <p className="text-gray-500">No cases found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'outbreaks' && (
          <div className="space-y-6">
            {/* Outbreak Alerts */}
            <div className="grid gap-4">
              {outbreakAlerts.map((alert) => (
                <div key={alert.id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          {alert.diseaseType} Outbreak
                        </h3>
                        <p className="text-gray-600">{alert.location}</p>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 text-sm font-medium rounded border ${getRiskColor(alert.riskLevel)}`}>
                      {alert.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        <strong>Cases Count:</strong> {alert.casesCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <strong>Last Updated:</strong> {alert.lastUpdated}
                      </p>
                    </div>
                    <div className="text-right">
                      <button className="btn-primary text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Quick Response Actions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Megaphone className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Start Awareness Campaign</span>
                </button>
                
                <button className="flex items-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Users className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Conduct House Visits</span>
                </button>
                
                <button className="flex items-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Phone className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">Contact Health Department</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'awareness' && (
          <div className="space-y-6">
            {/* Education Materials */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Educational Materials</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {educationMaterials.map((material) => (
                  <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-2">
                      {material.type === 'poster' && <FileText className="h-5 w-5 text-blue-500" />}
                      {material.type === 'video' && <Camera className="h-5 w-5 text-red-500" />}
                      {material.type === 'audio' && <MessageCircle className="h-5 w-5 text-green-500" />}
                      {material.type === 'document' && <FileText className="h-5 w-5 text-gray-500" />}
                      <span className="text-sm font-medium">{material.type.toUpperCase()}</span>
                    </div>
                    
                    <h4 className="font-semibold mb-1">{material.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Language: {material.language}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Category: {material.category.replace('_', ' ')}
                    </p>
                    
                    <div className="flex space-x-2">
                      <button className="btn-primary text-xs">Download</button>
                      <button className="btn-secondary text-xs">Share</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Tools */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Campaign Tools</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Megaphone className="h-4 w-4 text-blue-500 mr-2" />
                    Community Announcements
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Create and share health announcements with the community
                  </p>
                  <button className="btn-primary text-sm">Create Announcement</button>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Users className="h-4 w-4 text-green-500 mr-2" />
                    House-to-House Visits
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Plan and track your community visits for health education
                  </p>
                  <button className="btn-primary text-sm">Plan Visits</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-6">
            {/* Training Modules */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Training Modules</h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Water-Borne Disease Recognition',
                    progress: 85,
                    status: 'in_progress',
                    duration: '45 min'
                  },
                  {
                    title: 'Community Health Surveillance',
                    progress: 100,
                    status: 'completed',
                    duration: '60 min'
                  },
                  {
                    title: 'Emergency Response Protocols',
                    progress: 0,
                    status: 'not_started',
                    duration: '30 min'
                  },
                  {
                    title: 'Digital Health Tools Training',
                    progress: 60,
                    status: 'in_progress',
                    duration: '90 min'
                  }
                ].map((module, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{module.title}</h4>
                      <span className="text-sm text-gray-600">{module.duration}</span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-niro-blue h-2 rounded-full"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        module.status === 'completed' ? 'bg-green-100 text-green-800' :
                        module.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {module.status.replace('_', ' ').toUpperCase()}
                      </span>
                      
                      <button className="btn-primary text-sm">
                        {module.status === 'completed' ? 'Review' : 
                         module.status === 'in_progress' ? 'Continue' : 'Start'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Resources */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Support Resources</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">📞 Helpline Support</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    24/7 support for ASHA workers
                  </p>
                  <p className="text-sm font-medium">Call: 1800-XXX-ASHA</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">💬 Peer Community</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Connect with other ASHA workers
                  </p>
                  <button className="btn-secondary text-sm">Join Discussion</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ASHADashboard;