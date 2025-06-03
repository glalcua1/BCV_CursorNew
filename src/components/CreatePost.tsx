import React, { useState } from 'react';

interface CreatePostProps {
  onSubmit: (post: {
    content: string;
    platform: string;
    mediaUrls: string[];
    scheduledTime?: Date;
    hashtags: string[];
  }) => void;
}

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
    id: 'twitter',
    name: 'Twitter',
    icon: 'https://cdn.simpleicons.org/x/white',
    color: 'bg-black'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'https://cdn.simpleicons.org/linkedin/white',
    color: 'bg-blue-700'
  }
];

const CreatePost: React.FC<CreatePostProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [suggestedTimes, setSuggestedTimes] = useState<string[]>([]);
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

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
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create New Post</h2>
            <button
              onClick={() => onSubmit({ content: '', platform: '', mediaUrls: [], hashtags: [] })}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {/* Platform Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Choose Platform</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {SOCIAL_PLATFORMS.map((socialPlatform) => (
                <button
                  key={socialPlatform.id}
                  onClick={() => {
                    setPlatform(socialPlatform.id);
                    setShowPreview(true);
                  }}
                  className={`relative rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                    platform === socialPlatform.id
                      ? `${socialPlatform.color} text-white ring-2 ring-offset-2 ring-${socialPlatform.color}`
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <img src={socialPlatform.icon} alt={socialPlatform.name} className="w-8 h-8" />
                  <span className="text-sm font-medium">{socialPlatform.name}</span>
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
                    <h3 className="text-lg font-semibold text-gray-700">AI Content Assistant</h3>
                    <div className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded text-xs font-medium">Beta</div>
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
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={generateContent}
                      disabled={isGenerating || !prompt}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Content'}
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
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Write your post content here..."
                />
              </div>

              {/* Hashtags */}
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
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
                  className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                >
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
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
                  <span className="mt-2 block text-sm font-medium text-gray-600">
                    Add photos or videos
                  </span>
                </label>
                {mediaUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {mediaUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setMediaUrls(mediaUrls.filter((_, i) => i !== index))}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Suggest best times
                  </button>
                </div>
                {suggestedTimes.length > 0 && (
                  <div className="mb-4 space-y-2">
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
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  {scheduledTime ? 'Schedule Post' : 'Post Now'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-6 h-fit space-y-6 self-start">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Post Preview</h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
          {showPreview && platform && <PostPreview />}
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 