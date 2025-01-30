import React from "react";
import "./SummaryStats.css";

const calculateStats = (data, key) => {
  if (data.length === 0) return { min: "N/A", max: "N/A", change: "N/A" };

  // Obtém timestamp atual e define o intervalo de 24h
  const now = new Date();
  const last24hData = data.filter(d => (now - new Date(d.created_at)) <= 24 * 60 * 60 * 1000);

  if (last24hData.length === 0) return { min: "N/A", max: "N/A", change: "N/A" };

  // Encontra o mínimo e o máximo dentro das últimas 24h
  const min = Math.min(...last24hData.map(d => d[key]));
  const max = Math.max(...last24hData.map(d => d[key]));

  // Calcula a variação percentual das últimas 24h
  const firstValue = last24hData[0]?.[key] || 1;
  const lastValue = last24hData[last24hData.length - 1]?.[key] || 1;
  const change = ((lastValue - firstValue) / firstValue) * 100;

  return { min, max, change };
};

const SummaryStats = ({ data }) => {
  const stakingDollars = calculateStats(data, "staking_dollars");
  const ebcValue = calculateStats(data, "ebc_value");
  const marketCap = calculateStats(data, "market_cap");

  return (
    <div className="summary">
      <div className="stat">
        <h3>📈 Staking Total (USD)</h3>
        <p>🔻 Mín: ${stakingDollars.min.toFixed(2)}</p>
        <p>🔺 Máx: ${stakingDollars.max.toFixed(2)}</p>
        <p>📉 Variação 24h: {stakingDollars.change.toFixed(2)}%</p>
      </div>

      <div className="stat">
        <h3>💰 Preço EBC (USD)</h3>
        <p>🔻 Mín: ${ebcValue.min.toFixed(4)}</p>
        <p>🔺 Máx: ${ebcValue.max.toFixed(4)}</p>
        <p>📉 Variação 24h: {ebcValue.change.toFixed(2)}%</p>
      </div>

      <div className="stat">
        <h3>🏛 Market Cap (USD)</h3>
        <p>🔻 Mín: ${marketCap.min.toFixed(2)}</p>
        <p>🔺 Máx: ${marketCap.max.toFixed(2)}</p>
        <p>📉 Variação 24h: {marketCap.change.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default SummaryStats;
