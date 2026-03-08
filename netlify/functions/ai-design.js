// Netlify Serverless Function — Anthropic API 프록시
// Node.js 내장 https 모듈 사용 (global fetch 불안정 이슈 방지)

const https = require('https');

function httpsPost(url, headers, bodyData) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: { ...headers, 'Content-Length': Buffer.byteLength(bodyData) },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(bodyData);
    req.end();
  });
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: '허용되지 않는 메서드입니다' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'API 키가 설정되지 않았습니다' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    if (!body.messages || !Array.isArray(body.messages)) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '잘못된 요청 형식입니다' }) };
    }

    const requestBody = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 700,
      system: body.system || '',
      messages: body.messages,
    });

    const { status, body: responseBody } = await httpsPost(
      'https://api.anthropic.com/v1/messages',
      {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      requestBody
    );

    if (status !== 200) {
      let errMsg = `Anthropic API 오류 (${status})`;
      try { const e = JSON.parse(responseBody); errMsg = e.error?.message || errMsg; } catch {}
      return { statusCode: status >= 500 ? 502 : status, headers: CORS_HEADERS, body: JSON.stringify({ error: errMsg }) };
    }

    return { statusCode: 200, headers: CORS_HEADERS, body: responseBody };
  } catch (error) {
    console.error('ai-design error:', error);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: error.message || '서버 내부 오류' }) };
  }
};
