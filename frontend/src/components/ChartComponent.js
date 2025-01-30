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
    labels: data.map(item => new Date(item.created_at).toLocaleTimeString()), // Datas formatadas
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

  return (
    <div>
      <h3>{title}</h3>
      <Line data={chartData} />
    </div>
  );
};

export default ChartComponent;
