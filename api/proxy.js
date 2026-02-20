const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Включаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Обработка preflight OPTIONS запросов
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Получаем параметр url
  const url = req.query.url;
  
  // Валидация URL
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({
      error: 'Invalid URL. Must start with http:// or https://'
    });
  }
  
  try {
    // Запрашиваем страницу
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Search-Auditor/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      redirect: 'follow'
    });
    
    // Проверяем статус ответа
    if (!response.ok) {
      return res.status(response.status).json({
        error: `HTTP ${response.status}: ${response.statusText}`
      });
    }
    
    // Получаем HTML
    const html = await response.text();
    
    // Возвращаем HTML с правильными заголовками
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Proxy error: ' + error.message
    });
  }
};
