export const buildUrl = (path: string, params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()
  return query ? `${path}?${query}` : path
}
