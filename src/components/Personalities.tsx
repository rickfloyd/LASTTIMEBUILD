import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the structure for a personality/source
interface Personality {
  name: string;
  category: string;
  rssFeedUrl: string;
  leaning: 'Conservative' | 'Liberal' | 'Independent' | 'World Languages' | 'World Finances' | 'LGBTQ' | 'News' | 'Religious';
  logoUrl?: string; // Optional: for displaying logos
}

// Define the structure for a single news item from the feed
interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  isoDate?: string;
}

// List of personalities based on your request
const personalities: Personality[] = [
  // Conservative Leaning
  { name: 'Fox News', category: 'News Network', rssFeedUrl: 'http://feeds.foxnews.com/foxnews/latest', leaning: 'Conservative' },
  { name: 'The Daily Wire', category: 'Commentary', rssFeedUrl: 'https://www.dailywire.com/feeds/rss.xml', leaning: 'Conservative' },
  { name: 'Newsmax', category: 'News Network', rssFeedUrl: 'https://www.newsmax.com/rss/Major-News/1/', leaning: 'Conservative' },
  { name: 'Breitbart News', category: 'News & Opinion', rssFeedUrl: 'http://feeds.breitbart.com/breitbart', leaning: 'Conservative' },
  { name: 'The Wall Street Journal', category: 'Business News', rssFeedUrl: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml', leaning: 'Conservative' },
  { name: 'The Joe Rogan Experience', category: 'Podcast', rssFeedUrl: 'https://joeroganexp.libsyn.com/rss', leaning: 'Conservative' }, // Note: This is a podcast feed
  { name: 'The New York Post', category: 'Newspaper', rssFeedUrl: 'https://nypost.com/feed/', leaning: 'Conservative' },
  { name: 'The Dispatch', category: 'Commentary', rssFeedUrl: 'https://thedispatch.com/feed', leaning: 'Conservative' },
  { name: 'Forbes', category: 'Business News', rssFeedUrl: 'https://www.forbes.com/real-time/feed2/', leaning: 'Conservative' },
  { name: 'Fox Business', category: 'Business News', rssFeedUrl: 'http://feeds.foxbusiness.com/foxbusiness/latest', leaning: 'Conservative' },
  { name: 'RedState', category: 'Political Blog', rssFeedUrl: 'https://redstate.com/feed', leaning: 'Conservative' },
  { name: 'The Washington Times', category: 'Newspaper', rssFeedUrl: 'https://www.washingtontimes.com/rss/headlines/news/', leaning: 'Conservative' },
  { name: 'PJ Media', category: 'Commentary', rssFeedUrl: 'https://pjmedia.com/feed/', leaning: 'Conservative' },
  { name: 'Townhall', category: 'News & Opinion', rssFeedUrl: 'https://townhall.com/rss/columnists/', leaning: 'Conservative' },
  { name: 'The Blaze', category: 'Media Network', rssFeedUrl: 'https://www.theblaze.com/feeds/rss', leaning: 'Conservative' },

  // Liberal Leaning
  { name: 'NPR', category: 'Public Radio', rssFeedUrl: 'https://feeds.npr.org/1001/rss.xml', leaning: 'Liberal' },
  { name: 'PBS', category: 'Public Television', rssFeedUrl: 'https://www.pbs.org/newshour/feeds/rss/headlines', leaning: 'Liberal' },
  { name: 'The New York Times', category: 'Newspaper', rssFeedUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', leaning: 'Liberal' },
  { name: 'The Washington Post', category: 'Newspaper', rssFeedUrl: 'http://feeds.washingtonpost.com/rss/politics', leaning: 'Liberal' },
  { name: 'MSNBC', category: 'News Network', rssFeedUrl: 'http://www.msnbc.com/feeds/latest', leaning: 'Liberal' },
  { name: 'The Atlantic', category: 'Magazine', rssFeedUrl: 'https://www.theatlantic.com/feed/all/', leaning: 'Liberal' },
  { name: 'HuffPost', category: 'Website/Blog', rssFeedUrl: 'https://www.huffpost.com/section/front-page/feed', leaning: 'Liberal' },
  { name: 'Vox', category: 'Website/Blog', rssFeedUrl: 'https://www.vox.com/rss/index.xml', leaning: 'Liberal' },
  { name: 'Mother Jones', category: 'Magazine/Website', rssFeedUrl: 'https://www.motherjones.com/feed/', leaning: 'Liberal' },
  { name: 'The Nation', category: 'Magazine/Website', rssFeedUrl: 'https://www.thenation.com/feed/', leaning: 'Liberal' },
  { name: 'Daily Kos', category: 'Website/Blog', rssFeedUrl: 'https://www.dailykos.com/blogs/main/rss', leaning: 'Liberal' },
  { name: 'The New Republic', category: 'Magazine/Website', rssFeedUrl: 'https://newrepublic.com/feed/', leaning: 'Liberal' },
  { name: 'ProPublica', category: 'Website', rssFeedUrl: 'http://feeds.propublica.org/propublica/main', leaning: 'Liberal' },
  { name: 'The Guardian', category: 'Website/Newspaper', rssFeedUrl: 'https://www.theguardian.com/us-news/rss', leaning: 'Liberal' },
  { name: 'The American Prospect', category: 'Magazine/Website', rssFeedUrl: 'https://prospect.org/feed/', leaning: 'Liberal' },

  // Independent Leaning
  { name: 'The Associated Press (AP)', category: 'News Agency', rssFeedUrl: 'https://apnews.com/hub/ap-top-news/rss.xml', leaning: 'Independent' },
  { name: 'Reuters', category: 'News Agency', rssFeedUrl: 'http://feeds.reuters.com/reuters/topNews', leaning: 'Independent' },
  { name: 'ABC News', category: 'Broadcast Network', rssFeedUrl: 'https://abcnews.go.com/abcnews/topstories', leaning: 'Independent' },
  { name: 'NBC News', category: 'Broadcast Network', rssFeedUrl: 'http://feeds.nbcnews.com/nbcnews/public/news', leaning: 'Independent' },
  { name: 'CBS News', category: 'Broadcast Network', rssFeedUrl: 'https://www.cbsnews.com/latest/rss/main', leaning: 'Independent' },
  { name: 'BBC News', category: 'International Broadcast', rssFeedUrl: 'http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml', leaning: 'Independent' },
  { name: 'The Hill', category: 'Website', rssFeedUrl: 'https://thehill.com/rss/syndicator/19110', leaning: 'Independent' },
  { name: 'FiveThirtyEight', category: 'Website/Blog', rssFeedUrl: 'https://fivethirtyeight.com/features/feed/', leaning: 'Independent' },
  { name: 'Politico', category: 'Website', rssFeedUrl: 'http://rss.politico.com/politico/politics.xml', leaning: 'Independent' },
  { name: 'USA Today', category: 'Website/Newspaper', rssFeedUrl: 'http://rssfeeds.usatoday.com/usatoday-NewsTopStories', leaning: 'Independent' },
  { name: 'C-SPAN', category: 'Public Affairs', rssFeedUrl: 'https://www.c-span.org/rss/video.rss', leaning: 'Independent' },
  { name: 'RealClearPolitics', category: 'Political News Aggregator', rssFeedUrl: 'http://feeds.feedburner.com/realclearpolitics/articles', leaning: 'Independent' },
  { name: 'Snopes', category: 'Fact-Checking', rssFeedUrl: 'https://www.snopes.com/feed/', leaning: 'Independent' },
  { name: 'FactCheck.org', category: 'Fact-Checking', rssFeedUrl: 'https://www.factcheck.org/feed/', leaning: 'Independent' },
  { name: 'AllSides', category: 'Media Bias Ratings', rssFeedUrl: 'https://www.allsides.com/rss/blog', leaning: 'Independent' },

  // World Languages
  { name: 'Le Monde (French)', category: 'Newspaper', rssFeedUrl: 'https://www.lemonde.fr/rss/une.xml', leaning: 'World Languages' },
  { name: 'El País (Spanish)', category: 'Newspaper', rssFeedUrl: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', leaning: 'World Languages' },
  { name: 'Der Spiegel (German)', category: 'Magazine', rssFeedUrl: 'https://www.spiegel.de/international/index.rss', leaning: 'World Languages' },
  { name: 'La Repubblica (Italian)', category: 'Newspaper', rssFeedUrl: 'https://www.repubblica.it/rss/homepage/rss2.0.xml', leaning: 'World Languages' },
  { name: 'Folha de S.Paulo (Portuguese)', category: 'Newspaper', rssFeedUrl: 'https://feeds.folha.uol.com.br/emcimadahora/rss.xml', leaning: 'World Languages' },
  { name: 'Asahi Shimbun (Japanese)', category: 'Newspaper', rssFeedUrl: 'https://www.asahi.com/rss/asahi/newsheadlines.rdf', leaning: 'World Languages' },
  { name: 'People\'s Daily (Chinese)', category: 'Newspaper', rssFeedUrl: 'http://en.people.cn/rss/world.xml', leaning: 'World Languages' },
  { name: 'The Moscow Times (Russian)', category: 'Newspaper', rssFeedUrl: 'https://www.themoscowtimes.com/rss/news', leaning: 'World Languages' },
  { name: 'Al Jazeera (Arabic)', category: 'News Network', rssFeedUrl: 'https://www.aljazeera.net/aljazeerarss/a7c182be-1baa-4bd4-9d80-a84db769f779/73d0e1b4-532f-45ef-b135-bfdff8b869be', leaning: 'World Languages' },
  { name: 'The Times of India (Hindi)', category: 'Newspaper', rssFeedUrl: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', leaning: 'World Languages' },
  { name: 'Yle (Finnish)', category: 'Public Broadcast', rssFeedUrl: 'https://feeds.yle.fi/uutiset/v1/majorHeadlines/YLE_UUTISET.rss', leaning: 'World Languages' },
  { name: 'De Telegraaf (Dutch)', category: 'Newspaper', rssFeedUrl: 'https://www.telegraaf.nl/rss', leaning: 'World Languages' },
  { name: 'Aftenposten (Norwegian)', category: 'Newspaper', rssFeedUrl: 'https://www.aftenposten.no/rss', leaning: 'World Languages' },
  { name: 'Svenska Dagbladet (Swedish)', category: 'Newspaper', rssFeedUrl: 'https://www.svd.se/?service=rss', leaning: 'World Languages' },
  { name: 'Helsingin Sanomat (Finnish)', category: 'Newspaper', rssFeedUrl: 'https://www.hs.fi/rss/teasers/etusivu.xml', leaning: 'World Languages' },

  // World Finances
  // English
  { name: 'The Wall Street Journal (Finance)', category: 'Financial News', rssFeedUrl: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', leaning: 'World Finances' },
  { name: 'Financial Times', category: 'Financial News', rssFeedUrl: 'https://www.ft.com/rss/home/us', leaning: 'World Finances' },
  // Mandarin
  { name: 'Caijing (财经)', category: 'Financial News', rssFeedUrl: 'http://www.caijing.com.cn/rss/home.xml', leaning: 'World Finances' },
  { name: 'Nikkei Chinese (日经中文网)', category: 'Financial News', rssFeedUrl: 'https://cn.nikkei.com/rss/nikkei-chinese-all.xml', leaning: 'World Finances' },
  // Hindi
  { name: 'Economic Times Hindi', category: 'Financial News', rssFeedUrl: 'https://economictimes.indiatimes.com/hindi/rssfeeds_hindimain.cms', leaning: 'World Finances' },
  { name: 'Business Standard Hindi', category: 'Financial News', rssFeedUrl: 'https://www.business-standard.com/rss/hindi-101.rss', leaning: 'World Finances' },
  // Spanish
  { name: 'Cinco Días (Spain)', category: 'Financial News', rssFeedUrl: 'https://cincodias.elpais.com/rss/cincodias/portada.xml', leaning: 'World Finances' },
  { name: 'El Economista (Mexico)', category: 'Financial News', rssFeedUrl: 'https://www.eleconomista.com.mx/rss/ultimas-noticias', leaning: 'World Finances' },
  // French
  { name: 'Les Échos (France)', category: 'Financial News', rssFeedUrl: 'https://www.lesechos.fr/rss/rss_une.xml', leaning: 'World Finances' },
  { name: 'La Presse Affaires (Canada)', category: 'Financial News', rssFeedUrl: 'https://www.lapresse.ca/affaires/rss', leaning: 'World Finances' },
  // Arabic
  { name: 'Al Mal News (المال نيوز)', category: 'Financial News', rssFeedUrl: 'https://almalnews.com/feed/', leaning: 'World Finances' },
  { name: 'Argaam (أرقام)', category: 'Financial News', rssFeedUrl: 'https://www.argaam.com/ar/rss', leaning: 'World Finances' },
  // Bengali
  { name: 'The Financial Express (BD)', category: 'Financial News', rssFeedUrl: 'https://thefinancialexpress.com.bd/rss/feed', leaning: 'World Finances' },
  { name: 'Bonik Barta (বণিক বার্তা)', category: 'Financial News', rssFeedUrl: 'https://bonikbarta.net/rss/', leaning: 'World Finances' },
  // Portuguese
  { name: 'Valor Econômico (Brazil)', category: 'Financial News', rssFeedUrl: 'https://valor.globo.com/rss/valor-economico.xml', leaning: 'World Finances' },
  { name: 'Jornal de Negócios (Portugal)', category: 'Financial News', rssFeedUrl: 'https://www.jornaldenegocios.pt/rss', leaning: 'World Finances' },
  // Russian
  { name: 'Kommersant (Коммерсантъ)', category: 'Financial News', rssFeedUrl: 'https://www.kommersant.ru/RSS/main.xml', leaning: 'World Finances' },
  { name: 'Vedomosti (Ведомости)', category: 'Financial News', rssFeedUrl: 'https://www.vedomosti.ru/rss/news', leaning: 'World Finances' },
  // Indonesian
  { name: 'Bisnis Indonesia', category: 'Financial News', rssFeedUrl: 'https://www.bisnis.com/rss', leaning: 'World Finances' },
  { name: 'Kontan', category: 'Financial News', rssFeedUrl: 'https://rss.kontan.co.id/', leaning: 'World Finances' },

  // LGBTQ+
  { name: 'The Advocate', category: 'News, politics, and culture', rssFeedUrl: 'https://www.advocate.com/rss.xml', leaning: 'LGBTQ' },
  { name: 'Out Magazine', category: 'Lifestyle, fashion, entertainment, and news', rssFeedUrl: 'https://www.out.com/rss.xml', leaning: 'LGBTQ' },
  { name: 'PinkNews', category: 'Global LGBTQ+ breaking news', rssFeedUrl: 'https://www.thepinknews.com/feed/', leaning: 'LGBTQ' },
  { name: 'Queerty', category: 'Online magazine', rssFeedUrl: 'https://www.queerty.com/feed', leaning: 'LGBTQ' },
  { name: 'LGBTQ Nation', category: 'Online news and political reporting', rssFeedUrl: 'https://www.lgbtqnation.com/feed/', leaning: 'LGBTQ' },
  { name: 'Attitude', category: 'Gay magazine', rssFeedUrl: 'https://www.attitude.co.uk/feed/', leaning: 'LGBTQ' },
  { name: 'Gay Times', category: 'Music, fashion, entertainment, and culture', rssFeedUrl: 'https://www.gaytimes.co.uk/feed/', leaning: 'LGBTQ' },
  { name: 'Them', category: 'Culture, style, community, and news', rssFeedUrl: 'https://www.them.us/feed/rss', leaning: 'LGBTQ' },
  { name: 'Autostraddle', category: 'Independent publication', rssFeedUrl: 'https://www.autostraddle.com/feed/', leaning: 'LGBTQ' },
  { name: 'The Washington Blade', category: 'News and political reporting', rssFeedUrl: 'https://www.washingtonblade.com/feed/', leaning: 'LGBTQ' },

  // News
  { name: 'Associated Press', category: 'News', rssFeedUrl: 'https://apnews.com/hub/ap-top-news/rss.xml', leaning: 'News' },
  { name: 'Reuters', category: 'News', rssFeedUrl: 'http://feeds.reuters.com/reuters/topNews', leaning: 'News' },
  { name: 'BBC News', category: 'News', rssFeedUrl: 'http://feeds.bbci.co.uk/news/rss.xml', leaning: 'News' },
  { name: 'The New York Times', category: 'News', rssFeedUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', leaning: 'News' },
  { name: 'The Guardian', category: 'News', rssFeedUrl: 'https://www.theguardian.com/world/rss', leaning: 'News' },

  // Religious
  { name: 'Christianity Today', category: 'Christianity', rssFeedUrl: 'https://www.christianitytoday.com/ct/rss.xml', leaning: 'Religious' },
  { name: 'Catholic News Agency', category: 'Catholicism', rssFeedUrl: 'https://www.catholicnewsagency.com/rss/news.xml', leaning: 'Religious' },
  { name: 'Chabad.org', category: 'Judaism', rssFeedUrl: 'https://www.chabad.org/tools/rss/rss.xml', leaning: 'Religious' },
  { name: 'Islamicity', category: 'Islam', rssFeedUrl: 'https://www.islamicity.org/feed/', leaning: 'Religious' },
  { name: 'Hinduism Today', category: 'Hinduism', rssFeedUrl: 'https://www.hinduismtoday.com/feed/', leaning: 'Religious' },
  { name: 'Lion\'s Roar', category: 'Buddhism', rssFeedUrl: 'https://www.lionsroar.com/feed/', leaning: 'Religious' },
  { name: 'The Sikh Times', category: 'Sikhism', rssFeedUrl: 'https://www.sikhtimes.com/feed/', leaning: 'Religious' },
  { name: 'JainLink', category: 'Jainism', rssFeedUrl: 'https://www.jainlink.org/feed/', leaning: 'Religious' },
  { name: 'Baháʼí World News Service', category: 'Baháʼí Faith', rssFeedUrl: 'https://news.bahai.org/rss/', leaning: 'Religious' },
  { name: 'Shinto News', category: 'Shinto', rssFeedUrl: 'https://www.shintonews.com/feed', leaning: 'Religious' },
];

const conservativePersonalities = personalities.filter(p => p.leaning === 'Conservative');
const liberalPersonalities = personalities.filter(p => p.leaning === 'Liberal');
const independentPersonalities = personalities.filter(p => p.leaning === 'Independent');
const worldLanguagesPersonalities = personalities.filter(p => p.leaning === 'World Languages');
const worldFinancesPersonalities = personalities.filter(p => p.leaning === 'World Finances');
const lgbtqPersonalities = personalities.filter(p => p.leaning === 'LGBTQ');
const newsPersonalities = personalities.filter(p => p.leaning === 'News');
const religiousPersonalities = personalities.filter(p => p.leaning === 'Religious');

const Personalities: React.FC = () => {
  const [selectedPersonality, setSelectedPersonality] = useState<Personality | null>(conservativePersonalities[0]);
  const [activeTab, setActiveTab] = useState<'Conservative' | 'Liberal' | 'Independent' | 'World Languages' | 'World Finances' | 'LGBTQ' | 'News' | 'Religious'>('Conservative');
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPersonality) {
      fetchFeed(selectedPersonality.rssFeedUrl);
    }
  }, [selectedPersonality]);

  const fetchFeed = async (feedUrl: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // We will create this backend endpoint next
      const response = await axios.get('/api/personalities/feed', {
        params: { url: feedUrl },
      });
      setFeed(response.data.items);
    } catch (err) {
      setError('Failed to fetch the news feed. The backend service may not be running or the feed URL is invalid.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-900 text-white">
      {/* Sidebar with the list of personalities */}
      <aside className="w-1/4 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Personalities</h2>
        
        <div className="flex border-b border-gray-700 mb-4">
          <button 
            className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'Conservative' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('Conservative')}
          >
            Conservative
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'Liberal' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('Liberal')}
          >
            Liberal
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'Independent' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('Independent')}
          >
            Independent
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'World Languages' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('World Languages')}
          >
            World Languages
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'World Finances' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('World Finances')}
          >
            World Finances
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'LGBTQ' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('LGBTQ')}
          >
            LGBTQ
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'News' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('News')}
          >
            News
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'Religious' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('Religious')}
          >
            Religious
          </button>
        </div>

        <ul>
          {(
            activeTab === 'Conservative' ? conservativePersonalities :
            activeTab === 'Liberal' ? liberalPersonalities :
            activeTab === 'Independent' ? independentPersonalities :
            activeTab === 'World Languages' ? worldLanguagesPersonalities :
            activeTab === 'World Finances' ? worldFinancesPersonalities :
            activeTab === 'LGBTQ' ? lgbtqPersonalities :
            activeTab === 'News' ? newsPersonalities :
            religiousPersonalities
          ).map((p) => (
            <li
              key={p.name}
              className={`p-2 rounded cursor-pointer ${selectedPersonality?.name === p.name ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setSelectedPersonality(p)}
            >
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-400">{p.category}</div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content area for displaying the feed */}
      <main className="w-3/4 p-6 overflow-y-auto">
        {selectedPersonality && (
          <h1 className="text-3xl font-bold mb-6">Feed for {selectedPersonality.name}</h1>
        )}

        {isLoading && <p>Loading feed...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && !error && (
          <div className="space-y-4">
            {feed.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-blue-400">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{new Date(item.pubDate).toLocaleString()}</p>
                <p className="text-gray-300 mt-2">{item.contentSnippet}</p>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Personalities;
