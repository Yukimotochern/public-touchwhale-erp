import app, { server } from '../server'
import mongoose from 'mongoose'
import request from 'supertest'

// example
describe('POST User sign in', () => {
	it('POST /api/v1/user/signIn', async () => {
		const res = await request(app)
			.post('/api/v1/user/signIn')
			.send({
				email: 'bryanlin16899@outlook.com',
				password: '12345678',
			})
			.set('Accept', 'application/json')

		expect(res.status).toBe(200)
	})
})

afterAll((done) => {
	// Closing the DB connection allows Jest to exit successfully.
	mongoose.disconnect()
	server.close()
	done()
})
