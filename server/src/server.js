import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import { PORT, MONGO_URI, USE_DEMO_DATA } from './config.js'
import campaignRoutes from './routes/campaigns.js'
import incomeRoutes from './routes/income.js'
import expenseRoutes from './routes/expenses.js'
import invoiceRoutes from './routes/invoices.js'
import analyticsRoutes from './routes/analytics.js'
import reportRoutes from './routes/reports.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.locals.useDemo = USE_DEMO_DATA

app.get('/', (req, res) => {
  res.json({ status: 'ok', module: 'Marketing & Finance', demo: USE_DEMO_DATA })
})

app.use('/api/campaigns', campaignRoutes)
app.use('/api/income', incomeRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/reports', reportRoutes)

async function start() {
  if (!USE_DEMO_DATA) {
    try {
      await mongoose.connect(MONGO_URI)
      console.log('Connected to MongoDB')
    } catch (err) {
      console.error('MongoDB connection failed, switching to demo data mode:', err.message)
      app.locals.useDemo = true
    }
  }
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
}

start()