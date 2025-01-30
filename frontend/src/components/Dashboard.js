import React, { useEffect, useState } from "react";
import ChartComponent from "./ChartComponent";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/entries/?limit=4032`;


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

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px", color: "#333" }}>
        📊 Staking e Mercado do EBC
      </h1>
      {data.length > 0 ? (
        <>
          <ChartComponent
            title="Valor Total em Staking"
            unit="USD"
            data={data.map(d => ({ created_at: d.created_at, value: d.staking_dollars }))}
          />
          <ChartComponent
            title="Quantidade de EBC em Staking"
            unit="EBC"
            data={data.map(d => ({ created_at: d.created_at, value: d.staking_ebc }))}
          />
          <ChartComponent
            title="Número Total de Holders"
            unit="Holders"
            data={data.map(d => ({ created_at: d.created_at, value: d.staking_holders }))}
          />
          <ChartComponent
            title="Preço do EBC"
            unit="USD"
            data={data.map(d => ({ created_at: d.created_at, value: d.ebc_value }))}
          />
          <ChartComponent
            title="Valor de Mercado (Market Cap)"
            unit="USD"
            data={data.map(d => ({ created_at: d.created_at, value: d.market_cap }))}
          />
        </>
      ) : (
        <p>Nenhum dado disponível.</p>
      )}
    </div>
  );
};

export default Dashboard;
