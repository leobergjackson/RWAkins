const request = require('supertest')

let app

beforeAll(async () => {
  process.env.PORT = '3099'
  process.env.QIE_RPC_URL = 'https://rpc.qie.digital'
  process.env.CHAIN_ID = '1990'
  // Dynamically import ESM module
  const mod = await import('../backend/src/index.js')
  app = mod.default
})

describe('EternalVault API', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.service).toBe('eternalvault')
  })

  test('GET /api/vaults/:address returns array or object', async () => {
    const res = await request(app).get('/api/vaults/0x0000000000000000000000000000000000000000')
    expect(res.status).toBeLessThan(500)
    if (res.status === 200) {
      expect(res.body).toBeDefined()
    }
  })

  test('POST /api/vaults/create returns 201', async () => {
    const res = await request(app)
      .post('/api/vaults/create')
      .send({ owner: '0x0000', heir: '0x1111' })
    expect(res.status).toBe(201)
    expect(res.body.ok).toBe(true)
  })
})
