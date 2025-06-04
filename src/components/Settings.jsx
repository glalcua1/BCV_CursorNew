import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STORAGE_KEY = 'app_settings';
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
];

const TIMEZONES = [
  'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
  'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
  'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
  'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00',
  'UTC+12:00'
];

function Settings() {
  const [competitors, setCompetitors] = useState([]);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: false,
    push: false
  });
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC+00:00');
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDarkMode(settings.darkMode);
      setNotifications(settings.notifications);
      setLanguage(settings.language);
      setTimezone(settings.timezone);
      setCompetitors(settings.competitors || []);
      
      // Apply dark mode if it was saved
      if (settings.darkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Save settings helper
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settings = {
        darkMode,
        notifications,
        language,
        timezone,
        competitors
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCompetitor = (e) => {
    e.preventDefault();
    if (newCompetitor.trim()) {
      setCompetitors([...competitors, {
        id: Date.now(),
        name: newCompetitor.trim(),
        socialChannels: {
          instagram: { active: false, handle: '' },
          facebook: { active: false, handle: '' },
          twitter: { active: false, handle: '' },
          linkedin: { active: false, handle: '' }
        }
      }]);
      setNewCompetitor('');
    }
  };

  const handleRemoveCompetitor = (id) => {
    setCompetitors(competitors.filter(competitor => competitor.id !== id));
    if (selectedCompetitor?.id === id) {
      setSelectedCompetitor(null);
    }
  };

  const handleSocialChannelUpdate = (competitorId, channel, updates) => {
    if (updates.handle && !validateSocialHandle(updates.handle, channel)) {
      toast.error(`Invalid ${channel} handle format`);
      return;
    }
    
    setCompetitors(competitors.map(competitor => {
      if (competitor.id === competitorId) {
        return {
          ...competitor,
          socialChannels: {
            ...competitor.socialChannels,
            [channel]: {
              ...competitor.socialChannels[channel],
              ...updates
            }
          }
        };
      }
      return competitor;
    }));
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const validateSocialHandle = (handle, platform) => {
    const patterns = {
      instagram: /^@?[\w.](?!.*?\.{2})[\w.]{1,28}[\w]$/,
      twitter: /^@?[A-Za-z0-9_]{1,15}$/,
      facebook: /^[a-zA-Z0-9.]{5,}$/,
      linkedin: /^[\w\-]{3,100}$/
    };
    return patterns[platform].test(handle);
  };

  const filteredCompetitors = competitors.filter(competitor =>
    competitor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${darkMode ? 'dark:bg-gray-800 dark:text-white' : 'bg-white'} shadow rounded-lg p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className={`px-4 py-2 rounded-md text-white ${
            isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
          
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Dark Mode</label>
              <p className="text-sm text-gray-500">Enable dark mode for the dashboard</p>
            </div>
            <button 
              onClick={handleDarkModeToggle}
              className={`${
                darkMode ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span 
                className={`${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                } inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out`}
              ></span>
            </button>
          </div>

          {/* Language Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hotel Competitors</h3>
          
          {/* Add Hotel Form */}
          <form onSubmit={handleAddCompetitor} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                placeholder="Enter hotel name"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Hotel
              </button>
            </div>
          </form>

          {/* Search Hotels */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hotels..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Hotels List */}
          <div className="space-y-2">
            {filteredCompetitors.map(competitor => (
              <div key={competitor.id} className="space-y-2">
                <div 
                  className={`flex items-center justify-between bg-gray-50 p-3 rounded-md cursor-pointer ${
                    selectedCompetitor?.id === competitor.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCompetitor(competitor)}
                >
                  <span className="text-gray-900">{competitor.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCompetitor(competitor.id);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                {/* Social Channels Panel */}
                {selectedCompetitor?.id === competitor.id && (
                  <div className="ml-4 p-4 bg-gray-100 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Social Channels</h4>
                    <div className="space-y-3">
                      {Object.entries(competitor.socialChannels).map(([channel, data]) => (
                        <div key={channel} className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={data.active}
                              onChange={(e) => handleSocialChannelUpdate(competitor.id, channel, { active: e.target.checked })}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 capitalize text-sm text-gray-900">{channel}</label>
                          </div>
                          {data.active && (
                            <input
                              type="text"
                              value={data.handle}
                              onChange={(e) => handleSocialChannelUpdate(competitor.id, channel, { handle: e.target.value })}
                              placeholder={`Enter ${channel} handle`}
                              className="flex-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filteredCompetitors.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                {searchTerm ? 'No hotels found matching your search' : 'No hotels added yet'}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input 
                id="email-notifications" 
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input 
                id="push-notifications" 
                type="checkbox"
                checked={notifications.push}
                onChange={() => handleNotificationChange('push')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <label htmlFor="push-notifications" className="ml-2 block text-sm text-gray-900">
                Push Notifications
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Settings; 