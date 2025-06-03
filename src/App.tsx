import { useState } from 'react'
import './App.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import CreatePost from './components/CreatePost';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isTopPostsDrawerOpen, setIsTopPostsDrawerOpen] = useState(false);
  const [isEventsDrawerOpen, setIsEventsDrawerOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  // New state for social performance metrics
  const [socialMetrics, setSocialMetrics] = useState({
    followers: {
      current: 92547,
      previous: 85700,
      target: 100000,
      weight: 0.25
    },
    impressions: {
      current: 620,
      previous: 580,
      target: 1000,
      weight: 0.25
    },
    engagement: {
      current: 220000,
      previous: 212000,
      target: 250000,
      weight: 0.3
    },
    linkClicks: {
      current: 520,
      previous: 500,
      target: 600,
      weight: 0.2
    }
  });

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
      platform: 'Instagram',
      type: 'Carousel',
      content: 'Experience luxury in every detail - Swipe to tour our Presidential Suite',
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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

  // Calculate social performance score
  const calculateScore = () => {
    let totalScore = 0;
    
    for (const [key, metric] of Object.entries(socialMetrics)) {
      const percentageOfTarget = (metric.current / metric.target) * 100;
      const cappedPercentage = Math.min(percentageOfTarget, 100);
      totalScore += (cappedPercentage * metric.weight);
    }
    
    return Math.round(totalScore);
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

  const readyMadePrompts = [
    {
      title: "Content Strategy",
      prompts: [
        "What type of content should we create for luxury hotel guests?",
        "How can we showcase our hotel amenities effectively?"
      ]
    },
    {
      title: "Engagement",
      prompts: [
        "How to improve our Instagram engagement rate?",
        "What are the best times to post for maximum reach?"
      ]
    },
    {
      title: "Competition",
      prompts: [
        "What social media strategies are working for our competitors?"
      ]
    },
    {
      title: "Analytics",
      prompts: [
        "How to interpret our current engagement metrics?"
      ]
    }
  ];

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

  const followersData = {
    labels: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok'],
    datasets: [
      {
        label: 'Followers',
        data: [35000, 25000, 15000, 10000, 7500],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

  const newEngagementData = {
    labels: ['Likes', 'Comments', 'Shares', 'Saves'],
    datasets: [
      {
        data: [120, 80, 60, 50],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 0,
        spacing: 2,
        borderRadius: 4,
        hoverOffset: 8,
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

  // Specific options for doughnut chart
  const doughnutOptions = {
    ...chartOptions,
    cutout: '75%',
    radius: '90%',
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

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Left Navigation */}
      <nav className={`${isNavCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 h-full transition-all duration-300 ease-in-out flex flex-col shadow-sm relative z-10`}>
        <div className={`p-6 flex ${isNavCollapsed ? 'justify-center' : 'justify-between'} items-center border-b border-gray-100`}>
          <h1 className={`text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text ${isNavCollapsed ? 'hidden' : 'block'}`}>BCV</h1>
          <button 
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all"
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
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-2">
            <a href="#" className={`flex items-center ${isNavCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-gray-900 bg-purple-50 rounded-xl group transition-all duration-200`}>
              <svg className={`w-6 h-6 text-purple-600 ${isNavCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className={`${isNavCollapsed ? 'hidden' : 'block'} font-medium`}>Dashboard</span>
            </a>
            <a href="#" className={`flex items-center ${isNavCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-gray-600 rounded-xl hover:bg-gray-50 group transition-all duration-200`}>
              <svg className={`w-6 h-6 ${isNavCollapsed ? '' : 'mr-3'} group-hover:text-purple-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>Analytics</span>
            </a>
            <a href="#" className={`flex items-center ${isNavCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-gray-600 rounded-xl hover:bg-gray-50 group transition-all duration-200`}>
              <svg className={`w-6 h-6 ${isNavCollapsed ? '' : 'mr-3'} group-hover:text-purple-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>Calendar</span>
            </a>
            <a href="#" className={`flex items-center ${isNavCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-gray-600 rounded-xl hover:bg-gray-50 group transition-all duration-200`}>
              <svg className={`w-6 h-6 ${isNavCollapsed ? '' : 'mr-3'} group-hover:text-purple-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>Messages</span>
            </a>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('create-post');
              }}
              className={`flex items-center ${isNavCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-gray-600 rounded-xl hover:bg-gray-50 group transition-all duration-200 ${currentView === 'create-post' ? 'bg-purple-50 text-purple-600' : ''}`}
            >
              <svg className={`w-6 h-6 ${isNavCollapsed ? '' : 'mr-3'} group-hover:text-purple-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className={`${isNavCollapsed ? 'hidden' : 'block'}`}>Create Post</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm">Property</span>
                  <select className="border rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Hyatt, London</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setCurrentView('create-post')}
                  className="bg-white text-purple-600 border border-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-all"
                >
                  Create Post
                </button>
                <button 
                  onClick={() => setIsAIDrawerOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Ask AI
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {currentView === 'dashboard' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                  <p className="text-gray-600 mt-1">Monitor your hotel's social media performance</p>
                </div>
                <button 
                  onClick={() => setIsEventsDrawerOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                >
                  View Events
                </button>
              </div>

              {/* Update Performance Score Card */}
              <div 
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl mb-8 border border-blue-100 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setIsTopPostsDrawerOpen(true)}
              >
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Social Performance Score</h3>
                    <div className="flex items-baseline space-x-4 mb-4">
                      <span className="text-5xl font-bold text-gray-900">{performanceScore}%</span>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <span className={`inline-flex items-center text-sm ${momChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={momChange >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                          </svg>
                          {momChange}% MoM
                        </span>
                        <span className="inline-flex items-center text-green-600 text-sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          +10% vs competitors
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-gray-700">Top recommendations to improve your score:</p>
                      {recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${rec.priority === 'High' ? 'bg-purple-500' : 'bg-blue-400'}`}></span>
                          <div>
                            <p className="text-gray-700">{rec.text}</p>
                            <p className="text-sm text-gray-500">Impact: {rec.metric} • Priority: {rec.priority}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <img 
                    src="/assets/images/freepik__upload__12989.png" 
                    alt="Social Media Performance Illustration" 
                    className="w-full h-auto lg:max-w-md xl:max-w-lg rounded-xl object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = 'https://placehold.co/400x200?text=Social+Media+Performance';
                    }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-gray-600 mb-2 text-sm">Total Followers</h4>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-gray-900">92,547</span>
                    <span className="text-green-500 text-sm font-medium">+12.5%</span>
                  </div>
                  <span className="text-sm text-gray-500">from 105,700</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-gray-600 mb-2 text-sm">Impressions</h4>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-gray-900">620</span>
                    <span className="text-green-500 text-sm font-medium">+2.5%</span>
                  </div>
                  <span className="text-sm text-gray-500">from 580</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-gray-600 mb-2 text-sm">Total Engagement</h4>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-gray-900">220K</span>
                    <span className="text-green-500 text-sm font-medium">+8K</span>
                  </div>
                  <span className="text-sm text-gray-500">from 21.2K</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-gray-600 mb-2 text-sm">Link Clicks</h4>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-gray-900">520</span>
                    <span className="text-green-500 text-sm font-medium">+2.5%</span>
                  </div>
                  <span className="text-sm text-gray-500">from 500</span>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-gray-900">Engagement Growth</h4>
                    <span className="text-green-500 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">+18%</span>
                  </div>
                  <div className="h-64">
                    <Line data={engagementData} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-gray-900">Followers Growth</h4>
                    <span className="text-green-500 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">+8%</span>
                  </div>
                  <div className="h-64">
                    <Bar data={followersData} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-gray-900">New Engagement</h4>
                    <span className="text-green-500 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">+310</span>
                  </div>
                  <div className="h-64">
                    <Doughnut data={newEngagementData} options={doughnutOptions} />
                  </div>
                </div>
              </div>
            </div>
          ) : currentView === 'create-post' ? (
            <CreatePost 
              onSubmit={(post) => {
                console.log('New post:', post);
                // Here you would typically send the post to your backend
                setCurrentView('dashboard');
              }} 
            />
          ) : null}
        </main>
      </div>

      {/* AI Assistant Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isAIDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
      >
        <div className="h-full flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                Social Media AI Assistant
              </h2>
              <button 
                onClick={() => setIsAIDrawerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Ready-made Prompts */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Quick Prompts</h3>
                {readyMadePrompts.map((category, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-600">{category.title}</h4>
                    <div className="space-y-2">
                      {category.prompts.map((prompt, promptIdx) => (
                        <button
                          key={promptIdx}
                          onClick={() => setAiQuery(prompt)}
                          className="block w-full text-left text-sm p-2 rounded hover:bg-gray-50 text-gray-700 hover:text-purple-600 transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Query Input */}
              <div className="space-y-4">
                <textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Type your question or click a prompt above..."
                  className="w-full border rounded-lg p-3 h-32 focus:outline-none focus:border-purple-500 text-sm"
                />
                <button
                  onClick={handleAskAI}
                  disabled={!aiQuery.trim() || isLoading}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isLoading ? 'Thinking...' : 'Ask AI'}
                </button>
              </div>

              {/* AI Response */}
              {aiResponse && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">AI Response:</h4>
                  <p className="text-gray-800 text-sm">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Posts Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isTopPostsDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
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

      {/* Events Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isEventsDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
  );
}

export default App;
