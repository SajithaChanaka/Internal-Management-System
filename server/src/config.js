import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT || 5000
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/management_system'
export const USE_DEMO_DATA = (process.env.USE_DEMO_DATA || 'true').toLowerCase() === 'true'