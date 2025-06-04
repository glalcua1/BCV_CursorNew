import React, { useState } from 'react';

enum TabType {
  NEW = 'new',
  DRAFT = 'draft',
  LIVE = 'live'
}

interface CreatePostProps {
  onSubmit: (post: {
    content: string;
    platform: string;
    mediaUrls: string[];
    scheduledTime?: Date;
    hashtags: string[];
  }) => void;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
      active
        ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    {children}
  </button>
);

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'https://cdn.simpleicons.org/instagram/white',
    color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'https://cdn.simpleicons.org/facebook/white',
    color: 'bg-blue-600'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'https://cdn.simpleicons.org/linkedin/white',
    color: 'bg-blue-700'
  }
];

const CreatePost: React.FC<CreatePostProps> = ({ onSubmit }) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.NEW);
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [suggestedTimes, setSuggestedTimes] = useState<string[]>([]);
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      content,
      platform,
      mediaUrls,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
      hashtags
    });
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newMediaUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setMediaUrls([...mediaUrls, ...newMediaUrls]);
    }
  };

  const generateContent = async () => {
    setIsGenerating(true);
    // Simulated AI content generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    const generatedContent = "🌟 Experience luxury redefined at our boutique hotel!\n\nIndulge in breathtaking views, world-class amenities, and personalized service that exceeds expectations. Our newly renovated suites offer the perfect blend of modern comfort and timeless elegance.\n\nBook your stay today and create unforgettable memories! 🏨✨";
    const suggestedHashtags = ['#LuxuryHotel', '#BoutiqueHotel', '#TravelInStyle', '#HotelLife', '#LuxuryTravel'];
    setContent(generatedContent);
    setHashtags(suggestedHashtags);
    setIsGenerating(false);
  };

  const suggestPostingTimes = () => {
    // In a real app, this would be based on analytics data
    setSuggestedTimes([
      '10:00 AM - Best time for engagement',
      '6:00 PM - Peak user activity',
      '8:00 PM - Highest reach potential'
    ]);
  };

  // Preview component for different platforms
  const PostPreview = () => {
    const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.id === platform);
    if (!selectedPlatform) return null;

    const previewContent = content.split('\n').map((line, i) => (
      <p key={i} className={i === 0 ? 'mb-4' : 'mb-2'}>{line}</p>
    ));

    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Platform Header */}
        <div className={`${selectedPlatform.color} p-4 flex items-center space-x-3`}>
          <img src={selectedPlatform.icon} alt={selectedPlatform.name} className="w-6 h-6" />
          <span className="text-white font-medium">{selectedPlatform.name} Preview</span>
        </div>

        {/* Post Content */}
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-medium">H</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Hyatt, London</h4>
              <span className="text-sm text-gray-500">
                {scheduledTime ? new Date(scheduledTime).toLocaleString() : 'Now'}
              </span>
            </div>
          </div>

          {/* Media Preview */}
          {mediaUrls.length > 0 && (
            <div className={`mb-4 grid ${mediaUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
              {mediaUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Content */}
          <div className="space-y-2 mb-4">
            {previewContent}
          </div>

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="text-blue-600 hover:underline cursor-pointer text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Engagement Preview */}
          <div className="flex items-center space-x-6 mt-6 pt-4 border-t">
            <button className="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">Like</span>
            </button>
            <button className="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm">Comment</span>
            </button>
            <button className="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex space-x-4">
          <TabButton
            active={activeTab === TabType.NEW}
            onClick={() => setActiveTab(TabType.NEW)}
          >
            New Post
          </TabButton>
          <TabButton
            active={activeTab === TabType.DRAFT}
            onClick={() => setActiveTab(TabType.DRAFT)}
          >
            Draft Posts
          </TabButton>
          <TabButton
            active={activeTab === TabType.LIVE}
            onClick={() => setActiveTab(TabType.LIVE)}
          >
            Live Posts
          </TabButton>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === TabType.NEW && (
        <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Create New Post</h2>
              <p className="text-gray-600 mt-2">Share your content across social platforms</p>
            </div>
            <button
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
          </div>

          {/* Upcoming Events in London */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events in London</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                <div className="text-purple-600 font-semibold mb-2">London Tech Week</div>
                <p className="text-gray-600 text-sm mb-2">June 10-14, 2024</p>
                <p className="text-gray-500 text-sm">Europe's largest technology festival at Queen Elizabeth II Centre</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                <div className="text-purple-600 font-semibold mb-2">Royal Chelsea Flower Show</div>
                <p className="text-gray-600 text-sm mb-2">May 21-25, 2024</p>
                <p className="text-gray-500 text-sm">World's most prestigious flower show at Royal Hospital Chelsea</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                <div className="text-purple-600 font-semibold mb-2">Wimbledon Championships</div>
                <p className="text-gray-600 text-sm mb-2">July 1-14, 2024</p>
                <p className="text-gray-500 text-sm">The world's oldest tennis tournament at All England Club</p>
              </div>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Platform</h3>
            <div className="grid grid-cols-3 gap-3">
              {SOCIAL_PLATFORMS.map((socialPlatform) => (
                <button
                  key={socialPlatform.id}
                  onClick={() => setPlatform(socialPlatform.id)}
                  className={`relative rounded-lg p-2.5 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                    platform === socialPlatform.id
                      ? `${socialPlatform.color} text-white ring-2 ring-offset-2 ring-${socialPlatform.color}`
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    platform === socialPlatform.id ? 'bg-white/20' : 'bg-white'
                  }`}>
                    <img src={socialPlatform.icon} alt={socialPlatform.name} className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{socialPlatform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {platform && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* AI Content Generation */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">AI Content Assistant</h3>
                    <div className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs font-medium">Beta</div>
                  </div>
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isAIEnabled}
                        onChange={(e) => setIsAIEnabled(e.target.checked)}
                      />
                      <div className={`w-14 h-7 rounded-full transition-colors duration-300 ease-in-out ${
                        isAIEnabled ? 'bg-gradient-to-r from-purple-600 to-blue-500' : 'bg-gray-200'
                      } group-hover:${isAIEnabled ? 'opacity-90' : 'bg-gray-300'}`}>
                        <div className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
                          isAIEnabled ? 'translate-x-7' : 'translate-x-0'
                        }`}>
                          {isAIEnabled ? (
                            <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.5 10a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM10 2a.75.75 0 0 1 .75.75v1.502a7.027 7.027 0 0 1 4.97 4.97h1.502a.75.75 0 0 1 0 1.5h-1.502a7.027 7.027 0 0 1-4.97 4.97v1.502a.75.75 0 0 1-1.5 0v-1.502a7.027 7.027 0 0 1-4.97-4.97H3.778a.75.75 0 0 1 0-1.5h1.502a7.027 7.027 0 0 1 4.97-4.97V2.75A.75.75 0 0 1 10 2ZM8.5 10a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v13A1.5 1.5 0 0 0 3.5 18h13a1.5 1.5 0 0 0 1.5-1.5V9.412c0-.399-.158-.781-.44-1.063l-3.91-3.91a1.5 1.5 0 0 0-1.061-.439H3.5ZM3.5 3h7.086c.133 0 .26.053.354.146l3.91 3.91c.093.093.146.22.146.353V16.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5Z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`ml-3 text-sm font-medium transition-colors duration-200 ${isAIEnabled ? 'text-purple-600' : 'text-gray-500'}`}>
                      {isAIEnabled ? 'AI Enabled' : 'Enable AI'}
                    </span>
                  </label>
                </div>
                {isAIEnabled && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe what you want to post about..."
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={generateContent}
                      disabled={isGenerating || !prompt}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </div>
                      ) : 'Generate Content'}
                    </button>
                  </div>
                )}
              </div>

              {/* Content Editor */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Write your post content here..."
                />
              </div>

              {/* Hashtags */}
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Media Upload */}
              <div>
                <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
                  Media
                </label>
                <input
                  type="file"
                  id="media"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <label
                  htmlFor="media"
                  className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <svg
                      className="w-8 h-8 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors">
                    Add photos or videos
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    Drag and drop or click to upload
                  </span>
                </label>
                {mediaUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {mediaUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setMediaUrls(mediaUrls.filter((_, i) => i !== index))}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scheduling */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">
                    Schedule Post
                  </label>
                  <button
                    type="button"
                    onClick={suggestPostingTimes}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Suggest best times
                  </button>
                </div>
                {suggestedTimes.length > 0 && (
                  <div className="mb-4 space-y-2 bg-gray-50 rounded-lg p-4">
                    {suggestedTimes.map((time, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {time}
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="datetime-local"
                  id="scheduledTime"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  {scheduledTime ? 'Schedule Post' : 'Post Now'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Draft Posts Tab */}
      {activeTab === TabType.DRAFT && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Draft Posts</h2>
              <p className="text-gray-600 mt-2">Continue working on your saved drafts</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Example draft posts - In a real app, these would come from your backend */}
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Summer Collection Launch</h3>
                  <p className="text-gray-600 mt-2 line-clamp-2">Get ready for our exciting summer collection! We're bringing fresh styles and vibrant colors...</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <span className="text-sm text-gray-500">Platform: Instagram</span>
                    <span className="text-sm text-gray-500">Last edited: 2 days ago</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Customer Appreciation Day</h3>
                  <p className="text-gray-600 mt-2 line-clamp-2">Join us for an exclusive Customer Appreciation Day! Special discounts and surprises await...</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <span className="text-sm text-gray-500">Platform: Facebook</span>
                    <span className="text-sm text-gray-500">Last edited: 5 days ago</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Posts Tab */}
      {activeTab === TabType.LIVE && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Live Posts</h2>
              <p className="text-gray-600 mt-2">Monitor and manage your published posts</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Example live posts - In a real app, these would come from your backend */}
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Spring Collection Highlights</h3>
                  <p className="text-gray-600 mt-2 line-clamp-2">Discover our top picks from the Spring Collection! From elegant dresses to casual wear...</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <span className="text-sm text-gray-500">Platform: Instagram</span>
                    <span className="text-sm text-gray-500">Posted: 3 days ago</span>
                    <div className="flex items-center space-x-2 text-green-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">Published</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-4 space-x-6">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600">2.5k Likes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600">128 Comments</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Weekend Special Offer</h3>
                  <p className="text-gray-600 mt-2 line-clamp-2">Don't miss out on our weekend special! Get 30% off on all accessories...</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <span className="text-sm text-gray-500">Platform: Facebook</span>
                    <span className="text-sm text-gray-500">Posted: 1 week ago</span>
                    <div className="flex items-center space-x-2 text-green-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">Published</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-4 space-x-6">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600">1.8k Likes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600">95 Comments</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Post Preview</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <PostPreview />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost; 