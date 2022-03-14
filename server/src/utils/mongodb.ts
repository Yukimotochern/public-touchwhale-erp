import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI)
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
export const MongooseStaticsJSONSchema: {
  _id: { type: 'string' }
  __v: { type: 'number' }
} = {
  _id: { type: 'string' },
  __v: { type: 'number' },
}

export interface MongooseStamps {
  createdAt: Date | string
  updatedAt: Date | string
}

export const MongooseStampsJSONSchema: {
  createdAt: {
    anyOf: [{ type: 'object'; required: [] }, { type: 'string' }]
  }
  updatedAt: {
    anyOf: [{ type: 'object'; required: [] }, { type: 'string' }]
  }
} = {
  createdAt: {
    anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
  },
  updatedAt: {
    anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
  },
}

export default connectDB
