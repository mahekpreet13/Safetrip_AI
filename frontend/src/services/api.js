const API_BASE_URL = 'http://127.0.0.1:8000'

async function handleResponse(response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.detail || `Request failed with status ${response.status}`)
  }
  return response.json()
}

export async function fetchCrimeSummary(city) {
  const response = await fetch(`${API_BASE_URL}/crime-summary?city=${encodeURIComponent(city)}`)
  return handleResponse(response)
}

export async function searchLocation(query) {
  const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`)
  return handleResponse(response)
}
export async function fetchHeatmap(city) {
  const response = await fetch(`${API_BASE_URL}/heatmap?city=${encodeURIComponent(city)}`)
  return handleResponse(response)
}
export async function fetchCrimeTrends(city) {
  const response = await fetch(`${API_BASE_URL}/crime-trends?city=${encodeURIComponent(city)}`)
  return handleResponse(response)
}
export async function fetchAiSummary(city) {
  // Adjust this path once Mahek confirms her actual endpoint name/shape
  const response = await fetch(`${API_BASE_URL}/ai-summary?city=${encodeURIComponent(city)}`)
  return handleResponse(response)
}