export default async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return new Response('Missing BUTTONDOWN_API_KEY env var', { status: 500 });
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { email, tags = [] } = body;
  if (!email || !email.includes('@')) {
    return new Response('Valid email required', { status: 400 });
  }

  const response = await fetch('https://api.buttondown.com/v1/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, tags })
  });

  const data = await response.json();

  if (!response.ok) {
    return new Response(JSON.stringify(data), { status: response.status });
  }

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}