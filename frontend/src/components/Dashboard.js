import React, { useEffect, useState } from "react";
import ChartComponent from "./ChartComponent";
import axios from "axios";

const API_URL = "http://147.93.66.207:8000/entries?limit=1000";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para indicar carregamento
  const [error, setError] = useState(null); // Estado para armazenar erros

  useEffect(() => {
    console.log("🔄 Buscando dados da API...");

    axios.get(API_URL)
      .then(response => {
        console.log("✅ Dados recebidos:", response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ Erro ao buscar dados:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>Erro ao carregar dados: {error}</p>;

  return (
    <div>
      <h1>Dashboard EBC</h1>
      {data.length > 0 ? (
        <>
          <ChartComponent title="Staking Dollars" data={data.map(d => ({ created_at: d.created_at, value: d.staking_dollars }))} />
          <ChartComponent title="Staking EBC" data={data.map(d => ({ created_at: d.created_at, value: d.staking_ebc }))} />
          <ChartComponent title="Holders" data={data.map(d => ({ created_at: d.created_at, value: d.staking_holders }))} />
          <ChartComponent title="EBC Value" data={data.map(d => ({ created_at: d.created_at, value: d.ebc_value }))} />
          <ChartComponent title="Market Cap" data={data.map(d => ({ created_at: d.created_at, value: d.market_cap }))} />
        </>
      ) : (
        <p>Nenhum dado disponível.</p>
      )}
    </div>
  );
};

export default Dashboard;
