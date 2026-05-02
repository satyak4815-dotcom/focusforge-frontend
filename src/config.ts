/**
 * FocusForge Configuration
 * Centralized source of truth for API URLs and environment settings.
 */

// Detect if we are running in production mode
// Vite sets import.meta.env.PROD to true during build
export const IS_PRODUCTION = import.meta.env.PROD;

// Define base API URLs
const LOCAL_API_URL = "http://localhost:3000/api";
const PROD_API_URL = "https://focusforge-backend-jsji.onrender.com/api";

// Export the correct URL based on the environment
// We still check for VITE_API_URL in case we want to override via .env files
export const API_BASE_URL = import.meta.env.VITE_API_URL || (IS_PRODUCTION ? PROD_API_URL : LOCAL_API_URL);

// Optional: WebSocket URLs if needed in the future
export const WS_BASE_URL = IS_PRODUCTION
  ? "wss://focusforge-backend-jsji.onrender.com"
  : "ws://localhost:3000";

console.log(`[FocusForge] Running in ${IS_PRODUCTION ? 'Production' : 'Development'} mode`);
console.log(`[FocusForge] API Base URL: ${API_BASE_URL}`);
