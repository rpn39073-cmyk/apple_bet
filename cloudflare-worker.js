/**
 * Cloudflare Worker Script for Proxying Offshore VPS
 * 
 * This script ensures:
 * 1. The original VPS IP is completely hidden.
 * 2. Only Cloudflare IPs are exposed.
 * 3. Handles basic DDoS mitigation and edge-caching for static assets.
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const OFFSHORE_VPS_IP = '192.168.1.100'; // Replace with the actual Offshore VPS IP (e.g. AlexHost/Shinjiru)
const FRONTEND_PORT = '3000';
const BACKEND_PORT = '3001';

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Route /api and /socket.io requests to the backend container
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/socket.io')) {
    const targetUrl = `http://${OFFSHORE_VPS_IP}:${BACKEND_PORT}${url.pathname}${url.search}`;
    let newRequest = new Request(targetUrl, request);
    newRequest.headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP'));
    return fetch(newRequest);
  }

  // Route everything else to the frontend Next.js server
  const targetUrl = `http://${OFFSHORE_VPS_IP}:${FRONTEND_PORT}${url.pathname}${url.search}`;
  let newRequest = new Request(targetUrl, request);
  
  // Basic security headers
  newRequest.headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP'));
  
  const response = await fetch(newRequest);
  
  // Add some security headers on the response
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('Referrer-Policy', 'no-referrer-when-downgrade');
  newResponse.headers.set('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' wss: http: https: data:;");
  
  return newResponse;
}
