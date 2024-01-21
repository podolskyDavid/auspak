const BASE_URL = 'http://130.162.220.233:8000'; // Use the environment variable

export async function fetchData(endpoint: string) {
  const response = await fetch(`${BASE_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  return response.json();
}


export async function sendData(endpoint: string, body: Record<string, any>) {
  const response = await fetch(`${BASE_URL}/${endpoint}`, { method: 'POST', headers: { accept: 'application/json', body: JSON.stringify(body) } });
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  return response.json();
}
