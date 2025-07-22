/// <reference types="@cloudflare/workers-types" />

const VALID_ROUTES = [
  '/',
  '/distilled',
  '/hosepipe',
  '/about',
  '/help',
  '/cinemas',
  '/titles',
];

// Routes that accept parameters
const PARAM_ROUTES = [
  '/cinemas/', // for /cinemas/:shortname
  '/cinema-listings/', // for /cinema-listings/:cinema_shortcode
];

function isValidRoute(pathname: string): boolean {
  if (VALID_ROUTES.includes(pathname)) {
    return true;
  }

  for (const route of PARAM_ROUTES) {
    if (pathname.startsWith(route) && pathname.length > route.length) {
      return true;
    }
  }

  return false;
}

export default {
  async fetch(request: Request, env: any, _ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname.includes('.') || url.pathname.startsWith('/assets/')) {
      return await env.ASSETS.fetch(request);
    }

    if (!isValidRoute(url.pathname)) {
      const response = await env.ASSETS.fetch(
        new Request(url.origin + '/', request),
      );
      return new Response(response.body, {
        status: 404,
        statusText: 'Not Found',
        headers: response.headers,
      });
    }

    return await env.ASSETS.fetch(request);
  },
};
