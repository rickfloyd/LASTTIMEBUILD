
import React from 'react';

export interface NewsOutlet {
  name: string;
  category: string;
  rssFeedUrl: string;
  leaning: string;
}

export const newsOutlets: NewsOutlet[] = [
  // Major News Outlets
  { name: 'The New York Times', category: 'Newspaper', rssFeedUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', leaning: 'Lean Left' },
  { name: 'The Wall Street Journal', category: 'Newspaper', rssFeedUrl: 'https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml', leaning: 'Center' },
  { name: 'The Washington Post', category: 'Newspaper', rssFeedUrl: 'http://feeds.washingtonpost.com/rss/politics', leaning: 'Lean Left' },
  { name: 'Reuters', category: 'News Agency', rssFeedUrl: 'http://feeds.reuters.com/reuters/topNews', leaning: 'Center' },
  { name: 'Associated Press', category: 'News Agency', rssFeedUrl: 'https://apnews.com/hub/ap-top-news/rss.xml', leaning: 'Center' },

  // TV News
  { name: 'BBC News', category: 'Broadcast Network', rssFeedUrl: 'http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml', leaning: 'Center' },
  { name: 'CNN', category: 'Cable News', rssFeedUrl: 'http://rss.cnn.com/rss/cnn_topstories.rss', leaning: 'Left' },
  { name: 'Fox News', category: 'Cable News', rssFeedUrl: 'http://feeds.foxnews.com/foxnews/latest', leaning: 'Right' },
  { name: 'MSNBC', category: 'Cable News', rssFeedUrl: 'http://www.msnbc.com/feeds/latest', leaning: 'Left' },
  { name: 'Al Jazeera', category: 'International', rssFeedUrl: 'https://www.aljazeera.com/xml/rss/all.xml', leaning: 'Center' },

  // Tech News
  { name: 'TechCrunch', category: 'Technology', rssFeedUrl: 'https://techcrunch.com/feed/', leaning: 'Center' },
  { name: 'The Verge', category: 'Technology', rssFeedUrl: 'https://www.theverge.com/rss/index.xml', leaning: 'Left' },
  { name: 'Wired', category: 'Technology', rssFeedUrl: 'https://www.wired.com/feed/rss', leaning: 'Center' },

  // Business and Finance
  { name: 'Bloomberg', category: 'Business', rssFeedUrl: 'https://feeds.bloomberg.com/billionaires/sitemap.xml', leaning: 'Center' },
  { name: 'Forbes', category: 'Business', rssFeedUrl: 'https://www.forbes.com/business/feed/', leaning: 'Center' },
  { name: 'Financial Times', category: 'Newspaper', rssFeedUrl: 'https://www.ft.com/?format=rss', leaning: 'Center' },
  { name: 'Tiingo', category: 'Financial Data', rssFeedUrl: 'https://blog.tiingo.com/feed/', leaning: 'Center' }
];

const NewsOutlets: React.FC = () => {
  return (
    <div>
      <h1>News Outlets</h1>
      <ul>
        {newsOutlets.map(outlet => (
          <li key={outlet.name}>
            <a href={outlet.rssFeedUrl} target="_blank" rel="noopener noreferrer">
              {outlet.name}
            </a>
            <span> ({outlet.category}) - {outlet.leaning}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsOutlets;
