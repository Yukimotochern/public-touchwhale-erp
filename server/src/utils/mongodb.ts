import mongoose from 'mongoose'
import 'colorts/lib/string'

const connectDB = async () => {
	// const connect = await mongoose.connect(process.env.MONGODB_URI!)
	// console.log(`MongoDB Connected: ${connect.connection.host}`.cyan.underline.bold)
}

export default connectDB
