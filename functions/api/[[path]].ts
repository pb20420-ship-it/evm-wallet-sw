/**
 * Cloudflare Pages Function for catch-all API routes
 * 
 * This is a fallback handler for routes not explicitly defined.
 * For complex implementations like /balances and /sweep, you can:
 * 1. Create specific function files (e.g., functions/api/balances/[address].ts)
 * 2. Proxy to a backend server
 * 3. Implement directly using Cloudflare Durable Objects
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // Handle /api/balances/:address
  if (url.pathname.match(/^\/api\/balances\/0x[a-fA-F0-9]{40}$/)) {
    const address = url.pathname.split('/').pop();
    
    return new Response(
      JSON.stringify({
        error: 'Balances endpoint requires backend implementation',
        note: 'This endpoint needs access to RPC providers for multiple chains.',
        address,
        message: 'Deploy src/server/index.ts to Railway/Render or use Durable Objects for complex logic',
      }),
      {
        status: 501,
        headers: corsHeaders,
      }
    );
  }

  // Handle /api/sweep
  if (url.pathname === '/api/sweep') {
    if (request.method === 'POST') {
      return new Response(
        JSON.stringify({
          error: 'Sweep endpoint requires backend implementation',
          note: 'Implement transaction preparation logic in a backend service',
          message: 'Deploy src/server/index.ts to Railway/Render for full functionality',
        }),
        {
          status: 501,
          headers: corsHeaders,
        }
      );
    }
  }

  // Default 404
  return new Response(
    JSON.stringify({
      error: 'Not Found',
      path: url.pathname,
      message: 'API endpoint not found',
    }),
    {
      status: 404,
      headers: corsHeaders,
    }
  );
};
