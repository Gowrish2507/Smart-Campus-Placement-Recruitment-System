import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle unauthenticated responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired/invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me')
};

// Jobs Services
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  getRecruiterJobs: () => api.get('/jobs/recruiter'),
  create: (data) => api.post('/jobs', data),
  updateStatus: (id, status) => api.patch(`/jobs/${id}/status?status=${status}`)
};

// Application Services
export const applicationAPI = {
  apply: (data) => api.post('/applications/apply', data),
  getMyApplications: () => api.get('/applications/my'),
  getJobApplicants: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
  getById: (id) => api.get(`/applications/${id}`)
};

// Interview Services
export const interviewAPI = {
  schedule: (data) => api.post('/interviews/schedule', data),
  getStudentInterviews: () => api.get('/interviews/student'),
  getRecruiterInterviews: () => api.get('/interviews/recruiter'),
  updateResult: (id, data) => api.patch(`/interviews/${id}/result`, data)
};

// Student Profile Services
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  addSkill: (data) => api.post('/students/skills', data),
  removeSkill: (skillId) => api.delete(`/students/skills/${skillId}`),
  getAllStudents: () => api.get('/students')
};

// Analytics Services
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard')
};

// Company Services
export const companyAPI = {
  getAll: () => api.get('/companies'),
  getById: (id) => api.get(`/companies/${id}`)
};

export default api;
