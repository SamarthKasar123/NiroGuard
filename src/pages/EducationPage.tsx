import React from 'react';
import { 
  BookOpen, 
  Play, 
  Download, 
  Heart, 
  Droplets, 
  Shield, 
  Users,
  AlertTriangle,
  CheckCircle,
  Volume2,
  FileText,
  Image,
  Globe,
  Star,
  Clock,
  Eye
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'community' | 'asha' | 'admin';
  language: string;
}

interface EducationPageProps {
  user: User;
  language: string;
}

interface EducationalContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'poster' | 'audio' | 'document' | 'interactive';
  category: 'water_safety' | 'hygiene' | 'symptoms' | 'prevention' | 'emergency';
  language: string;
  duration?: string;
  rating: number;
  views: number;
  thumbnail?: string;
}

const EducationPage: React.FC<EducationPageProps> = ({ user, language }) => {
  const [activeCategory, setActiveCategory] = React.useState<string>('all');
  const [activeType, setActiveType] = React.useState<string>('all');

  // Mock educational content
  const [educationalContent, setEducationalContent] = React.useState<EducationalContent[]>([
    {
      id: '1',
      title: 'Safe Water Boiling Techniques',
      description: 'Learn the proper methods to boil water for safe drinking and prevent water-borne diseases.',
      type: 'video',
      category: 'water_safety',
      language: 'english',
      duration: '5 min',
      rating: 4.8,
      views: 1250
    },
    {
      id: '2',
      title: 'Hand Washing Steps Poster',
      description: 'Visual guide showing the 7 steps of proper hand washing technique.',
      type: 'poster',
      category: 'hygiene',
      language: 'assamese',
      rating: 4.9,
      views: 890
    },
    {
      id: '3',
      title: 'Recognizing Diarrhea Symptoms',
      description: 'Audio guide in local language explaining early symptoms of water-borne diseases.',
      type: 'audio',
      category: 'symptoms',
      language: 'hindi',
      duration: '8 min',
      rating: 4.7,
      views: 567
    },
    {
      id: '4',
      title: 'Water Purification Methods',
      description: 'Comprehensive guide on different water purification techniques for rural areas.',
      type: 'document',
      category: 'water_safety',
      language: 'english',
      rating: 4.6,
      views: 423
    },
    {
      id: '5',
      title: 'Emergency Response Guide',
      description: 'Interactive checklist for responding to water-borne disease outbreaks.',
      type: 'interactive',
      category: 'emergency',
      language: 'bengali',
      rating: 4.9,
      views: 234
    },
    {
      id: '6',
      title: 'Food Safety During Monsoon',
      description: 'Video tutorial on maintaining food hygiene during rainy season.',
      type: 'video',
      category: 'prevention',
      language: 'manipuri',
      duration: '12 min',
      rating: 4.5,
      views: 678
    }
  ]);

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen },
    { id: 'water_safety', label: 'Water Safety', icon: Droplets },
    { id: 'hygiene', label: 'Hygiene Practices', icon: Heart },
    { id: 'symptoms', label: 'Symptom Recognition', icon: AlertTriangle },
    { id: 'prevention', label: 'Disease Prevention', icon: Shield },
    { id: 'emergency', label: 'Emergency Response', icon: Users }
  ];

  const contentTypes = [
    { id: 'all', label: 'All Types', icon: BookOpen },
    { id: 'video', label: 'Videos', icon: Play },
    { id: 'poster', label: 'Posters', icon: Image },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'document', label: 'Documents', icon: FileText }
  ];

  const filteredContent = educationalContent.filter(content => {
    const categoryMatch = activeCategory === 'all' || content.category === activeCategory;
    const typeMatch = activeType === 'all' || content.type === activeType;
    return categoryMatch && typeMatch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-5 w-5 text-red-500" />;
      case 'poster': return <Image className="h-5 w-5 text-blue-500" />;
      case 'audio': return <Volume2 className="h-5 w-5 text-green-500" />;
      case 'document': return <FileText className="h-5 w-5 text-gray-500" />;
      case 'interactive': return <BookOpen className="h-5 w-5 text-purple-500" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'water_safety': return 'bg-blue-100 text-blue-800';
      case 'hygiene': return 'bg-green-100 text-green-800';
      case 'symptoms': return 'bg-yellow-100 text-yellow-800';
      case 'prevention': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Health Education Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn about water safety, hygiene practices, and disease prevention through 
              interactive content in your local language
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{educationalContent.length}</div>
              <div className="text-sm text-gray-600">Learning Resources</div>
            </div>
            
            <div className="card text-center">
              <Globe className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Languages Available</div>
            </div>
            
            <div className="card text-center">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4.2K</div>
              <div className="text-sm text-gray-600">Community Learners</div>
            </div>
            
            <div className="card text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Essential Health Tips</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Water Safety Tips */}
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-center mb-3">
                <Droplets className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">Water Safety</h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Boil water for 1 minute before drinking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Store boiled water in clean containers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Use water purification tablets when needed</span>
                </li>
              </ul>
            </div>

            {/* Hygiene Practices */}
            <div className="card bg-green-50 border-green-200">
              <div className="flex items-center mb-3">
                <Heart className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-900">Hygiene Practices</h3>
              </div>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Wash hands for 20 seconds with soap</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Use hand sanitizer when soap unavailable</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Keep food covered and fresh</span>
                </li>
              </ul>
            </div>

            {/* Warning Signs */}
            <div className="card bg-yellow-50 border-yellow-200">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="font-semibold text-yellow-900">Warning Signs</h3>
              </div>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Severe diarrhea for 24+ hours</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>High fever with chills</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Signs of dehydration</span>
                </li>
              </ul>
            </div>

            {/* Prevention */}
            <div className="card bg-purple-50 border-purple-200">
              <div className="flex items-center mb-3">
                <Shield className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-900">Prevention</h3>
              </div>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Get vaccinated against diseases</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Maintain good nutrition</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Report symptoms early</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div className="card">
              <h3 className="font-semibold mb-3">Browse by Topic</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border text-sm transition-colors ${
                      activeCategory === category.id
                        ? 'bg-niro-blue text-white border-niro-blue'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-niro-blue'
                    }`}
                  >
                    <category.icon className="h-4 w-4" />
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="card">
              <h3 className="font-semibold mb-3">Content Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveType(type.id)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border text-sm transition-colors ${
                      activeType === type.id
                        ? 'bg-niro-blue text-white border-niro-blue'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-niro-blue'
                    }`}
                  >
                    <type.icon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Learning Materials ({filteredContent.length})
            </h2>
            <div className="flex items-center space-x-2">
              <select className="input-field max-w-xs">
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>

          {filteredContent.length === 0 ? (
            <div className="card text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No content found for the selected filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((content) => (
                <div key={content.id} className="card hover:shadow-lg transition-shadow">
                  {/* Content Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(content.type)}
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {content.type}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(content.category)}`}>
                      {content.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Content Thumbnail */}
                  <div className="bg-gray-100 rounded-lg h-32 mb-4 flex items-center justify-center">
                    <div className="text-center">
                      {getTypeIcon(content.type)}
                      <p className="text-xs text-gray-500 mt-2">Preview Available</p>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">{content.title}</h3>
                    <p className="text-sm text-gray-600">{content.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Language: {content.language}</span>
                      {content.duration && <span>Duration: {content.duration}</span>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{content.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{content.views}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="btn-primary text-xs">
                          {content.type === 'video' ? 'Watch' : 
                           content.type === 'audio' ? 'Listen' : 'View'}
                        </button>
                        <button className="btn-secondary text-xs p-1">
                          <Download className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Language Support Section */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Multilingual Support</h2>
          <p className="text-gray-600 mb-6">
            All educational content is available in multiple languages to ensure accessibility across Northeast India
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { code: 'en', name: 'English', count: 24 },
              { code: 'as', name: 'অসমীয়া (Assamese)', count: 18 },
              { code: 'bn', name: 'বাংলা (Bengali)', count: 15 },
              { code: 'hi', name: 'हिंदी (Hindi)', count: 20 },
              { code: 'kh', name: 'Khasi', count: 12 },
              { code: 'ko', name: 'Kokborok', count: 10 },
              { code: 'mn', name: 'মৈতৈলোন্ (Manipuri)', count: 14 },
              { code: 'mi', name: 'Mizo', count: 11 }
            ].map((lang) => (
              <div key={lang.code} className="p-3 border border-gray-200 rounded-lg text-center">
                <div className="font-medium text-sm">{lang.name}</div>
                <div className="text-xs text-gray-500">{lang.count} resources</div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="card bg-red-50 border-red-200">
          <h2 className="text-2xl font-bold text-red-900 mb-4">Emergency Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Health Emergency</h3>
              <p className="text-red-700 text-sm mb-2">For immediate medical attention</p>
              <p className="text-lg font-bold text-red-900">📞 108</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-800 mb-2">NiroGuard Helpline</h3>
              <p className="text-red-700 text-sm mb-2">Health monitoring support</p>
              <p className="text-lg font-bold text-red-900">📞 1800-XXX-XXXX</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Local ASHA Worker</h3>
              <p className="text-red-700 text-sm mb-2">Community health support</p>
              <p className="text-lg font-bold text-red-900">📞 +91 98765 43211</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationPage;