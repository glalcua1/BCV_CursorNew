import { useState, useEffect } from 'react'
import './App.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import CreatePost from './components/CreatePost';
import Calendar from './components/Calendar';
import Settings from './components/Settings';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Chat {
  user: string;
  message: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  platform: 'Instagram' | 'Twitter' | 'Facebook' | 'LinkedIn' | 'TripAdvisor';
  time: string;
}

interface KeywordChats {
  [key: string]: Chat[];
}

function App() {
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isTopPostsDrawerOpen, setIsTopPostsDrawerOpen] = useState(false);
  const [isEventsDrawerOpen, setIsEventsDrawerOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [isKeywordChatOpen, setIsKeywordChatOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Effect to handle dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // New state for social performance metrics
  const [socialMetrics] = useState({
    followers: {
      current: 70000,
      previous: 65000,
      target: 100000,
      weight: 0.25,
      breakdown: {
        instagram: 35000,
        facebook: 25000,
        linkedin: 10000
      }
    },
    impressions: {
      current: 620,
      previous: 580,
      target: 1000,
      weight: 0.25,
      breakdown: {
        instagram: 280,
        facebook: 220,
        linkedin: 120
      }
    },
    engagement: {
      current: 220000,
      previous: 212000,
      target: 250000,
      weight: 0.3,
      breakdown: {
        instagram: 100000,
        facebook: 80000,
        linkedin: 40000
      }
    },
    linkClicks: {
      current: 520,
      previous: 500,
      target: 600,
      weight: 0.2,
      breakdown: {
        instagram: 220,
        facebook: 180,
        linkedin: 120
      }
    }
  });

  // Add social listening keywords state
  const [socialListeningKeywords] = useState([
    { keyword: "#luxuryhotel", mentions: 1250, sentiment: 0.8 },
    { keyword: "fine dining", mentions: 850, sentiment: 0.9 },
    { keyword: "spa experience", mentions: 620, sentiment: 0.75 },
    { keyword: "room service", mentions: 450, sentiment: 0.6 },
    { keyword: "concierge", mentions: 380, sentiment: 0.85 }
  ]);

  // Mock data for top performing posts
  const topPosts = [
    {
      id: 1,
      platform: 'Instagram',
      type: 'Image',
      content: 'Sunset view from our rooftop infinity pool 🌅',
      engagement: 15200,
      likes: 12500,
      comments: 2700,
      shares: 850,
      impressions: 45000,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
      date: '2024-03-15'
    },
    {
      id: 2,
      platform: 'Facebook',
      type: 'Video',
      content: 'Behind the scenes: Our award-winning chef preparing signature dishes',
      engagement: 12800,
      likes: 10200,
      comments: 1600,
      shares: 1000,
      impressions: 38000,
      image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80',
      date: '2024-03-12'
    },
    {
      id: 3,
      platform: 'LinkedIn',
      type: 'Article',
      content: 'Experience luxury in every detail - Our commitment to exceptional hospitality',
      engagement: 11500,
      likes: 9800,
      comments: 1200,
      shares: 500,
      impressions: 35000,
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80',
      date: '2024-03-10'
    }
  ];

  // Mock upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: "London Fashion Week After Party",
      date: "2024-04-12",
      time: "8:00 PM - 2:00 AM",
      location: "The Shard, London",
      description: "Exclusive networking event featuring London's top fashion designers and industry leaders.",
      category: "Networking",
      attendees: 200,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: "London Culinary Excellence Awards",
      date: "2024-04-18",
      time: "7:00 PM - 11:00 PM",
      location: "The Dorchester, London",
      description: "Annual awards ceremony celebrating London's finest restaurants and chefs.",
      category: "Awards",
      attendees: 300,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: "London Hotel Innovation Summit",
      date: "2024-04-22",
      time: "9:00 AM - 6:00 PM",
      location: "ExCeL London",
      description: "A premier conference showcasing the latest trends and technologies in the luxury hotel industry.",
      category: "Conference",
      attendees: 500,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80"
    },
    {
      id: 4,
      title: "London Food & Wine Festival",
      date: "2024-04-15",
      time: "11:00 AM - 8:00 PM",
      location: "Hyde Park, London",
      description: "Join us for London's premier food and wine festival featuring top chefs and sommeliers.",
      category: "Food & Beverage",
      attendees: 250,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80"
    },
    {
      id: 5,
      title: "Luxury Travel Showcase",
      date: "2024-04-20",
      time: "10:00 AM - 6:00 PM",
      location: "The Savoy, London",
      description: "Exclusive showcase of luxury travel destinations and experiences.",
      category: "Travel",
      attendees: 180,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
    },
    {
      id: 6,
      title: "Hospitality Tech Summit",
      date: "2024-04-25",
      time: "9:00 AM - 5:00 PM",
      location: "ExCeL London",
      description: "Leading conference on emerging technologies in the hospitality industry.",
      category: "Technology",
      attendees: 300,
      image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&q=80"
    },
    {
      id: 7,
      title: "Sustainable Hotels Conference",
      date: "2024-05-02",
      time: "10:00 AM - 4:00 PM",
      location: "The Shard, London",
      description: "Industry leaders discuss sustainable practices in hotel management.",
      category: "Sustainability",
      attendees: 200,
      image: "https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?auto=format&fit=crop&q=80"
    },
    {
      id: 8,
      title: "Hotel Design Exhibition",
      date: "2024-05-10",
      time: "11:00 AM - 7:00 PM",
      location: "Design Museum, London",
      description: "Showcase of innovative hotel interior design and architecture.",
      category: "Design",
      attendees: 150,
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80"
    }
  ];

  // Add mock chat data for keywords
  const keywordChats: KeywordChats = {
    "#luxuryhotel": [
      { user: "Sarah J.", message: "The spa at your hotel is absolutely incredible! #luxuryhotel", sentiment: "positive", platform: "Instagram", time: "2h ago" },
      { user: "TravelBlogger", message: "Best weekend getaway! The service was impeccable #luxuryhotel", sentiment: "positive", platform: "Twitter", time: "5h ago" },
      { user: "LuxuryLife", message: "Nothing beats the view from the penthouse suite #luxuryhotel", sentiment: "positive", platform: "Instagram", time: "1d ago" }
    ],
    "fine dining": [
      { user: "FoodCritic", message: "The tasting menu was a culinary journey through excellence", sentiment: "positive", platform: "Facebook", time: "3h ago" },
      { user: "GourmetLover", message: "Chef's special tonight was outstanding! fine dining at its best", sentiment: "positive", platform: "Instagram", time: "6h ago" },
      { user: "WineEnthusiast", message: "Impressed by the wine pairing selection", sentiment: "positive", platform: "Twitter", time: "1d ago" }
    ],
    "spa experience": [
      { user: "WellnessGuru", message: "The massage treatment was heavenly! #spaday", sentiment: "positive", platform: "Instagram", time: "4h ago" },
      { user: "RelaxSeeker", message: "Perfect spa experience for a weekend retreat", sentiment: "positive", platform: "Facebook", time: "1d ago" },
      { user: "LuxurySpas", message: "One of the best spa experiences in London", sentiment: "positive", platform: "Twitter", time: "2d ago" }
    ],
    "room service": [
      { user: "BusinessTraveler", message: "24/7 room service is top-notch", sentiment: "positive", platform: "LinkedIn", time: "5h ago" },
      { user: "FoodieExplorer", message: "Late night room service menu is extensive", sentiment: "neutral", platform: "Instagram", time: "1d ago" },
      { user: "LuxuryStays", message: "Room service breakfast was perfect", sentiment: "positive", platform: "Facebook", time: "2d ago" }
    ],
    "concierge": [
      { user: "GlobalTraveler", message: "Concierge team went above and beyond!", sentiment: "positive", platform: "TripAdvisor", time: "6h ago" },
      { user: "VIPGuest", message: "Thanks to the concierge for the amazing restaurant recommendations", sentiment: "positive", platform: "Instagram", time: "1d ago" },
      { user: "LuxuryExpert", message: "Exceptional concierge service as always", sentiment: "positive", platform: "Facebook", time: "2d ago" }
    ]
  };

  // Calculate social performance score
  const calculateScore = () => {
    let totalScore = 0;
    for (const [, metric] of Object.entries(socialMetrics)) {
      const progress = (metric.current - metric.previous) / (metric.target - metric.previous);
      totalScore += progress * metric.weight;
    }
    return Math.round(totalScore * 100);
  };

  // Calculate month over month change
  const calculateMoMChange = () => {
    let totalCurrentMetrics = 0;
    let totalPreviousMetrics = 0;
    
    for (const metric of Object.values(socialMetrics)) {
      totalCurrentMetrics += metric.current / metric.target;
      totalPreviousMetrics += metric.previous / metric.target;
    }
    
    const momChange = ((totalCurrentMetrics - totalPreviousMetrics) / totalPreviousMetrics) * 100;
    return Math.round(momChange);
  };

  // Generate recommendations based on metrics
  const generateRecommendations = () => {
    const recommendations = [];
    
    // Check followers growth
    if ((socialMetrics.followers.current / socialMetrics.followers.target) < 0.7) {
      recommendations.push({
        text: "Run targeted follower acquisition campaigns on Instagram and Facebook",
        metric: "Followers",
        priority: "High"
      });
    }

    // Check engagement rate
    const engagementRate = (socialMetrics.engagement.current / socialMetrics.followers.current) * 100;
    if (engagementRate < 2) {
      recommendations.push({
        text: "Increase post frequency during peak hours (10 AM and 7 PM) and use more video content",
        metric: "Engagement",
        priority: "High"
      });
    }

    // Check impression growth
    if ((socialMetrics.impressions.current / socialMetrics.impressions.previous) < 1.1) {
      recommendations.push({
        text: "Boost top-performing posts and leverage Instagram Reels for wider reach",
        metric: "Impressions",
        priority: "Medium"
      });
    }

    // Check link click rate
    const clickRate = (socialMetrics.linkClicks.current / socialMetrics.impressions.current) * 100;
    if (clickRate < 1) {
      recommendations.push({
        text: "Add compelling CTAs and use Instagram's link stickers in Stories",
        metric: "Link Clicks",
        priority: "Medium"
      });
    }

    return recommendations.slice(0, 3); // Return top 3 recommendations
  };

  const performanceScore = calculateScore();
  const momChange = calculateMoMChange();
  const recommendations = generateRecommendations();

  // Chart Data
  const engagementData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Engagement',
        data: [65, 59, 80, 81, 56, 95],
        fill: true,
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderColor: 'rgb(147, 51, 234)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(147, 51, 234)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#6B7280',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827',
        titleFont: {
          size: 14,
          weight: 'bold' as const,
          family: "'Inter', sans-serif",
        },
        bodyColor: '#4B5563',
        bodyFont: {
          size: 12,
          family: "'Inter', sans-serif",
        },
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        borderColor: 'rgba(229, 231, 235, 1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#6B7280',
        },
      },
      y: {
        grid: {
          color: 'rgba(243, 244, 246, 1)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#6B7280',
          padding: 8,
        },
        beginAtZero: true,
      },
    },
  };

  const handleAskAI = async () => {
    setIsLoading(true);
    // Simulated AI response - In a real app, this would be an API call
    const responses = [
      "Try posting more behind-the-scenes content of hotel staff and operations to increase engagement.",
      "Based on your recent metrics, posting during evening hours (6-8pm) could improve reach by 25%.",
      "Consider creating a weekly series highlighting guest experiences and testimonials.",
      "Your competitor hotels are getting good engagement with local food and culture posts. Try incorporating more local content.",
      "Video content is performing 40% better than images. Consider increasing video posts of hotel amenities."
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
    setIsLoading(false);
  };

  // Update Stats Grid to show platform-specific stats
  const platformStats = [
    {
      platform: 'Instagram',
      color: 'purple',
      followers: socialMetrics.followers.breakdown.instagram,
      engagement: socialMetrics.engagement.breakdown.instagram,
      growth: '+15%'
    },
    {
      platform: 'Facebook',
      color: 'blue',
      followers: socialMetrics.followers.breakdown.facebook,
      engagement: socialMetrics.engagement.breakdown.facebook,
      growth: '+10%'
    },
    {
      platform: 'LinkedIn',
      color: 'green',
      followers: socialMetrics.followers.breakdown.linkedin,
      engagement: socialMetrics.engagement.breakdown.linkedin,
      growth: '+8%'
    }
  ];

  return (
    <div className={`flex h-screen w-full ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} overflow-hidden`}>
      {/* Left Navigation */}
      <nav className={`${
        isNavCollapsed ? 'w-[72px]' : 'w-[280px]'
      } ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r h-full transition-all duration-300 ease-in-out flex flex-col shadow-sm relative z-10
      ${isNavCollapsed ? 'sm:w-[72px]' : 'sm:w-[280px]'}
      hidden sm:flex`}>
        <div className={`p-6 flex ${isNavCollapsed ? 'justify-center' : 'justify-between'} items-center border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h1 className={`text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text ${isNavCollapsed ? 'hidden' : 'block'}`}>
            BCV Dashboard
          </h1>
          <button 
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            className={`${darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} p-2 rounded-lg transition-all`}
          >
            {isNavCollapsed ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col">
          <nav className="px-4 space-y-1 flex-1">
            {/* Main Navigation */}
            <div className="space-y-1 mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'dashboard' 
                  ? 'bg-purple-50 text-purple-600' 
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
              </button>

              <button
                onClick={() => setCurrentView('create-post')}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'create-post' 
                  ? 'bg-purple-50 text-purple-600' 
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>Create Post</span>
              </button>

              <button
                onClick={() => setCurrentView('calendar')}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'calendar' 
                  ? 'bg-purple-50 text-purple-600' 
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>Calendar</span>
              </button>
            </div>

            {/* Separator */}
            <div className={`${isNavCollapsed ? 'mx-2' : 'mx-3'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} my-4`}></div>

            {/* Tools Section */}
            <div className={`${isNavCollapsed ? 'hidden' : 'block'} mb-2 px-3`}>
              <h3 className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Tools</h3>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-full flex items-center px-3 py-2 rounded-lg ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              {darkMode ? (
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>

            <button
              onClick={() => setIsAIDrawerOpen(true)}
              className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
              <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>AI Assistant</span>
            </button>

            <button
              onClick={() => setIsTopPostsDrawerOpen(true)}
              className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>Top Posts</span>
            </button>

            <button
              onClick={() => setIsEventsDrawerOpen(true)}
              className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>Events</span>
            </button>
          </nav>

          {/* Bottom Section with Settings and Profile */}
          <div className="px-4 mt-auto">
            <div className={`${isNavCollapsed ? 'mx-2' : 'mx-3'} border-t border-gray-200 my-4`}></div>
            <div className="space-y-1">
              <button
                onClick={() => setCurrentView('settings')}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'settings' 
                  ? 'bg-purple-50 text-purple-600' 
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>Settings</span>
              </button>

              <button
                onClick={() => {}}
                className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>Profile</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} px-4 sm:px-6 py-8`}>
        {currentView === 'dashboard' ? (
          <div className={`mx-auto transition-all duration-300 
            ${isNavCollapsed ? 'max-w-[95%]' : 'max-w-7xl'}
            sm:px-4 md:px-6 lg:px-8`}
          >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Social Performance</h2>
                <div className="flex flex-col sm:flex-row sm:items-center mt-2 space-y-2 sm:space-y-0">
                  <p className="text-gray-600">Monitor and optimize your hotel's social media presence</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <div className="relative group flex-1 sm:flex-none">
                  <select 
                    className="w-full sm:w-auto text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white pr-10"
                    defaultValue="last7days"
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 days</option>
                    <option value="last30days">Last 30 days</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <div className="absolute top-full left-0 mt-2 w-64 p-4 bg-white rounded-xl shadow-lg border border-gray-100 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-10">
                    <h4 className="font-medium text-gray-900 mb-2">Data Variance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Engagement</span>
                        <span className="text-green-600">+12.5%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Impressions</span>
                        <span className="text-green-600">+8.3%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Link Clicks</span>
                        <span className="text-red-600">-2.1%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Followers</span>
                        <span className="text-green-600">+5.7%</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Compared to previous period</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEventsDrawerOpen(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">View Events</span>
                </button>
                <button 
                  onClick={() => setCurrentView('create-post')}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">Create Post</span>
                </button>
              </div>
            </div>

            {/* Performance Score Card */}
            <div className="bg-[#D8F3FF] rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 mb-8 hover:shadow-md transition-shadow duration-300">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-xl font-semibold text-gray-900">Social Performance Score</h3>
                    <div className="relative group ml-2">
                      <svg className="w-5 h-5 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        A weighted score (0-100%) calculated from your social media metrics including followers, impressions, engagement, and link clicks relative to their targets.
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center text-sm ${momChange >= 0 ? 'text-green-600' : 'text-red-600'} bg-opacity-10 px-3 py-1 rounded-full`}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={momChange >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                      </svg>
                      {momChange}% MoM
                    </span>
                    <div className="relative group">
                      <span className="inline-flex items-center text-green-600 text-sm bg-green-50 px-3 py-1 rounded-full cursor-help">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        +10% vs competitors
                      </span>
                      <div className="absolute right-0 bottom-full mb-2 w-72 p-4 bg-white rounded-xl shadow-lg border border-gray-100 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-10">
                        <h4 className="font-medium text-gray-900 mb-2">Competitor Comparison</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">The Ritz London</span>
                            <span className="text-green-600">+8%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Claridge's</span>
                            <span className="text-green-600">+12%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">The Dorchester</span>
                            <span className="text-green-600">+5%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">The Savoy</span>
                            <span className="text-red-600">-2%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Mandarin Oriental</span>
                            <span className="text-green-600">+15%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">The Connaught</span>
                            <span className="text-green-600">+7%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Brown's Hotel</span>
                            <span className="text-green-600">+3%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">The Berkeley</span>
                            <span className="text-red-600">-4%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Four Seasons Park Lane</span>
                            <span className="text-green-600">+9%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">The Lanesborough</span>
                            <span className="text-green-600">+6%</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">Based on social media engagement rates over the last 30 days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline">
                  <span className="text-6xl font-bold text-gray-900">{performanceScore}%</span>
                  <span className="ml-4 text-lg text-gray-500">Performance Score</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-gray-700 mb-3 font-medium">Top recommendations:</p>
                    {recommendations.map((rec, index) => (
                      <button
                        key={index}
                        onClick={() => setIsTopPostsDrawerOpen(true)}
                        className="w-full flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors mb-2 group"
                      >
                        <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${rec.priority === 'High' ? 'bg-purple-500' : 'bg-blue-400'}`}></span>
                        <div className="text-left">
                          <p className="text-gray-800 group-hover:text-purple-600 transition-colors">{rec.text}</p>
                          <p className="text-sm text-gray-500 mt-1">Impact: {rec.metric} • Priority: {rec.priority}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>

                  <div>
                    <p className="text-gray-700 mb-3 font-medium">Trending Keywords:</p>
                    <div className="flex flex-wrap gap-2">
                      {socialListeningKeywords.map((item, index) => (
                        <button 
                          key={index}
                          onClick={() => {
                            setSelectedKeyword(item.keyword);
                            setIsKeywordChatOpen(true);
                          }}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-white border border-gray-200 hover:border-purple-200 transition-colors cursor-pointer group"
                        >
                          <span className="text-gray-800 group-hover:text-purple-600 transition-colors">{item.keyword}</span>
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            item.sentiment > 0.7 ? 'bg-green-100 text-green-700' : 
                            item.sentiment > 0.5 ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {item.mentions}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {platformStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        stat.platform === 'Instagram' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                        stat.platform === 'Facebook' ? 'bg-blue-600' :
                        'bg-blue-700'
                      }`}>
                        <img 
                          src={`https://cdn.simpleicons.org/${stat.platform.toLowerCase()}/white`} 
                          alt={stat.platform} 
                          className="w-6 h-6"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">{stat.platform}</h4>
                    </div>
                    <span className="text-green-500 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                      {stat.growth}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Followers</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.followers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Engagement</p>
                      <p className="text-xl font-semibold text-gray-900">{stat.engagement.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
                  <h4 className="text-lg font-semibold text-gray-900">Engagement Growth</h4>
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <select className="w-full sm:w-auto text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Last 6 months</option>
                      <option>Last 3 months</option>
                      <option>Last month</option>
                    </select>
                    <span className="text-green-500 text-sm font-medium bg-green-50 px-3 py-1 rounded-full whitespace-nowrap">+18%</span>
                  </div>
                </div>
                <div className="h-[400px]">
                  <Line data={engagementData} options={chartOptions} />
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Engagement</p>
                      <p className="text-xl font-semibold text-gray-900 mt-1">95.2k</p>
                      <span className="text-green-500 text-sm">+12% vs last month</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Engagement Rate</p>
                      <p className="text-xl font-semibold text-gray-900 mt-1">4.8%</p>
                      <span className="text-green-500 text-sm">+0.5% vs last month</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg. Competitor Engagement</p>
                      <p className="text-xl font-semibold text-gray-900 mt-1">85.0k</p>
                      <span className="text-purple-500 text-sm">+10.2k difference</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Market Position</p>
                      <p className="text-xl font-semibold text-gray-900 mt-1">Top 3</p>
                      <span className="text-blue-500 text-sm">+1 vs last month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'create-post' ? (
          <CreatePost 
            onSubmit={(post) => {
              console.log('New post:', post);
              setCurrentView('dashboard');
            }} 
          />
        ) : currentView === 'calendar' ? (
          <Calendar events={upcomingEvents} />
        ) : currentView === 'settings' ? (
          <Settings />
        ) : null}
      </main>

      {/* Floating AI Button */}
      <button
        onClick={() => setIsAIDrawerOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-30 group"
      >
        <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-white text-gray-700 text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
          Ask AI Assistant
        </div>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      </button>

      {/* AI Assistant Drawer */}
      {isAIDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsAIDrawerOpen(false)}>
          <div 
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[600px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0 z-50"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                      Hyatt London AI Marketing Assistant
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Your personal AI assistant for social media marketing</p>
                  </div>
                  <button 
                    onClick={() => setIsAIDrawerOpen(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Quick Prompts */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Quick Prompts</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Content Strategy</h4>
                        <div className="space-y-2">
                          <button
                            onClick={() => setAiQuery("Best content types for luxury hotels on Instagram?")}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-sm"
                          >
                            Top Instagram content formats
                          </button>
                          <button
                            onClick={() => setAiQuery("How to promote our fine dining experience?")}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-sm"
                          >
                            Restaurant promotion ideas
                          </button>
                          <button
                            onClick={() => setAiQuery("Trending luxury hotel hashtags this week?")}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-sm"
                          >
                            Current trending hashtags
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Competitor Analysis</h4>
                        <div className="space-y-2">
                          <button
                            onClick={() => setAiQuery("Compare our engagement vs Ritz London?")}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-sm"
                          >
                            Ritz London comparison
                          </button>
                          <button
                            onClick={() => setAiQuery("Top performing posts from Savoy this month?")}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-sm"
                          >
                            Savoy's best content
                          </button>
                          <button
                            onClick={() => setAiQuery("Analyze Dorchester's Instagram strategy")}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-sm"
                          >
                            Dorchester's strategy
                          </button>
                          <button
                            onClick={() => setAiQuery("Competitor spa promotion analysis")}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-sm"
                          >
                            Spa marketing comparison
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Event Marketing</h4>
                        <div className="space-y-2">
                          <button
                            onClick={() => setAiQuery("Holiday season social strategy?")}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-sm"
                          >
                            Holiday campaign ideas
                          </button>
                          <button
                            onClick={() => setAiQuery("Fashion Week content strategy?")}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-sm"
                          >
                            Fashion Week ideas
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Guest Experience</h4>
                        <div className="space-y-2">
                          <button
                            onClick={() => setAiQuery("Best ways to showcase guest testimonials?")}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-sm"
                          >
                            Guest story formats
                          </button>
                          <button
                            onClick={() => setAiQuery("How to boost guest social sharing?")}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-sm"
                          >
                            Increase guest sharing
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Query */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Custom Query</h3>
                    <div className="space-y-4">
                      <textarea
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder="Ask anything about Hyatt London's social media marketing..."
                        className="w-full border border-gray-200 rounded-lg p-4 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                      />
                      <button
                        onClick={handleAskAI}
                        disabled={!aiQuery.trim() || isLoading}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Get AI Insights</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* AI Response */}
                  {aiResponse && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">AI Response</h3>
                      <div className="bg-purple-50 rounded-lg p-4 text-gray-800">
                        <p className="text-sm whitespace-pre-wrap">{aiResponse}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Posts Drawer */}
      {isTopPostsDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsTopPostsDrawerOpen(false)}>
          <div 
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[600px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0 z-50"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Top Performing Posts
                  </h2>
                  <button 
                    onClick={() => setIsTopPostsDrawerOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                  {topPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <img src={post.image} alt="Post preview" className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              post.platform === 'Instagram' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {post.platform}
                            </span>
                            <span className="text-gray-500 text-sm">{post.type}</span>
                          </div>
                          <span className="text-sm text-gray-500">{post.date}</span>
                        </div>
                        <p className="text-gray-800 mb-4">{post.content}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Engagement</span>
                              <span className="font-medium">{post.engagement.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Likes</span>
                              <span className="font-medium">{post.likes.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Comments</span>
                              <span className="font-medium">{post.comments.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Shares</span>
                              <span className="font-medium">{post.shares.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Impressions</span>
                            <span className="font-medium">{post.impressions.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Drawer */}
      {isEventsDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsEventsDrawerOpen(false)}>
          <div 
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[600px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0 z-50"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Upcoming Events in London
                  </h2>
                  <button 
                    onClick={() => setIsEventsDrawerOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-1">Next 30 days</p>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {event.category}
                          </span>
                          <span className="text-gray-500 text-sm">{event.date}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm">{event.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm">{event.attendees} attendees</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyword Chat Drawer */}
      {isKeywordChatOpen && selectedKeyword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsKeywordChatOpen(false)}>
          <div 
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0 z-50"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Conversations about "{selectedKeyword}"
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Recent mentions and discussions</p>
                  </div>
                  <button 
                    onClick={() => setIsKeywordChatOpen(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {keywordChats[selectedKeyword]?.map((chat, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                            {chat.user.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{chat.user}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                chat.platform === 'Instagram' ? 'bg-pink-100 text-pink-700' :
                                chat.platform === 'Twitter' ? 'bg-blue-100 text-blue-700' :
                                chat.platform === 'Facebook' ? 'bg-indigo-100 text-indigo-700' :
                                chat.platform === 'LinkedIn' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {chat.platform}
                              </span>
                              <span className="text-xs text-gray-500">{chat.time}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          chat.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          chat.sentiment === 'neutral' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {chat.sentiment}
                        </span>
                      </div>
                      <p className="mt-3 text-gray-700">{chat.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Showing recent mentions</span>
                  <button className="text-purple-600 hover:text-purple-700 font-medium">
                    View all
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
