import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.Promise = global.Promise

const isProduction = process.env.NODE_ENV === 'production'

const connectToDb = async () => {
  try {
    await mongoose.connect(
      process.env.COSMOSDB_CONNSTR + '?ssl=true&replicaSet=globaldb',
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

    console.log('Successfully connected to DB')
  } catch (err) {
    console.error(err)
  }
}

export default connectToDb
