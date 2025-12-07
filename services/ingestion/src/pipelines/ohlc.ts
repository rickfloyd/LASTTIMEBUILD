import axios from 'axios';

const API_BASE = process.env.PROVIDER_BASE ?? "https://api.twelvedata.com";
const API_KEY = process.env.PROVIDER_KEY ?? "";

interface TwelveDataTimeSeries {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

interface TwelveDataResponse {
  values: TwelveDataTimeSeries[];
  status: string;
}

function normalize(raw: TwelveDataResponse): Array<{ t: number; o: number; h: number; l: number; c: number }> {
  if (raw.status !== 'ok') {
    return [];
  }

  return raw.values.map(v => ({
    t: new Date(v.datetime).getTime(),
    o: parseFloat(v.open),
    h: parseFloat(v.high),
    l: parseFloat(v.low),
    c: parseFloat(v.close),
  })).reverse(); // TwelveData sends data in reverse chronological order
}

export async function getOHLC(symbol: string): Promise<Array<{ t: number; o: number; h: number; l: number; c: number }>> {
  const url = `${API_BASE}/time_series?symbol=${encodeURIComponent(symbol)}&interval=1h&outputsize=500${API_KEY ? `&apikey=${API_KEY}` : ""}`;

  try {
    const response = await axios.get<TwelveDataResponse>(url);
    return normalize(response.data);
  } catch (error) {
    console.error('Error fetching OHLC data from TwelveData:', error);
    return [];
  }
}
