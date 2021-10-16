import axios from 'axios';

const api = axios.create({
  baseURL: 'https://system.mobs2.com/api/',
  headers: {'Content-Type': 'application/json'},
});

export default api;

// Matrícula: 9 (Teste)
// Matrícula: 55 (Vital)
// Matrícula: 60 (Villa)
