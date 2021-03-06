import mongoose from 'mongoose'

const connectDB = async () => {
	try {
		let connect
		if (process.env.NODE_ENV === 'test') {
			console.log('------Test Mode------'.bgYellow)
			connect = await mongoose.connect(process.env.MONGO_URI_TEST)
		} else {
			connect = await mongoose.connect(process.env.MONGO_URI)
		}
		console.log(
			`[server] MongoDB Connected: ${connect.connection.host}`.cyan.underline
				.bold
		)
	} catch (err: any) {
		if (typeof err.message === 'string') {
			console.error(
				'Cannot Start MongoDB Connection With the Following Error: ',
				err.message
			)
		} else {
			console.error(`Unknown thing thrown: ${err}`)
		}
		// Exit process with failure
		process.exit(1)
	}
}

export interface MongooseStatics {
	_id: string
	__v: number
}
export const MongooseStaticsJSONSchema = {
	_id: { type: 'string' },
	__v: { type: 'number' },
} as const

export interface MongooseStamps {
	createdAt: Date | string
	updatedAt: Date | string
}

export const MongooseStampsJSONSchema = {
	createdAt: {
		anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
	},
	updatedAt: {
		anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
	},
} as const

export default connectDB
