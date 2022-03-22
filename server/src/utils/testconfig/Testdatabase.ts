import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'

let connection: any
let mongoServer: any

const connect = async () => {
	try {
		mongoServer = await MongoMemoryServer.create()
		const uri = await mongoServer.getUri()
		connection = await MongoClient.connect(uri, {}, (err) => {
			if (err) {
				console.log(err)
			}
		})
		console.log(connection)
	} catch (err) {
		console.log('Mongodb memory server Error', err)
	}
}

const close = async () => {
	try {
		await mongoose.connection.dropDatabase()
		await mongoose.disconnect()
		await mongoServer.stop()
	} catch (err) {}
}

const clear = async () => {
	const collections = mongoose.connection.collections
	for (const key in collections) {
		await collections[key].deleteMany({})
	}
}

export default { connect, close, clear }
