import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CryptoChartProps {
  coinId?: string;
  days?: number;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ coinId = 'bitcoin', days = 7 }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/crypto/chart/${coinId}?days=${days}`
        );
        
        if (response.data.success) {
          const prices = response.data.data.prices;
          
          setChartData({
            labels: prices.map((p: [number, number]) => 
              new Date(p[0]).toLocaleDateString()
            ),
            datasets: [
              {
                label: `${coinId.toUpperCase()} Price (USD)`,
                data: prices.map((p: [number, number]) => p[1]),
                borderColor: 'rgb(34, 211, 238)',
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                fill: true,
                tension: 0.4,
              },
            ],
          });
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [coinId, days]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#fff',
        },
      },
      title: {
        display: true,
        text: `${coinId.toUpperCase()} Price Chart (${days} Days)`,
        color: '#22d3ee',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: '#374151',
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
          callback: (value: any) => '$' + value.toLocaleString(),
        },
        grid: {
          color: '#374151',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-cyan-500 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-cyan-500 rounded-lg p-6">
      <div className="h-96">
        {chartData && <Line data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default CryptoChart;
