import * as fs from 'fs';
import * as path from 'path';

const keysPath = path.join(__dirname, 'keys.json');

interface ApiKeys {
  GOOGLE_MAPS_API_KEY: string;
  TWELVEDATA_API_KEY_PRIMARY: string;
  TWELVEDATA_API_KEY_OLD: string;
  FINNHUB_API_KEY_PRIMARY: string;
  FINNHUB_API_KEY_OLD: string;
  POLYGON_API_KEY_PRIMARY: string;
  POLYGON_API_KEY_OLD: string;
  OPENEXCHANGERATES_API_KEY_PRIMARY: string;
  OPENEXCHANGERATES_API_KEY_OLD: string;
  COINGECKO_API_KEY: string;
  MARKETSTACK_API_KEY_PRIMARY: string;
  MARKETSTACK_API_KEY_OLD: string;
  ALPHAVANTAGE_API_KEY_PRIMARY: string;
  ALPHAVANTAGE_API_KEY_OLD: string;
  FRED_API_KEY: string;
  SPORTSDATAIO_NFL_API_KEY: string;
  ABUSEIPDB_API_KEY: string;
  NEWSDATA_API_KEY: string;
}

let apiKeys: ApiKeys;

try {
  const keysFile = fs.readFileSync(keysPath, 'utf-8');
  apiKeys = JSON.parse(keysFile);
} catch (error) {
  console.error('Error reading or parsing API keys file:', error);
  // In a real application, you might want to throw an error or exit
  // For now, we'll create a dummy object to avoid crashing the server
  apiKeys = {
    GOOGLE_MAPS_API_KEY: "",
    TWELVEDATA_API_KEY_PRIMARY: "",
    TWELVEDATA_API_KEY_OLD: "",
    FINNHUB_API_KEY_PRIMARY: "",
    FINNHUB_API_KEY_OLD: "",
    POLYGON_API_KEY_PRIMARY: "",
    POLYGON_API_KEY_OLD: "",
    OPENEXCHANGERATES_API_KEY_PRIMARY: "",
    OPENEXCHANGERATES_API_KEY_OLD: "",
    COINGECKO_API_KEY: "",
    MARKETSTACK_API_KEY_PRIMARY: "",
    MARKETSTACK_API_KEY_OLD: "",
    ALPHAVANTAGE_API_KEY_PRIMARY: "",
    ALPHAVANTAGE_API_KEY_OLD: "",
    FRED_API_KEY: "",
    SPORTSDATAIO_NFL_API_KEY: "",
    ABUSEIPDB_API_KEY: "",
    NEWSDATA_API_KEY: "",
  };
}

export default apiKeys;
