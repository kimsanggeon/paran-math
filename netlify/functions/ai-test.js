// 진단용 테스트 함수 — AI 디자인이 안 될 때 원인 파악용
exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const apiKey = process.env.ANTHROPIC_API_KEY;

  const result = {
    function_reached: true,
    api_key_set: !!apiKey,
    api_key_prefix: apiKey ? apiKey.substring(0, 10) + '...' : '없음',
    node_version: process.version,
    timestamp: new Date().toISOString(),
  };

  // API 키가 있으면 실제 Anthropic 연결도 테스트
  if (apiKey) {
    try {
      const https = require('https');
      const testBody = JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'hi' }],
      });

      const response = await new Promise((resolve, reject) => {
        const req = https.request({
          hostname: 'api.anthropic.com',
          path: '/v1/messages',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Length': Buffer.byteLength(testBody),
          },
        }, (res) => {
          let data = '';
          res.on('data', c => data += c);
          res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        req.write(testBody);
        req.end();
      });

      result.anthropic_status = response.status;
      if (response.status === 200) {
        result.anthropic_connected = true;
        result.message = '✅ 모든 설정이 정상입니다!';
      } else {
        const err = JSON.parse(response.body);
        result.anthropic_connected = false;
        result.anthropic_error = err.error?.message || response.body;
        result.message = '❌ Anthropic API 오류: ' + result.anthropic_error;
      }
    } catch (e) {
      result.anthropic_connected = false;
      result.anthropic_error = e.message;
      result.message = '❌ 연결 오류: ' + e.message;
    }
  } else {
    result.message = '❌ ANTHROPIC_API_KEY 환경변수가 없습니다. 재배포 했나요?';
  }

  return { statusCode: 200, headers: CORS, body: JSON.stringify(result, null, 2) };
};
