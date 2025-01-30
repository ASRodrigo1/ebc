import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const ChartComponent = ({ title, data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.created_at).toLocaleTimeString()), // Formata horário
    datasets: [
      {
        label: title,
        data: data.map(item => item.value),
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: true },
      y: { display: true }
    }
  };

  return (
    <div style={{ width: "90%", maxWidth: "600px", height: "300px", margin: "auto" }}>
      <h3>{title}</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
