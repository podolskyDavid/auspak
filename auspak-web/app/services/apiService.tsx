const BASE_URL = 'http://207.154.198.36:8000'; // Use the environment variable

export async function fetchData(endpoint: string, params: Record<string, any> | null = null) {
  let url: string = `${BASE_URL}/${endpoint}`;
  if (params) {
    url += `?${buildQueryString(params)}`
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  return response;
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
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return response;
}

export async function updateData(endpoint: string, params: Record<string, any> | null = null, body: Record<string, any> | null = null) {
  let url: string = `${BASE_URL}/${endpoint}`;
  if (params) {
    url += `?${buildQueryString(params)}`
  }
  
  const response = await fetch(url, {
    method: 'PUT', // Change the method to 'PUT'
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return response;
}
