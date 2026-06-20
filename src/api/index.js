const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Core request helper.
 * @param {string} endpoint - URL path (e.g., '/api/contact')
 * @param {Object} options - Fetch options, plus optional `signal` for aborting.
 * @returns {Promise<any>} Parsed JSON response
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const { signal, ...fetchOptions } = options;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...fetchOptions,
    // Forward the AbortSignal to fetch
    ...(signal ? { signal } : {}),
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.message || errorMessage;
    } catch (parseError) {
      // If JSON parsing fails, log the raw text for debugging
      const text = await response.text().catch(() => '');
      console.error(`API ${response.status} – non‑JSON response`, text);
      errorMessage = `API error: ${response.status} (unparsable body)`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Example: contact form submission (could be moved from EmailJS)
export const submitContactForm = (data, options = {}) => {
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
    ...options, // allows passing signal etc.
  });
};

// Example: fetch user stats
export const fetchStats = (options = {}) => request('/api/stats', options);