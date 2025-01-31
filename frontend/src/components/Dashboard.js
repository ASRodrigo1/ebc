import React, { useEffect, useState } from "react";
import ChartComponent from "./ChartComponent";
import axios from "axios";
import "./Dashboard.css";

const API_URL = "http://147.93.66.207:8000/entries/?limit=4032";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) Buscar dados da API (vem DECRESCENTE: [0] = mais RECENTE, [final] = mais ANTIGO)
  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        // Mantemos como está (decrescente)
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar dados:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>Erro ao carregar dados: {error}</p>;

  // 2) Filtra últimos 24h mantendo ordem decrescente
  const now = new Date();
  const last24hData = data.filter(d => (now - new Date(d.created_at)) <= 24 * 60 * 60 * 1000);

  // 3) Calcula estatísticas (DECRESCENTE => dataset[0] é o mais recente)
  const calculateStats = (dataset, key) => {
    if (dataset.length === 0) {
      return { min: "N/A", max: "N/A", current: "N/A", change: "N/A" };
    }
    // Array de valores
    const values = dataset.map(d => d[key]);

    const min = Math.min(...values);
    const max = Math.max(...values);

    // Mais recente (atual) é o índice 0 em ordem decrescente
    const current = values[0];

    // O valor mais antigo do período está no final do array
    const firstValue = values[values.length - 1] || 0;

    // Evitar divisão por zero
    let change = "N/A";
    if (firstValue !== 0) {
      change = ((current - firstValue) / firstValue) * 100;
    }

    return { min, max, current, change };
  };

  // 4) Cria objeto com as estatísticas para cada métrica, usando dados das últimas 24h
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

      {/* Estatísticas */}
      <div className="stats-container">
        {Object.entries(stats).map(([key, { max, min, current, change }]) => (
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
                ? current.toLocaleString() + (
                    ["staking_dollars", "ebc_value", "market_cap"].includes(key)
                      ? " USD"
                      : " EBC"
                  )
                : "N/A"}
            </p>
            <p>🔺 Máx: {max !== "N/A" ? max.toLocaleString() : "N/A"}</p>
            <p>🔻 Mín: {min !== "N/A" ? min.toLocaleString() : "N/A"}</p>
            <p>📉 Variação 24h: {change !== "N/A" ? `${change.toFixed(2)}%` : "N/A"}</p>
          </div>
        ))}
      </div>

      {/* Gráficos em duas colunas */}
      <div className="charts-container">
        <div className="chart-grid">
          <ChartComponent
            title="Valor Total em Staking"
            unit="USD"
            // Passa ao gráfico a cópia invertida (ASC) para exibir do mais antigo -> mais recente
            data={[...data].reverse().map(d => ({
              created_at: d.created_at,
              value: d.staking_dollars
            }))}
          />
          <ChartComponent
            title="Quantidade de EBC em Staking"
            unit="EBC"
            data={[...data].reverse().map(d => ({
              created_at: d.created_at,
              value: d.staking_ebc
            }))}
          />
          <ChartComponent
            title="Número Total de Holders"
            unit="Holders"
            data={[...data].reverse().map(d => ({
              created_at: d.created_at,
              value: d.staking_holders
            }))}
          />
          <ChartComponent
            title="Preço do EBC"
            unit="USD"
            data={[...data].reverse().map(d => ({
              created_at: d.created_at,
              value: d.ebc_value
            }))}
          />
        </div>

        <div className="chart-full">
          <ChartComponent
            title="Valor de Mercado (Market Cap)"
            unit="USD"
            data={[...data].reverse().map(d => ({
              created_at: d.created_at,
              value: d.market_cap
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
