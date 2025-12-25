// utils/api.js
import axios from 'axios';
//https://dailycode.dailycode.workers.dev
const API_BASE = 'https://dailycode.dailycode.workers.dev'; // Replace with your actual backend URL

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('autotoken699');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Alias for backwards compatibility
const api = axiosInstance;

export const apiCalls = {
  // ==================== AUTH ====================
  signup: (data) => api.post('/signup', data),
  signin: (data) => api.post('/signin', data),
  sendVerificationCode: (email) => api.post('/varification', { email }),
  verifyCode: (email, code) => api.post('/varifycode', { email, code }),

  // ==================== DASHBOARD ====================
  getTodayProblems: () => api.get('/dashboard/today'),
  
  // ==================== DISCOVER/FEED ====================
  getProblemFeed: (page, limit, filters) => api.post(`/problems/feed?page=${page}&limit=${limit}`, filters),
  searchProblems: (query) => api.get(`/problems/search?q=${encodeURIComponent(query)}`),
  
  // ==================== PROBLEM OPERATIONS ====================
  getProblem: (problemId) => api.get(`/problems/${problemId}/open`),
  updateProblem: (problemId, data) => api.patch(`/problems/${problemId}`, data),
  postProblem: (data) => api.post('/postproblems', data),
  deleteProblem: (problemId) => api.delete(`/problems/${problemId}`),
  toggleProblemSolved: (problemId, solved) => api.patch(`/problems/${problemId}/solved`, { solved }),
  
  // ==================== MY PROBLEMS ====================
  getStarredProblems: () => api.get('/my/problems/starred'),
  getPostedProblems: () => api.get('/my/problems/posted'),
  getRecentProblems: () => api.get('/my/problems/recent'),
  
  // ==================== HISTORY ====================
  getHistory: () => api.get('/my/problems/history'),
  getHistoryByDate: (date) => api.get(`/my/problems/history/${date}`),
  
  // ==================== STATS ====================
  getStats: () => api.get('/my/stats'),
  getDetailedStats: () => api.get('/me/stats/detailed'),
  getCalendarStats: () => api.get('/me/stats/calendar'),
  getProgressStats: (period = 30) => api.get(`/me/stats/progress?period=${period}`),
  
  // ==================== TAGS ====================
  getAllTags: () => api.get('/tags'),
  createTag: (tagName) => api.post('/tags', { tag_name: tagName }),
  createTagsBulk: (tags) => api.post('/tags/bulk', { tags }),
  
  // ==================== PROFILE ====================
  getProfile: () => api.get('/me/profile'),
  getEmails: () => api.get('/me/emails'),
  addEmail: (email) => api.post('/me/emails', { email }),
  deleteEmail: (email) => api.delete('/me/emails', { data: { email } }),
  updateMailPreferences: (data) => api.patch('/me/mail-preferences', data),
  toggleDailyMail: (enabled) => api.patch('/me/dailymail', { enabled }),
};