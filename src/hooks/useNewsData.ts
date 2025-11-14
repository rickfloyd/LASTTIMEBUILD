import { useState, useEffect, useCallback, useMemo } from 'react';

interface NewsItem {
  title: string;
  time: string;
  category: string;
  color: string;
  source?: string;
  url?: string;
}

interface UseNewsDataReturn {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  refreshNews: () => void;
  switchPersonality: (personality: 'republican' | 'democrat' | 'liberal' | 'independent') => void;
  currentPersonality: string;
}

export const useNewsData = (): UseNewsDataReturn => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPersonality, setCurrentPersonality] = useState<'republican' | 'democrat' | 'liberal' | 'independent'>('independent');

  const colors = useMemo(() => [
    'fluorescent-pink',
    'fluorescent-blue',
    'electric-orange',
    'pulsing-cyan',
    'neon-green',
    'electric-purple'
  ], []);

  const generateMockNews = useCallback((personality: string): NewsItem[] => {
    const mockNews = {
      republican: [
        { title: 'Market Rally Continues Amid Economic Growth', category: 'Business', time: '2 min ago' },
        { title: 'Federal Reserve Policy Impact on Trading', category: 'Politics', time: '15 min ago' },
        { title: 'Conservative Investment Strategies Outperform', category: 'Finance', time: '30 min ago' },
        { title: 'Traditional Energy Stocks Surge', category: 'Energy', time: '45 min ago' },
        { title: 'Small Business Growth Initiative Success', category: 'Economics', time: '1 hour ago' },
        { title: 'Defense Sector Investments Rise', category: 'Defense', time: '1.5 hours ago' }
      ],
      democrat: [
        { title: 'Green Energy Stocks Surge on Climate Policy', category: 'Environment', time: '5 min ago' },
        { title: 'Social Impact Investing Trends', category: 'Politics', time: '20 min ago' },
        { title: 'Healthcare Sector Shows Strong Growth', category: 'Healthcare', time: '35 min ago' },
        { title: 'Education Technology Investments Rise', category: 'Technology', time: '50 min ago' },
        { title: 'Infrastructure Bill Boosts Construction Stocks', category: 'Infrastructure', time: '1.2 hours ago' },
        { title: 'Renewable Energy Tax Credits Extended', category: 'Policy', time: '1.8 hours ago' }
      ],
      liberal: [
        { title: 'Global Markets React to Social Policies', category: 'World', time: '8 min ago' },
        { title: 'Progressive Economic Indicators', category: 'Politics', time: '25 min ago' },
        { title: 'Sustainable Finance Initiatives Expand', category: 'Sustainability', time: '40 min ago' },
        { title: 'Worker Cooperative Investments Grow', category: 'Labor', time: '55 min ago' },
        { title: 'Fair Trade Market Growth Accelerates', category: 'Ethics', time: '1.3 hours ago' },
        { title: 'Community Banking Sector Thrives', category: 'Banking', time: '2 hours ago' }
      ],
      independent: [
        { title: 'Unbiased Market Analysis Report', category: 'Business', time: '3 min ago' },
        { title: 'Global Economic Outlook', category: 'World', time: '18 min ago' },
        { title: 'Balanced Portfolio Strategies', category: 'Investment', time: '33 min ago' },
        { title: 'Market Volatility Analysis', category: 'Analysis', time: '48 min ago' },
        { title: 'Cross-Sector Performance Review', category: 'Markets', time: '1.1 hours ago' },
        { title: 'International Trade Impact Assessment', category: 'Trade', time: '1.7 hours ago' }
      ]
    };

    const personalityNews = mockNews[personality as keyof typeof mockNews] || mockNews.independent;
    
    return personalityNews.map((item, index) => ({
      ...item,
      color: colors[index % colors.length],
      source: 'Market News',
      url: '#'
    }));
  }, [colors]);

  const fetchNews = useCallback(async (personality: 'republican' | 'democrat' | 'liberal' | 'independent') => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockNews = generateMockNews(personality);
      setNews(mockNews);
    } catch (err) {
      setError(`Failed to fetch ${personality} news`);
      console.error('News fetch error:', err);
      
      // Fallback to basic mock news
      const fallbackNews: NewsItem[] = [
        {
          title: `${personality.charAt(0).toUpperCase() + personality.slice(1)} Market Update`,
          time: '5 min ago',
          category: 'Breaking',
          color: 'fluorescent-pink'
        },
        {
          title: 'Market Analysis Report',
          time: '15 min ago',
          category: 'Analysis',
          color: 'fluorescent-blue'
        }
      ];
      setNews(fallbackNews);
    } finally {
      setLoading(false);
    }
  }, [generateMockNews]);

  const refreshNews = useCallback(() => {
    fetchNews(currentPersonality);
  }, [fetchNews, currentPersonality]);

  const switchPersonality = useCallback((personality: 'republican' | 'democrat' | 'liberal' | 'independent') => {
    setCurrentPersonality(personality);
    fetchNews(personality);
  }, [fetchNews]);

  useEffect(() => {
    fetchNews(currentPersonality);
    
    // Refresh news every 5 minutes
    const interval = setInterval(() => {
      fetchNews(currentPersonality);
    }, 300000);

    return () => clearInterval(interval);
  }, [fetchNews, currentPersonality]);

  return {
    news,
    loading,
    error,
    refreshNews,
    switchPersonality,
    currentPersonality
  };
};