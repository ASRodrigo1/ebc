import React from "react";
import "./SummaryStats.css";

const calculateStats = (data, key) => {
  const now = new Date();
  // Filtra últimos 24h, mantendo ordem decrescente
  const last24hData = data.filter(d => (now - new Date(d.created_at)) <= 24 * 60 * 60 * 1000);

  if (last24hData.length === 0) {
    return { min: "N/A", max: "N/A", current: "N/A", change: "N/A" };
  }

  const values = last24hData.map(d => d[key]);

  // min e max não dependem de ordem
  const min = Math.min(...values);
  const max = Math.max(...values);

  // "current" = índice 0 (mais recente) pois array está em ordem decrescente
  const current = values[0];

  // "primeiro valor de 24h atrás" = índice [length - 1] (mais antigo no período)
  const firstValue = values[values.length - 1];

  let change = "N/A";
  if (firstValue && firstValue !== 0) {
    change = ((current - firstValue) / firstValue) * 100;
  }

  return { min, max, current, change };
};

const SummaryStats = ({ data }) => {
  const stakingDollars = calculateStats(data, "staking_dollars");
  const ebcValue       = calculateStats(data, "ebc_value");
  const marketCap      = calculateStats(data, "market_cap");

  const formatNumber = (val, decimals = 2) =>
    val === "N/A" ? "N/A" : Number(val).toFixed(decimals);

  return (
    <div className="summary">
      {/* Staking Total (USD) */}
      <div className="stat">
        <h3>📈 Staking Total (USD)</h3>
        <p>🔻 Mín: ${formatNumber(stakingDollars.min)}</p>
        <p>🔺 Máx: ${formatNumber(stakingDollars.max)}</p>
        <p>📌 Atual: {stakingDollars.current === "N/A"
          ? "N/A"
          : `$${formatNumber(stakingDollars.current, 2)}`}
        </p>
        <p>📉 Variação 24h: {stakingDollars.change === "N/A"
          ? "N/A"
          : `${formatNumber(stakingDollars.change, 2)}%`}
        </p>
      </div>

      {/* Preço EBC (USD) */}
      <div className="stat">
        <h3>💰 Preço EBC (USD)</h3>
        <p>🔻 Mín: ${formatNumber(ebcValue.min, 4)}</p>
        <p>🔺 Máx: ${formatNumber(ebcValue.max, 4)}</p>
        <p>📌 Atual: {ebcValue.current === "N/A"
          ? "N/A"
          : `$${formatNumber(ebcValue.current, 4)}`}
        </p>
        <p>📉 Variação 24h: {ebcValue.change === "N/A"
          ? "N/A"
          : `${formatNumber(ebcValue.change, 2)}%`}
        </p>
      </div>

      {/* Market Cap (USD) */}
      <div className="stat">
        <h3>🏛 Market Cap (USD)</h3>
        <p>🔻 Mín: ${formatNumber(marketCap.min)}</p>
        <p>🔺 Máx: ${formatNumber(marketCap.max)}</p>
        <p>📌 Atual: {marketCap.current === "N/A"
          ? "N/A"
          : `$${formatNumber(marketCap.current)}`}
        </p>
        <p>📉 Variação 24h: {marketCap.change === "N/A"
          ? "N/A"
          : `${formatNumber(marketCap.change, 2)}%`}
        </p>
      </div>
    </div>
  );
};

export default SummaryStats;
