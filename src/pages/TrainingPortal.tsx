import React from 'react';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  Trophy,
  Users,
  Download,
  MessageCircle,
  HelpCircle,
  Phone,
  FileText,
  Award,
  Target,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'community' | 'asha' | 'admin';
  language: string;
}

interface TrainingPortalProps {
  user: User;
  language: string;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'surveillance' | 'response' | 'technology' | 'communication' | 'safety';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  rating: number;
  enrollments: number;
  prerequisites?: string[];
  learningOutcomes: string[];
}

interface Certificate {
  id: string;
  title: string;
  completionDate: string;
  score: number;
  moduleId: string;
}

const TrainingPortal: React.FC<TrainingPortalProps> = ({ user, language }) => {
  const [activeTab, setActiveTab] = React.useState<'modules' | 'progress' | 'certificates' | 'community'>('modules');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedModule, setSelectedModule] = React.useState<TrainingModule | null>(null);

  // Mock training data
  const [trainingModules, setTrainingModules] = React.useState<TrainingModule[]>([
    {
      id: '1',
      title: 'Water-Borne Disease Surveillance',
      description: 'Learn to identify, monitor, and report water-borne disease cases in your community.',
      category: 'surveillance',
      difficulty: 'beginner',
      duration: '45 minutes',
      progress: 85,
      status: 'in_progress',
      rating: 4.8,
      enrollments: 234,
      learningOutcomes: [
        'Identify common water-borne diseases',
        'Recognize early warning signs',
        'Collect and report surveillance data',
        'Use mobile reporting tools'
      ]
    },
    {
      id: '2',
      title: 'Community Health Emergency Response',
      description: 'Master protocols for responding to health emergencies and disease outbreaks.',
      category: 'response',
      difficulty: 'intermediate',
      duration: '60 minutes',
      progress: 100,
      status: 'completed',
      rating: 4.9,
      enrollments: 189,
      prerequisites: ['Water-Borne Disease Surveillance'],
      learningOutcomes: [
        'Implement emergency response protocols',
        'Coordinate with health authorities',
        'Manage community communications',
        'Deploy field intervention strategies'
      ]
    },
    {
      id: '3',
      title: 'Digital Health Tools Training',
      description: 'Get hands-on experience with NiroGuard app and other digital health monitoring tools.',
      category: 'technology',
      difficulty: 'beginner',
      duration: '90 minutes',
      progress: 60,
      status: 'in_progress',
      rating: 4.7,
      enrollments: 312,
      learningOutcomes: [
        'Navigate the NiroGuard mobile app',
        'Submit case reports digitally',
        'Use offline sync features',
        'Troubleshoot common technical issues'
      ]
    },
    {
      id: '4',
      title: 'Community Engagement and Communication',
      description: 'Develop skills to effectively communicate health information and engage communities.',
      category: 'communication',
      difficulty: 'intermediate',
      duration: '75 minutes',
      progress: 0,
      status: 'not_started',
      rating: 4.6,
      enrollments: 156,
      learningOutcomes: [
        'Design effective health messages',
        'Conduct community meetings',
        'Handle misinformation and resistance',
        'Use multiple communication channels'
      ]
    },
    {
      id: '5',
      title: 'Personal and Community Safety Protocols',
      description: 'Learn safety measures when dealing with infectious diseases and contaminated water sources.',
      category: 'safety',
      difficulty: 'beginner',
      duration: '30 minutes',
      progress: 0,
      status: 'not_started',
      rating: 4.8,
      enrollments: 278,
      learningOutcomes: [
        'Use personal protective equipment',
        'Follow infection control measures',
        'Handle contaminated materials safely',
        'Protect community during interventions'
      ]
    }
  ]);

  const [certificates, setCertificates] = React.useState<Certificate[]>([
    {
      id: '1',
      title: 'Community Health Emergency Response Certification',
      completionDate: '2024-09-15',
      score: 92,
      moduleId: '2'
    }
  ]);

  const categories = [
    { id: 'all', label: 'All Categories', icon: BookOpen },
    { id: 'surveillance', label: 'Disease Surveillance', icon: Target },
    { id: 'response', label: 'Emergency Response', icon: Users },
    { id: 'technology', label: 'Digital Tools', icon: Play },
    { id: 'communication', label: 'Communication', icon: MessageCircle },
    { id: 'safety', label: 'Safety Protocols', icon: CheckCircle }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'not_started': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData ? <categoryData.icon className="h-4 w-4" /> : null;
  };

  const filteredModules = selectedCategory === 'all' 
    ? trainingModules 
    : trainingModules.filter(module => module.category === selectedCategory);

  const completedModules = trainingModules.filter(m => m.status === 'completed').length;
  const inProgressModules = trainingModules.filter(m => m.status === 'in_progress').length;
  const totalProgress = Math.round(trainingModules.reduce((sum, m) => sum + m.progress, 0) / trainingModules.length);

  const startModule = (moduleId: string) => {
    setTrainingModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, status: 'in_progress' as const, progress: Math.max(module.progress, 5) }
        : module
    ));
  };

  const continueModule = (moduleId: string) => {
    // In a real app, this would navigate to the module content
    alert(`Continuing module: ${trainingModules.find(m => m.id === moduleId)?.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Training Portal
              </h1>
              <p className="text-gray-600">
                Enhance your skills in community health monitoring and disease surveillance
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-niro-blue">{totalProgress}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{completedModules}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          
          <div className="card text-center">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{inProgressModules}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          
          <div className="card text-center">
            <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{certificates.length}</div>
            <div className="text-sm text-gray-600">Certificates</div>
          </div>
          
          <div className="card text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">85%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'modules', label: 'Training Modules', icon: BookOpen },
              { id: 'progress', label: 'My Progress', icon: TrendingUp },
              { id: 'certificates', label: 'Certificates', icon: Award },
              { id: 'community', label: 'Community Support', icon: Users }
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
        {activeTab === 'modules' && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="card">
              <h3 className="font-semibold mb-3">Browse by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-niro-blue text-white border-niro-blue'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-niro-blue'
                    }`}
                  >
                    <category.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Training Modules */}
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredModules.map((module) => (
                <div key={module.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getCategoryIcon(module.category)}
                        <h3 className="text-lg font-semibold">{module.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(module.status)}`}>
                          {module.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(module.difficulty)}`}>
                          {module.difficulty.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Module Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="text-center">
                      <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                      <span className="text-gray-600">{module.duration}</span>
                    </div>
                    <div className="text-center">
                      <Star className="h-4 w-4 text-yellow-500 mx-auto mb-1" />
                      <span className="text-gray-600">{module.rating}</span>
                    </div>
                    <div className="text-center">
                      <Users className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <span className="text-gray-600">{module.enrollments}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {module.status !== 'not_started' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-niro-blue h-2 rounded-full transition-all duration-300"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {module.prerequisites && module.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Prerequisites:</p>
                      <div className="text-xs text-gray-600">
                        {module.prerequisites.join(', ')}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {module.status === 'not_started' && (
                      <button
                        onClick={() => startModule(module.id)}
                        className="btn-primary flex-1"
                      >
                        Start Module
                      </button>
                    )}
                    
                    {module.status === 'in_progress' && (
                      <button
                        onClick={() => continueModule(module.id)}
                        className="btn-primary flex-1"
                      >
                        Continue
                      </button>
                    )}
                    
                    {module.status === 'completed' && (
                      <button
                        onClick={() => continueModule(module.id)}
                        className="btn-secondary flex-1"
                      >
                        Review
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedModule(module)}
                      className="btn-secondary"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Learning Journey */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Your Learning Journey</h3>
              <div className="space-y-4">
                {trainingModules.map((module, index) => (
                  <div key={module.id} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      module.status === 'completed' ? 'bg-green-500 text-white' :
                      module.status === 'in_progress' ? 'bg-blue-500 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {module.status === 'completed' ? <CheckCircle className="h-4 w-4" /> :
                       module.status === 'in_progress' ? <Clock className="h-4 w-4" /> :
                       <span className="text-xs">{index + 1}</span>}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{module.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{module.duration}</span>
                        <span>{module.progress}% complete</span>
                      </div>
                    </div>
                    
                    <div className="w-24">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            module.status === 'completed' ? 'bg-green-500' :
                            module.status === 'in_progress' ? 'bg-blue-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Analytics */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <h4 className="font-semibold mb-2">Study Time</h4>
                <div className="text-3xl font-bold text-blue-600">12.5h</div>
                <p className="text-sm text-gray-600">Total learning time</p>
              </div>
              
              <div className="card">
                <h4 className="font-semibold mb-2">Average Score</h4>
                <div className="text-3xl font-bold text-green-600">92%</div>
                <p className="text-sm text-gray-600">On completed assessments</p>
              </div>
              
              <div className="card">
                <h4 className="font-semibold mb-2">Learning Streak</h4>
                <div className="text-3xl font-bold text-purple-600">7 days</div>
                <p className="text-sm text-gray-600">Consecutive learning</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="space-y-6">
            {/* Earned Certificates */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Earned Certificates</h3>
              {certificates.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No certificates earned yet.</p>
                  <p className="text-sm text-gray-400">Complete training modules to earn certificates.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {certificates.map((certificate) => (
                    <div key={certificate.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-yellow-100">
                      <div className="flex items-center mb-3">
                        <Award className="h-6 w-6 text-yellow-600 mr-2" />
                        <h4 className="font-semibold text-yellow-900">{certificate.title}</h4>
                      </div>
                      
                      <div className="text-sm text-yellow-800 space-y-1">
                        <p>Completion Date: {certificate.completionDate}</p>
                        <p>Score: {certificate.score}%</p>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <button className="btn-primary text-xs">View Certificate</button>
                        <button className="btn-secondary text-xs">Download PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Certifications */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Available Certifications</h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Community Health Surveillance Specialist',
                    requirements: ['Complete Disease Surveillance module', 'Pass assessment with 80%+'],
                    modules: 2
                  },
                  {
                    title: 'Digital Health Tools Expert',
                    requirements: ['Complete Digital Tools module', 'Complete practical assessment'],
                    modules: 1
                  },
                  {
                    title: 'Emergency Response Coordinator',
                    requirements: ['Complete all response modules', 'Pass scenario-based assessment'],
                    modules: 3
                  }
                ].map((cert, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{cert.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">Requires {cert.modules} module(s)</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {cert.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-6">
            {/* Support Resources */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <HelpCircle className="h-5 w-5 text-blue-500 mr-2" />
                  Help & Support
                </h3>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded">
                    <h4 className="font-semibold text-sm">Training Helpline</h4>
                    <p className="text-xs text-gray-600 mb-2">24/7 support for training-related queries</p>
                    <p className="text-sm font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      1800-XXX-TRAIN
                    </p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded">
                    <h4 className="font-semibold text-sm">Email Support</h4>
                    <p className="text-xs text-gray-600 mb-2">Get help via email</p>
                    <p className="text-sm font-medium">training@niroguard.gov.in</p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded">
                    <h4 className="font-semibold text-sm">FAQ & Guides</h4>
                    <p className="text-xs text-gray-600 mb-2">Self-help resources</p>
                    <button className="btn-secondary text-xs">Browse FAQ</button>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="h-5 w-5 text-green-500 mr-2" />
                  Peer Community
                </h3>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded">
                    <h4 className="font-semibold text-sm">Discussion Forums</h4>
                    <p className="text-xs text-gray-600 mb-2">Connect with other ASHA workers</p>
                    <button className="btn-secondary text-xs">Join Discussion</button>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded">
                    <h4 className="font-semibold text-sm">Study Groups</h4>
                    <p className="text-xs text-gray-600 mb-2">Collaborative learning sessions</p>
                    <button className="btn-secondary text-xs">Find Groups</button>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded">
                    <h4 className="font-semibold text-sm">Mentorship Program</h4>
                    <p className="text-xs text-gray-600 mb-2">Get guidance from experienced workers</p>
                    <button className="btn-secondary text-xs">Request Mentor</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Training Calendar */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                Upcoming Training Events
              </h3>
              <div className="space-y-3">
                {[
                  {
                    title: 'Live Webinar: Advanced Case Management',
                    date: 'September 25, 2024',
                    time: '2:00 PM - 3:30 PM',
                    type: 'Webinar'
                  },
                  {
                    title: 'Regional Training Workshop',
                    date: 'October 2, 2024',
                    time: '9:00 AM - 5:00 PM',
                    type: 'Workshop'
                  },
                  {
                    title: 'Q&A Session with Health Experts',
                    date: 'October 8, 2024',
                    time: '11:00 AM - 12:00 PM',
                    type: 'Q&A Session'
                  }
                ].map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-600">{event.date} | {event.time}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mt-1">
                        {event.type}
                      </span>
                    </div>
                    <button className="btn-primary text-xs">Register</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Module Details Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{selectedModule.title}</h3>
              <button
                onClick={() => setSelectedModule(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">{selectedModule.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <p className="text-sm"><strong>Duration:</strong> {selectedModule.duration}</p>
                <p className="text-sm"><strong>Difficulty:</strong> {selectedModule.difficulty}</p>
                <p className="text-sm"><strong>Rating:</strong> {selectedModule.rating}/5</p>
                <p className="text-sm"><strong>Enrollments:</strong> {selectedModule.enrollments}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Progress:</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-niro-blue h-3 rounded-full"
                    style={{ width: `${selectedModule.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">{selectedModule.progress}% complete</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Learning Outcomes</h4>
              <ul className="space-y-1">
                {selectedModule.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedModule(null)}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (selectedModule.status === 'not_started') {
                    startModule(selectedModule.id);
                  } else {
                    continueModule(selectedModule.id);
                  }
                  setSelectedModule(null);
                }}
                className="btn-primary"
              >
                {selectedModule.status === 'not_started' ? 'Start Module' : 
                 selectedModule.status === 'completed' ? 'Review' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPortal;