import mongoose from 'mongoose'
import { server } from '../server'

import { User_Test } from './tests/UserTest'
import { Worker_Test } from './tests/WorkerTest'

beforeAll(async () => {
	// Connect to MongoDB
	// const url = `mongodb://127.0.0.1/test_db`
	// await mongoose.connect(url)
})

describe('Test all features', () => {
	User_Test()
	Worker_Test()
})

afterAll(async () => {
	// Closing the DB connection allows Jest to exit successfully.
	const collections = await mongoose.connection.db.collections()

	for (let collection of collections) {
		await collection.drop()
	}

	mongoose.disconnect()
	server.close()
	// done()
})
