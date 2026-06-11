// src/services/currencyService.js
const API_URL = 'https://api.exchangerate-api.com/v4/latest/';
const CACHE_KEY = 'maniesta_currency_rates_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchExchangeRates(baseCurrency = 'USD') {
  // Check cache
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { rates, timestamp, base } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION && base === baseCurrency) {
      return rates;
    }
  }
  // Fetch live
  try {
    const response = await fetch(`${API_URL}${baseCurrency}`);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    const rates = data.rates;
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      rates,
      timestamp: Date.now(),
      base: baseCurrency,
    }));
    return rates;
  } catch (err) {
    // Fallback to cache (even if expired)
    const fallback = localStorage.getItem(CACHE_KEY);
    if (fallback) return JSON.parse(fallback).rates;
    throw new Error('Unable to load exchange rates. Please check your internet connection.');
  }
}

export async function convertCurrency(amount, from, to) {
  const rates = await fetchExchangeRates(from);
  const rate = rates[to];
  if (!rate) throw new Error(`Rate for ${to} not found`);
  return amount * rate;
}