// Auto-fallback to Render for production if Vercel variable is not set
export const API_URL = import.meta.env.VITE_API_URL || 'https://brent-street-pizza.onrender.com';