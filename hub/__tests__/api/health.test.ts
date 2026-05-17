import { GET } from '@/app/api/health/route'

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const response = await GET()
    const data = await response.json()
    expect(data.status).toBe('ok')
  })

  it('returns service name', async () => {
    const response = await GET()
    const data = await response.json()
    expect(data.service).toBe('kubryx-hub')
  })

  it('returns correct tool count', async () => {
    const response = await GET()
    const data = await response.json()
    expect(data.tools).toBe(8)
  })

  it('returns chain count', async () => {
    const response = await GET()
    const data = await response.json()
    expect(data.chains).toBe(4)
  })

  it('returns valid timestamp', async () => {
    const response = await GET()
    const data = await response.json()
    expect(new Date(data.timestamp).toString()).not.toBe('Invalid Date')
  })

  it('returns 200 status code', async () => {
    const response = await GET()
    expect(response.status).toBe(200)
  })
})
