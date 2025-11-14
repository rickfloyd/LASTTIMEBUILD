import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ForecastCone() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch("/api/forecast/cone")
      .then((r) => r.json())
      .then(setData);
  }, []);
  if (!data) return <div className="text-gray-400">Loading forecast...</div>;
  const chartData = {
    labels: Array.from({ length: data.forecast.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "Forecast",
        data: data.forecast,
        borderColor: "#00ffff",
        fill: false,
      },
      {
        label: "Upper",
        data: data.upper,
        borderColor: "#ff00ff",
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: "Lower",
        data: data.lower,
        borderColor: "#ff00ff",
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };
  return (
    <div className="bg-black text-cyan-400 p-4 rounded-2xl">
      <h2 className="text-xl mb-2">Forecast Cone Visualizer</h2>
      <Line data={chartData} />
    </div>
  );
}
