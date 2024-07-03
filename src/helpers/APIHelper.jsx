import axios from "axios";

const baseUrl = "https://creo-api.kommunitas.net/v1/staking/";
const headerToken = "0x9521728bF66a867BC65A93Ece4a543D817871Eb7";
const header = {
  headers: { "X-CREO-TOKEN": headerToken },
};

const getStatistics = async () => {
  const { data } = await axios.get(baseUrl + "statistic", header);
  return data;
};
const getPastEvents = async (address) => {
  const { data } = await axios.get(
    `${baseUrl}past/?address=${address}`,
    header
  );
  return data;
};

const getChart = async () => {
  const { data } = await axios.get(baseUrl + "chart", header);
  return data;
};

const getLeaderboard = async () => {
  const { data } = await axios.get(baseUrl + "leaderboard", header);
  return data;
};

const API = {
  getStatistics,
  getPastEvents,
  getChart,
  getLeaderboard,
};

// eslint-disable-next-line react-refresh/only-export-components
export default API;
