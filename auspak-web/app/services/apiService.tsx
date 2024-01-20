const BASE_URL = 'http://130.162.220.233:8000'; // Replace with your FastAPI server URL

async function fetchData(endpoint: string) {
  const response = await fetch(`${BASE_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  return response.json();
}

export default fetchData;