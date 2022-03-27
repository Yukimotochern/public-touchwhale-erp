import app from '../../server'
import request from 'supertest'
import UserModel from '../../../src/features/user/userModel'

let token: string
let worker_data: any

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
		it('POST Create a worker', async () => {
			const res = await RequestServer.post('/api/v1/user/workers')
				.set('Cookie', [`token=${token}`])
				.send({
					login_name: 'testworker1234',
					password: 'test1234',
					permission_groups: ['admin'],
					role_type: 'default',
				})
			expect(res.status).toBe(200)
		})

		it('GET User signout', async () => {
			const res = await RequestServer.get('/api/v1/user/signOut')

			expect(res.status).toBe(200)
		})

		it('POST Worker signin', async () => {
			const res = await RequestServer.post('/api/v1/user/signIn')
				.send({
					login_name: 'testworker1234',
					password: 'test1234',
				})
				.set('Accept', 'application/json')

			expect(res.status).toBe(200)
		})

		it('GET Worker signout', async () => {
			const res = await RequestServer.get('/api/v1/user/signOut')

			expect(res.status).toBe(200)
		})

		// it('POST Signin admin user', async () => {
		// 	const res = await RequestServer.post('/api/v1/user/signIn')
		// 		.send({
		// 			email: 'testEmail@gmail.com',
		// 			password: 'test3456',
		// 		})
		// 		.set('Accept', 'application/json')

		// 	expect(res.status).toBe(200)
		// 	token = res.body
		// })

		it('POST Create another worker', async () => {
			const a = await RequestServer.post('/api/v1/user/signIn')
				.send({
					email: 'testEmail@gmail.com',
					password: 'test3456',
				})
				.set('Accept', 'application/json')

			token = a.body

			const res = await RequestServer.post('/api/v1/user/workers')
				.set('Cookie', [`token=${token}`])
				.send({
					login_name: 'testworker2234',
					password: 'test2234',
					permission_groups: ['human resource'],
					role_type: 'default',
				})
			expect(res.status).toBe(200)
		})

		it('GET Get all workers', async () => {
			const res = await RequestServer.get('/api/v1/user/workers').set(
				'Cookie',
				[`token=${token}`]
			)

			expect(res.status).toBe(200)
			expect(typeof res.body.data).toBe('object')
			worker_data = await UserModel.findOne({ isOwner: false })
		})

		it('GET Get single worker', async () => {
			const res = await RequestServer.get(
				`/api/v1/user/workers/${worker_data._id}`
			).set('Cookie', [`token=${token}`])

			expect(res.status).toBe(200)
			expect(typeof res.body.data).toBe('object')
		})

		it('PUT Update a worker', async () => {
			const res = await RequestServer.put(
				`/api/v1/user/workers/${worker_data._id}`
			)
				.set('Cookie', [`token=${token}`])
				.send({
					permission_groups: ['admin'],
				})

			expect(res.status).toBe(200)
		})

		it('DELETE Delete a worker', async () => {
			const res = await RequestServer.delete(
				`/api/v1/user/workers/${worker_data._id}`
			).set('Cookie', [`token=${token}`])

			expect(res.status).toBe(200)
			expect(res.body.message).toBe(
				'The user in the data is successfully deleted.'
			)
		})
	})
}
