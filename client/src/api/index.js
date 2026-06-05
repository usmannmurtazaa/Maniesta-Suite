// Centralized API client for future backend calls or Firebase Cloud Functions.
// Currently used as a thin wrapper, but allows easy swapping of backends later.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || `API error: ${response.status}`);
  }
  return response.json();
}

// Example: contact form submission (could be moved from EmailJS)
export const submitContactForm = (data) => {
  // Placeholder: for now, EmailJS handles this, but you could call a serverless function here
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Example: fetch user stats
export const fetchStats = () => request('/api/stats');