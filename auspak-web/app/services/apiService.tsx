const BASE_URL = 'http://130.162.220.233:8000'; // Use the environment variable

async function fetchData(endpoint: string) {
  const response = await fetch(`${BASE_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  return response.json();
}

export default fetchData;