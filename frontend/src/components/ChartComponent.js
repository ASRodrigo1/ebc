import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom"; // Plugin de zoom

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, zoomPlugin);

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
        borderColor: "#00C896", // Verde Neon para contraste
        borderWidth: 2,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 6,
        backgroundColor: "#00C896"
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
          color: "#FFFFFF" // Letras brancas para melhor visibilidade
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: unit,
          font: { size: 14 },
          color: "#FFFFFF" // Letras brancas no eixo Y
        },
        ticks: {
          color: "#FFFFFF" // Letras brancas nos números do eixo Y
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: title,
        font: { size: 16 },
        color: "#FFFFFF", // Branco para títulos
        padding: { top: 10, bottom: 15 }
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#222",
        titleColor: "#FFF",
        bodyColor: "#FFF",
        borderColor: "#00C896",
        borderWidth: 1
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x"
        },
        zoom: {
          wheel: {
            enabled: true
          },
          pinch: {
            enabled: true
          },
          mode: "x"
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
