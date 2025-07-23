// services/api.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const triggerETL = () => {
  return axios.post(`${BASE_URL}/run-etl`);
};
