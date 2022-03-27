import app from '../../server'
import request from 'supertest'

let token: string

const RequestServer = request(app)

export const Worker_Test = () => {
	it('SignIn a admin user', async () => {
		const res = await RequestServer.post('/api/v1/user/signIn')
			.send({
				email: 'testEmail@gmail.com',
				password: 'test3456',
			})
			.set('Accept', 'application/json')

		expect(res.status).toBe(200)
		token = res.body
	})

	describe('Worker function', () => {
		it('POST create a worker', async () => {
			const res = await RequestServer.post('/api/v1/user/workers')
				.set('Cookie', [`token=${token}`])
				.send({
					login_name: 'testworker1234',
					password: 'test1234',
					provider: 'TouchWhale',
					permission_groups: 'admin',
					role_type: 'default',
					isOwner: false,
				})
			console.log(res)
			expect(res.status).toBe(200)
		})
	})
}
