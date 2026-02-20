export default async function (request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url || !url.startsWith('http')) {
    return new Response('❌ Invalid URL. Must start with http:// or https://', { 
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Search-Auditor/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      return new Response(`❌ HTTP ${response.status}: ${response.statusText}`, {
        status: response.status,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const html = await response.text();
    
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 's-maxage=3600'
      }
    });
  } catch (error) {
    return new Response(`❌ Proxy error: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
