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
// Forced to use Deployed Backend as per user request
export const API_BASE_URL = PROD_API_URL;

// Optional: WebSocket URLs
export const WS_BASE_URL = "wss://focusforge-backend-jsji.onrender.com";

console.log(`[FocusForge] Running in ${IS_PRODUCTION ? 'Production' : 'Development'} mode`);
console.log(`[FocusForge] API Base URL: ${API_BASE_URL}`);
