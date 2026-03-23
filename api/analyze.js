// ESM 방식 (package.json "type":"module" 환경)
import https from 'https';

function callAnthropic(apiKey, model, prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
    }, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: { error: { message: data } } }); }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error('timeout')));
    req.write(body);
    req.end();
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  if (!apiKey.startsWith('sk-ant-')) {
    return res.status(500).json({ error: 'API key format invalid', detail: 'API 키가 sk-ant-로 시작해야 합니다.' });
  }

  const { prompt, studentName } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  const models = [
    'claude-3-5-haiku-20241022',
    'claude-haiku-4-5-20251001',
    'claude-3-haiku-20240307',
  ];

  let lastDetail = '';
  for (const model of models) {
    try {
      const { status, body } = await callAnthropic(apiKey, model, prompt);

      if (status === 200) {
        const text = body.content?.find(c => c.type === 'text')?.text || '';
        return res.status(200).json({ result: text, studentName, model });
      }

      const errMsg = body?.error?.message || JSON.stringify(body);
      lastDetail = `[${model}] ${errMsg}`;

      if (status === 401) return res.status(401).json({ error: 'Anthropic API error', detail: '인증 실패: API 키를 확인해 주세요.' });
      if (status === 402 || status === 529) return res.status(status).json({ error: 'Anthropic API error', detail: '크레딧 부족: https://console.anthropic.com/settings/billing 에서 확인해 주세요.' });
      if (status === 429) return res.status(429).json({ error: 'Anthropic API error', detail: '요청 한도 초과: 잠시 후 다시 시도해 주세요.' });
      // 404 = 모델 없음 → 다음 모델 시도
    } catch (err) {
      lastDetail = `[${model}] ${err.message}`;
    }
  }

  return res.status(500).json({ error: 'All models failed', detail: lastDetail });
}
