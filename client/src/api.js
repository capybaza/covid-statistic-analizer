const API_BASE_URL = 'http://localhost:8000';

export async function fetchHello() {
    const response = await fetch(`${API_BASE_URL}/covid/hello`);
    const data = await response.json();
    return data;
}