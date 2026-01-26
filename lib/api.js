// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('feesmart_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.token;
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle 401 Unauthorized - token might be expired or invalid
    if (response.status === 401) {
      // Only clear auth if we're sure the token is invalid
      // Don't clear on network errors or temporary issues
      const errorData = await response.json().catch(() => ({ error: 'Unauthorized' }));
      if (errorData.error && errorData.error.includes('token')) {
        // Token is invalid, clear auth
        if (typeof window !== 'undefined') {
          localStorage.removeItem('feesmart_user');
          // Only redirect if not already on login page
          if (!window.location.pathname.startsWith('/auth')) {
            window.location.href = '/auth/login';
          }
        }
      }
      throw new Error(errorData.error || 'Unauthorized');
    }
    
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email, password, name, role, tenantName) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role, tenantName }),
    });
  },

  studentLogin: async (phone, dateOfBirth) => {
    return apiRequest('/auth/student-login', {
      method: 'POST',
      body: JSON.stringify({ phone, dateOfBirth }),
    });
  },

  parentLogin: async (phone) => {
    return apiRequest('/auth/parent-login', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  getMe: async () => {
    return apiRequest('/auth/me');
  },
};

// Students API
export const studentsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/students${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/students/${id}`);
  },

  getByUserId: async (userId) => {
    return apiRequest(`/students/user/${userId}`);
  },

  create: async (data) => {
    return apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
  },

  getDefaulters: async () => {
    return apiRequest('/students/defaulters/list');
  },

  getBatches: async () => {
    return apiRequest('/students/batches/list');
  },

  getClasses: async () => {
    return apiRequest('/students/classes/list');
  },
};

// Payments API
export const paymentsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/payments${queryString ? `?${queryString}` : ''}`);
  },

  getByStudent: async (studentId) => {
    return apiRequest(`/payments/student/${studentId}`);
  },

  create: async (data) => {
    return apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/payments/${id}`, {
      method: 'DELETE',
    });
  },
};

// Fee Heads API
export const feeHeadsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/fee-heads${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/fee-heads/${id}`);
  },

  calculate: async (className, optionalFeeHeadIds = []) => {
    const optionalIds = optionalFeeHeadIds.join(',');
    const queryString = optionalIds ? `?optionalFeeHeads=${optionalIds}` : '';
    return apiRequest(`/fee-heads/calculate/${encodeURIComponent(className)}${queryString}`);
  },

  create: async (data) => {
    return apiRequest('/fee-heads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/fee-heads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/fee-heads/${id}`, {
      method: 'DELETE',
    });
  },
};

// Attendance API
export const attendanceAPI = {
  getByStudent: async (studentId) => {
    return apiRequest(`/attendance/student/${studentId}`);
  },

  mark: async (data) => {
    return apiRequest('/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  bulkMark: async (data) => {
    return apiRequest('/attendance/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Parents API
export const parentsAPI = {
  getByEmail: async (email) => {
    return apiRequest(`/parents/email/${email}`);
  },

  getStudents: async (parentId) => {
    return apiRequest(`/parents/${parentId}/students`);
  },

  create: async (data) => {
    return apiRequest('/parents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Documents API
export const documentsAPI = {
  getByStudent: async (studentId) => {
    return apiRequest(`/documents/student/${studentId}`);
  },

  getAll: async () => {
    return apiRequest('/documents');
  },

  create: async (data) => {
    return apiRequest('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/documents/${id}`, {
      method: 'DELETE',
    });
  },
};

// Expenses API
export const expensesAPI = {
  getAll: async () => {
    return apiRequest('/expenses');
  },

  create: async (data) => {
    return apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Refunds API
export const refundsAPI = {
  getAll: async () => {
    return apiRequest('/refunds');
  },

  create: async (data) => {
    return apiRequest('/refunds', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id, status) => {
    return apiRequest(`/refunds/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Discounts API
export const discountsAPI = {
  getAll: async () => {
    return apiRequest('/discounts');
  },

  create: async (data) => {
    return apiRequest('/discounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id, status) => {
    return apiRequest(`/discounts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Payment Plans API
export const paymentPlansAPI = {
  getAll: async () => {
    return apiRequest('/payment-plans');
  },

  create: async (data) => {
    return apiRequest('/payment-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/payment-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Activity Logs API
export const activityLogsAPI = {
  getAll: async () => {
    return apiRequest('/activity-logs');
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async () => {
    return apiRequest('/notifications');
  },

  markAsRead: async (id) => {
    return apiRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  create: async (data) => {
    return apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Batches API
export const batchesAPI = {
  getAll: async () => {
    return apiRequest('/batches');
  },

  create: async (data) => {
    return apiRequest('/batches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/batches/${id}`, {
      method: 'DELETE',
    });
  },
};

// Staff API
export const staffAPI = {
  getAll: async () => {
    return apiRequest('/staff');
  },

  create: async (data) => {
    return apiRequest('/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/staff/${id}`, {
      method: 'DELETE',
    });
  },
};

// Stats API
export const statsAPI = {
  getTenantStats: async () => {
    return apiRequest('/stats/tenant');
  },

  getClassStats: async (className) => {
    return apiRequest(`/stats/class/${encodeURIComponent(className)}`);
  },

  getRevenueChart: async () => {
    return apiRequest('/stats/revenue-chart');
  },

  getPaymentStatusDistribution: async () => {
    return apiRequest('/stats/payment-status-distribution');
  },

  getPaymentReconciliation: async () => {
    return apiRequest('/stats/payment-reconciliation');
  },

  getFinancialHealthScores: async () => {
    return apiRequest('/stats/financial-health-scores');
  },

  getRevenueForecast: async () => {
    return apiRequest('/stats/revenue-forecast');
  },
};

// Tenants API
export const tenantsAPI = {
  getAll: async () => {
    return apiRequest('/tenants');
  },

  getById: async (id) => {
    return apiRequest(`/tenants/${id}`);
  },

  updateStatus: async (id, isActive) => {
    return apiRequest(`/tenants/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  },
};

