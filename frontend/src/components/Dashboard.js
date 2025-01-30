import React, { useEffect, useState } from "react";
import ChartComponent from "./ChartComponent";
import axios from "axios";
import "./Dashboard.css";

const API_URL = "http://147.93.66.207:8000/entries/?limit=4032";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>Erro ao carregar dados: {error}</p>;

  // Obtém a data atual
  const now = new Date();

  // Filtra os últimos 24h
  const last24hData = data.filter(d => (now - new Date(d.created_at)) <= 24 * 60 * 60 * 1000);

  // Função para calcular estatísticas (mínimo, máximo, variação e valor atual)
  const calculateStats = (dataset, key) => {
    if (dataset.length === 0) return { min: "N/A", max: "N/A", change: "N/A", current: "N/A" };

    const values = dataset.map(d => d[key]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const current = values[values.length - 1];

    // Cálculo da variação percentual com base no primeiro valor das últimas 24h
    const firstValue = values[0] || 0;
    const change = firstValue ? ((current - firstValue) / firstValue) * 100 : "N/A";

    return { min, max, change, current };
  };

  // Calcula as estatísticas para cada métrica
  const stats = {
    staking_dollars: calculateStats(last24hData, "staking_dollars"),
    staking_ebc: calculateStats(last24hData, "staking_ebc"),
    staking_holders: calculateStats(last24hData, "staking_holders"),
    ebc_value: calculateStats(last24hData, "ebc_value"),
    market_cap: calculateStats(last24hData, "market_cap"),
  };

  return (
    <div className="dashboard-container">
      <h1>📊 Staking e Mercado do EBC</h1>

      {/* Estatísticas das últimas 24h */}
      <div className="stats-container">
        {Object.entries(stats).map(([key, { max, min, change, current }]) => (
          <div className="stat-box" key={key}>
            <h3>
              {key === "staking_dollars" && "💰 Staking (USD)"}
              {key === "staking_ebc" && "🪙 Staking (EBC)"}
              {key === "staking_holders" && "👥 Holders"}
              {key === "ebc_value" && "📈 Valor EBC"}
              {key === "market_cap" && "🏛 Market Cap"}
            </h3>
            <p>
              📌 Atual:{" "}
              {current !== "N/A"
                ? `${current.toLocaleString()} ${key === "staking_dollars" || key === "ebc_value" || key === "market_cap" ? "USD" : "EBC"}`
                : "N/A"}
            </p>
            <p>🔺 Máx: {max !== "N/A" ? `${max.toLocaleString()} ${key === "staking_dollars" || key === "ebc_value" || key === "market_cap" ? "USD" : "EBC"}` : "N/A"}</p>
            <p>🔻 Mín: {min !== "N/A" ? `${min.toLocaleString()} ${key === "staking_dollars" || key === "ebc_value" || key === "market_cap" ? "USD" : "EBC"}` : "N/A"}</p>
            <p>📉 Variação 24h: {change !== "N/A" ? `${change.toFixed(2)}%` : "N/A"}</p>
          </div>
        ))}
      </div>

      {/* Gráficos em duas colunas */}
      <div className="charts-container">
        <div className="chart-grid">
          <ChartComponent title="Valor Total em Staking" unit="USD" data={data.map(d => ({ created_at: d.created_at, value: d.staking_dollars }))} />
          <ChartComponent title="Quantidade de EBC em Staking" unit="EBC" data={data.map(d => ({ created_at: d.created_at, value: d.staking_ebc }))} />
          <ChartComponent title="Número Total de Holders" unit="Holders" data={data.map(d => ({ created_at: d.created_at, value: d.staking_holders }))} />
          <ChartComponent title="Preço do EBC" unit="USD" data={data.map(d => ({ created_at: d.created_at, value: d.ebc_value }))} />
        </div>
        <div className="chart-full">
          <ChartComponent title="Valor de Mercado (Market Cap)" unit="USD" data={data.map(d => ({ created_at: d.created_at, value: d.market_cap }))} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
