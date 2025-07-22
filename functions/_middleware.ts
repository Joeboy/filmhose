interface Env {
  // Add any environment variables you might use
}

interface EventContext<Env = any, P = any, Data = any> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: P;
  data: Data;
}

type PagesFunction<Env = any, Params = any, Data = any> = (
  context: EventContext<Env, Params, Data>,
) => Response | Promise<Response>;

// Define your valid routes
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

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);

  // Skip route checking for static assets
  if (url.pathname.includes('.') || url.pathname.startsWith('/assets/')) {
    return next();
  }

  // For right now, we check for url.search here in an effort to persuade
  // google that we don't have urls that use query parameters anymore. Which
  // is true, for the time being.
  if (!isValidRoute(url.pathname) || url.search) {
    // Get the index.html content but return with 404 status
    const response = await next();
    return new Response(response.body, {
      status: 404,
      statusText: 'Not Found',
      headers: response.headers,
    });
  }

  return next();
};
