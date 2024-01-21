const BASE_URL = 'http://130.162.220.233:8000'; // Use the environment variable

export async function fetchData(endpoint: string) {
  const response = await fetch(`${BASE_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  return response.json();
}

function buildQueryString(params: Record<string, any>): string {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return queryString;
}

export async function sendData(endpoint: string, params: Record<string, any> | null = null, body: Record<string, any> | null = null) {
  let url: string = `${BASE_URL}/${endpoint}`;
  if (params) {
    url += `?${buildQueryString(params)}`
  }
  const response = await fetch(url, { method: 'POST', headers: { accept: 'application/json', body: JSON.stringify(body) } });
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  return response.json();
}
