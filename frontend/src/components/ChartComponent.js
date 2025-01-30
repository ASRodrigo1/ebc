import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom"; // Importando o plugin de zoom

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, zoomPlugin);

const ChartComponent = ({ title, unit, data }) => {
  const sortedData = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const chartData = {
    labels: sortedData.map(item => {
      const date = new Date(item.created_at);
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) +
             " " +
             date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }),
    datasets: [
      {
        label: `${title} (${unit})`,
        data: sortedData.map(item => item.value),
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
        pointRadius: 2, // Deixa os pontos visíveis, mas pequenos
        pointHoverRadius: 5, // Aumenta ao passar o mouse
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        ticks: {
          autoSkip: true,
          maxTicksLimit: Math.min(14, sortedData.length),
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: unit,
          font: { size: 14 },
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: title,
        font: { size: 16 },
        padding: { top: 10, bottom: 15 }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x", // Permite mover na horizontal
        },
        zoom: {
          wheel: {
            enabled: true, // Zoom com rolagem do mouse
          },
          pinch: {
            enabled: true // Zoom com pinch em touchscreens
          },
          mode: "x", // Zoom apenas na horizontal
        }
      }
    }
  };

  return (
    <div style={{ width: "90%", maxWidth: "600px", height: "300px", margin: "30px auto" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
