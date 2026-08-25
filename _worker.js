// SaaSCritic Worker - Cloudflare Workers
// Handles redirects, security headers, and sitemap generation

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Security headers
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };

    // CORS headers for assets
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD',
    };

    // Handle sitemap.xml
    if (url.pathname === '/sitemap.xml') {
      return generateSitemap(url.origin);
    }

    // Handle robots.txt
    if (url.pathname === '/robots.txt') {
      return generateRobots(url.origin);
    }

    // Static asset serving
    const response = await fetch(request);

    // Add security headers to HTML responses
    if (response.headers.get('content-type')?.includes('text/html')) {
      const newResponse = new Response(response.body, response);
      Object.entries(securityHeaders).forEach(([key, value]) => {
        newResponse.headers.set(key, value);
      });
      return newResponse;
    }

    // Add CORS and caching to static assets
    const newResponse = new Response(response.body, response);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });

    // Cache static assets
    if (url.pathname.match(/\.(css|js|svg|png|jpg|jpeg|gif|ico|woff|woff2)$/)) {
      newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    return newResponse;
  }
};

function generateSitemap(origin) {
  const pages = [
    '/',
    '/reviews/systemeio',
    '/reviews/highlevel',
    '/reviews/semrush',
    '/reviews/thinkific',
    '/reviews/kit',
    '/reviews/activecampaign',
    '/comparisons/systemeio-vs-activecampaign',
    '/comparisons/thinkific-vs-teachable',
    '/comparisons/semrush-vs-ahrefs',
    '/best/email-marketing',
    '/tools/',
    '/tools/finder',
    '/tools/calculator',
    '/tools/stack-builder',
    '/about/',
    '/about/methodology',
    '/about/affiliate-disclosure',
    '/privacy/',
    '/cookies/',
    '/terms/',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${origin}/en${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function generateRobots(origin) {
  const robots = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml

# AI Crawlers
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
