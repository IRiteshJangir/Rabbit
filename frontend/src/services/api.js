// API base URL
const API_BASE_URL = "http://localhost:3000/api";

// Helper function to get token from localStorage
const getToken = () => localStorage.getItem("token");

// Helper function to make authenticated requests
export const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// User endpoints
export const userAPI = {
  register: (userData) => apiCall("/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiCall("/users/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }),

  profile: () => apiCall("/users/profile", {
    method: "GET",
  }),
};

// Checkout endpoints
export const checkoutAPI = {
  create: (checkoutData) => apiCall("/checkout", {
    method: "POST",
    body: JSON.stringify(checkoutData),
  }),

  getById: (id) => apiCall(`/checkout/${id}`, {
    method: "GET",
  }),
};

// Product endpoints
export const productAPI = {
  getAll: () => apiCall("/products", {
    method: "GET",
  }),

  getById: (id) => apiCall(`/products/${id}`, {
    method: "GET",
  }),
};

// Cart endpoints
export const cartAPI = {
  getCart: () => apiCall("/cart", {
    method: "GET",
  }),

  addItem: (cartData) => apiCall("/cart", {
    method: "POST",
    body: JSON.stringify(cartData),
  }),
};

export default apiCall;
