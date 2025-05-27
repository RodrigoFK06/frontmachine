// Helper para hacer fetch requests con headers de ngrok incluidos automáticamente

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Headers estándar para todas las llamadas API (incluyendo ngrok)
export const getApiHeaders = (additionalHeaders: Record<string, string> = {}): Record<string, string> => {
  return {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Evita advertencias de ngrok
    Accept: "application/json",
    ...additionalHeaders,
  }
}

// Wrapper para fetch que incluye automáticamente los headers necesarios
export const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`

  console.log(`🌐 Making API request to: ${url}`)

  const response = await fetch(url, {
    headers: getApiHeaders(options.headers as Record<string, string>),
    ...options,
  })

  console.log(`📡 API Response: ${response.status} ${response.statusText}`)

  return response
}

// Helper para hacer requests GET con manejo de errores\
export const apiGet = async <T>(endpoint: string)
: Promise<T> =>
{
  const response = await apiFetch(endpoint, { method: "GET" })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Helper para hacer requests POST con manejo de errores
export const apiPost = async <T>(endpoint: string, data: any)
: Promise<T> =>
{
  const response = await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Helper para hacer requests PUT con manejo de errores
export const apiPut = async <T>(endpoint: string, data: any)
: Promise<T> =>
{
  const response = await apiFetch(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Helper para hacer requests DELETE con manejo de errores
export const apiDelete = async <T>(endpoint: string)
: Promise<T> =>
{
  const response = await apiFetch(endpoint, { method: "DELETE" })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}
