import mongoose from 'mongoose'
import 'colorts/lib/string'

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log(
      `MongoDB Connected: ${connect.connection.host}`.cyan.underline.bold
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

export default connectDB
