import React from 'react';
import { 
  Bell, 
  Send, 
  MessageSquare, 
  Phone, 
  Settings,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Volume2,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  Upload,
  Target,
  Zap,
  Globe
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'community' | 'asha' | 'admin';
  language: string;
}

interface NotificationSystemProps {
  user: User;
  language: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'health_alert' | 'water_quality' | 'outbreak' | 'education' | 'emergency';
  title: string;
  message: string;
  channels: ('push' | 'sms' | 'ivr' | 'email')[];
  audience: 'all' | 'region' | 'role' | 'custom';
  priority: 'low' | 'medium' | 'high' | 'critical';
  language: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
}

interface NotificationCampaign {
  id: string;
  name: string;
  templateId: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  targetAudience: {
    type: 'all' | 'region' | 'role' | 'custom';
    regions?: string[];
    roles?: string[];
    customFilters?: any;
  };
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  delivered: number;
  failed: number;
  opened: number;
  clicked: number;
  channels: string[];
}

interface NotificationStats {
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  failureRate: number;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ user, language }) => {
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'templates' | 'campaigns' | 'settings'>('dashboard');
  const [selectedTemplate, setSelectedTemplate] = React.useState<NotificationTemplate | null>(null);
  const [selectedCampaign, setSelectedCampaign] = React.useState<NotificationCampaign | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [modalType, setModalType] = React.useState<'template' | 'campaign'>('template');

  // Mock data
  const [templates, setTemplates] = React.useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Cholera Alert - High Priority',
      type: 'health_alert',
      title: 'Cholera Cases Detected in Your Area',
      message: 'Cholera cases have been reported in your vicinity. Please take immediate precautions: drink only boiled water, wash hands frequently, and seek medical attention if you experience symptoms.',
      channels: ['push', 'sms', 'ivr'],
      audience: 'region',
      priority: 'critical',
      language: 'en',
      isActive: true,
      createdAt: '2024-09-10',
      lastUsed: '2024-09-18'
    },
    {
      id: '2',
      name: 'Water Quality Warning',
      type: 'water_quality',
      title: 'Water Contamination Alert',
      message: 'Water contamination detected at local source. Use alternative water supply and avoid contact with contaminated water. Health department is taking immediate action.',
      channels: ['push', 'sms'],
      audience: 'region',
      priority: 'high',
      language: 'en',
      isActive: true,
      createdAt: '2024-09-08',
      lastUsed: '2024-09-15'
    },
    {
      id: '3',
      name: 'Health Education Reminder',
      type: 'education',
      title: 'Daily Health Tip',
      message: 'Remember to wash your hands with soap for at least 20 seconds before eating and after using the toilet. Clean hands save lives!',
      channels: ['push'],
      audience: 'all',
      priority: 'low',
      language: 'en',
      isActive: true,
      createdAt: '2024-09-05'
    },
    {
      id: '4',
      name: 'Emergency Contact Update',
      type: 'emergency',
      title: 'Updated Emergency Contacts',
      message: 'Emergency contact numbers have been updated. New helpline: 1800-XXX-HEALTH. Save this number for health emergencies.',
      channels: ['push', 'sms', 'ivr'],
      audience: 'all',
      priority: 'medium',
      language: 'en',
      isActive: true,
      createdAt: '2024-09-01'
    }
  ]);

  const [campaigns, setCampaigns] = React.useState<NotificationCampaign[]>([
    {
      id: '1',
      name: 'Cholera Prevention Campaign - September',
      templateId: '1',
      status: 'completed',
      targetAudience: {
        type: 'region',
        regions: ['Guwahati', 'Dibrugarh', 'Silchar']
      },
      sentAt: '2024-09-18T10:30:00Z',
      recipients: 2547,
      delivered: 2489,
      failed: 58,
      opened: 1834,
      clicked: 892,
      channels: ['push', 'sms', 'ivr']
    },
    {
      id: '2',
      name: 'Water Quality Alert - Jorhat District',
      templateId: '2',
      status: 'sending',
      targetAudience: {
        type: 'region',
        regions: ['Jorhat']
      },
      recipients: 1234,
      delivered: 867,
      failed: 12,
      opened: 456,
      clicked: 178,
      channels: ['push', 'sms']
    },
    {
      id: '3',
      name: 'Weekly Health Tips',
      templateId: '3',
      status: 'scheduled',
      targetAudience: {
        type: 'all'
      },
      scheduledAt: '2024-09-25T09:00:00Z',
      recipients: 15678,
      delivered: 0,
      failed: 0,
      opened: 0,
      clicked: 0,
      channels: ['push']
    }
  ]);

  const stats: NotificationStats = {
    totalSent: 45231,
    deliveryRate: 96.8,
    openRate: 73.2,
    clickRate: 34.7,
    failureRate: 3.2
  };

  const regions = [
    'Assam', 'Meghalaya', 'Tripura', 'Manipur', 
    'Nagaland', 'Mizoram', 'Arunachal Pradesh', 'Sikkim'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'as', name: 'Assamese' },
    { code: 'bn', name: 'Bengali' },
    { code: 'hi', name: 'Hindi' },
    { code: 'kha', name: 'Khasi' },
    { code: 'garo', name: 'Garo' },
    { code: 'mizo', name: 'Mizo' },
    { code: 'manipuri', name: 'Manipuri' }
  ];

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800',
    sending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };

  const channelIcons = {
    push: Bell,
    sms: MessageSquare,
    ivr: Phone,
    email: Send
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const calculateRate = (part: number, total: number) => {
    return total > 0 ? ((part / total) * 100).toFixed(1) : '0.0';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'failed': return XCircle;
      case 'sending': return Clock;
      case 'scheduled': return Clock;
      default: return AlertTriangle;
    }
  };

  const createNewTemplate = () => {
    setModalType('template');
    setSelectedTemplate(null);
    setShowCreateModal(true);
  };

  const createNewCampaign = () => {
    setModalType('campaign');
    setSelectedCampaign(null);
    setShowCreateModal(true);
  };

  const sendTestNotification = (template: NotificationTemplate) => {
    alert(`Test notification sent using template: ${template.name}`);
  };

  const duplicateTemplate = (template: NotificationTemplate) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: undefined
    };
    setTemplates([newTemplate, ...templates]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notification System
              </h1>
              <p className="text-gray-600">
                Manage health alerts, SMS campaigns, and IVR communications
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={createNewTemplate}
                className="btn-secondary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Template</span>
              </button>
              
              <button 
                onClick={createNewCampaign}
                className="btn-primary flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Target },
              { id: 'templates', label: 'Templates', icon: Edit },
              { id: 'campaigns', label: 'Campaigns', icon: Send },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="card">
                <div className="flex items-center">
                  <Send className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Sent</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalSent)}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.deliveryRate}%</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <Volume2 className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Open Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.openRate}%</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Click Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.clickRate}%</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <XCircle className="h-8 w-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Failure Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.failureRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Campaigns */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Campaigns</h3>
                <button className="btn-secondary text-sm">View All</button>
              </div>
              
              <div className="space-y-4">
                {campaigns.slice(0, 3).map((campaign) => {
                  const StatusIcon = getStatusIcon(campaign.status);
                  return (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <StatusIcon className={`h-5 w-5 ${
                          campaign.status === 'completed' ? 'text-green-500' :
                          campaign.status === 'failed' ? 'text-red-500' :
                          campaign.status === 'sending' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{formatNumber(campaign.recipients)} recipients</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[campaign.status]}`}>
                              {campaign.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {campaign.channels.map((channel) => {
                          const ChannelIcon = channelIcons[channel as keyof typeof channelIcons];
                          return (
                            <ChannelIcon key={channel} className="h-4 w-4 text-gray-400" />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                  <h3 className="font-semibold">Emergency Alert</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Send immediate health emergency notifications</p>
                <button className="btn-primary w-full">Send Emergency Alert</button>
              </div>

              <div className="card">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="font-semibold">Bulk SMS</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Send SMS to specific regions or groups</p>
                <button className="btn-secondary w-full">Create SMS Campaign</button>
              </div>

              <div className="card">
                <div className="flex items-center mb-4">
                  <Phone className="h-6 w-6 text-green-500 mr-2" />
                  <h3 className="font-semibold">IVR Campaign</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Schedule voice calls for health updates</p>
                <button className="btn-secondary w-full">Setup IVR</button>
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select className="border-gray-300 rounded-md text-sm">
                    <option>All Types</option>
                    <option>Health Alert</option>
                    <option>Water Quality</option>
                    <option>Education</option>
                    <option>Emergency</option>
                  </select>
                  <select className="border-gray-300 rounded-md text-sm">
                    <option>All Languages</option>
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Import</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${priorityColors[template.priority]}`}>
                          {template.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{template.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-3">{template.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {template.channels.map((channel) => {
                        const ChannelIcon = channelIcons[channel as keyof typeof channelIcons];
                        return (
                          <div key={channel} className="flex items-center space-x-1 text-xs text-gray-600">
                            <ChannelIcon className="h-3 w-3" />
                            <span>{channel.toUpperCase()}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Created: {template.createdAt}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`h-2 w-2 rounded-full ${template.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-xs text-gray-600">
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => sendTestNotification(template)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        Test
                      </button>
                      <button
                        onClick={() => duplicateTemplate(template)}
                        className="text-green-600 hover:text-green-800 text-xs"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="text-gray-600 hover:text-gray-800 text-xs"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-xs">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {/* Campaigns List */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Notification Campaigns</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipients
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opened
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              {campaign.channels.map((channel) => {
                                const ChannelIcon = channelIcons[channel as keyof typeof channelIcons];
                                return <ChannelIcon key={channel} className="h-3 w-3" />;
                              })}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[campaign.status]}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(campaign.recipients)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(campaign.delivered)} ({calculateRate(campaign.delivered, campaign.recipients)}%)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(campaign.opened)} ({calculateRate(campaign.opened, campaign.delivered)}%)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedCampaign(campaign)}
                            className="text-niro-blue hover:text-niro-blue/80 mr-4"
                          >
                            View
                          </button>
                          {campaign.status === 'draft' && (
                            <button className="text-green-600 hover:text-green-900">
                              Send
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Notification Channels */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-600">App-based notifications</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-green-600 mr-2">Active</span>
                      <div className="w-10 h-6 bg-green-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">SMS Gateway</h4>
                        <p className="text-sm text-gray-600">Text message alerts</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-green-600 mr-2">Active</span>
                      <div className="w-10 h-6 bg-green-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="font-medium">IVR System</h4>
                        <p className="text-sm text-gray-600">Voice call alerts</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-green-600 mr-2">Active</span>
                      <div className="w-10 h-6 bg-green-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Send className="h-5 w-5 text-orange-500" />
                      <div>
                        <h4 className="font-medium">Email Alerts</h4>
                        <p className="text-sm text-gray-600">Email notifications</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Inactive</span>
                      <div className="w-10 h-6 bg-gray-300 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Language Configuration</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Supported Languages</h4>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <div key={lang.code} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{lang.name}</span>
                        </div>
                        <span className="text-xs text-green-600">Enabled</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Default Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Language
                      </label>
                      <select className="w-full border-gray-300 rounded-md">
                        <option>English</option>
                        <option>Assamese</option>
                        <option>Bengali</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Auto-translate
                      </label>
                      <div className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="ml-2 text-sm text-gray-600">Enable automatic translation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Settings */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Emergency Alert Configuration</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Recipients per Minute
                    </label>
                    <input
                      type="number"
                      defaultValue="1000"
                      className="w-full border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Retry Attempts
                    </label>
                    <input
                      type="number"
                      defaultValue="3"
                      className="w-full border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority Queue Size
                    </label>
                    <input
                      type="number"
                      defaultValue="5000"
                      className="w-full border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="ml-2 text-sm text-gray-600">Enable emergency override</span>
                  </div>
                  
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="ml-2 text-sm text-gray-600">Auto-escalate critical alerts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {modalType === 'template' ? 'Create Notification Template' : 'Create Campaign'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-md"
                  placeholder={modalType === 'template' ? 'Template name' : 'Campaign name'}
                />
              </div>
              
              {modalType === 'template' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select className="w-full border-gray-300 rounded-md">
                        <option>Health Alert</option>
                        <option>Water Quality</option>
                        <option>Education</option>
                        <option>Emergency</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select className="w-full border-gray-300 rounded-md">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-md"
                      placeholder="Notification title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      className="w-full border-gray-300 rounded-md"
                      placeholder="Notification message content"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
                    <div className="flex space-x-4">
                      {['Push', 'SMS', 'IVR', 'Email'].map((channel) => (
                        <div key={channel} className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span className="ml-2 text-sm text-gray-600">{channel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {modalType === 'campaign' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                    <select className="w-full border-gray-300 rounded-md">
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                    <select className="w-full border-gray-300 rounded-md">
                      <option>All Users</option>
                      <option>By Region</option>
                      <option>By Role</option>
                      <option>Custom Filter</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="date"
                        className="w-full border-gray-300 rounded-md"
                      />
                      <input
                        type="time"
                        className="w-full border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button className="btn-primary">
                {modalType === 'template' ? 'Create Template' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;