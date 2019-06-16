import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.Promise = global.Promise

const isProduction = process.env.NODE_ENV === 'production'

const connectToDb = async () => {
  try {
    await mongoose.connect(
      process.env.COSMOSDB_CONNSTR,
      {
        auth: {
          user: process.env.COSMOSDB_USERNAME,
          password: process.env.COSMOSDB_PASSWORD
        },
        useNewUrlParser: true
      }
    )

    if (!isProduction) {
      mongoose.set('debug', true)
    }
  } catch (err) {}
}

export default connectToDb
