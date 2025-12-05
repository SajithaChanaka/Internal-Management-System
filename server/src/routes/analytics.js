import express from 'express'
import Campaign from '../models/Campaign.js'
import Income from '../models/Income.js'
import Expense from '../models/Expense.js'
import { demo } from './_demoStore.js'

const router = express.Router()

router.get('/marketing', async (req, res) => {
  const toPlatformStats = (list) => {
    const map = {}
    list.forEach(c => {
      map[c.platform] = map[c.platform] || { leads: 0, conversions: 0, campaigns: 0 }
      map[c.platform].leads += c.leadsGenerated || 0
      map[c.platform].conversions += c.conversions || 0
      map[c.platform].campaigns += 1
    })
    return Object.entries(map).map(([platform, v]) => ({ platform, ...v }))
  }

  if (req.app.locals.useDemo) {
    const platformStats = toPlatformStats(demo.campaigns)
    const successRate = demo.campaigns.map(c => ({ name: c.name, rate: c.leadsGenerated ? (c.conversions / c.leadsGenerated) * 100 : 0 }))
    return res.json({ platformStats, successRate })
  }
  const list = await Campaign.find().lean()
  const platformStats = toPlatformStats(list)
  const successRate = list.map(c => ({ name: c.name, rate: c.leadsGenerated ? (c.conversions / c.leadsGenerated) * 100 : 0 }))
  res.json({ platformStats, successRate })
})

router.get('/financial', async (req, res) => {
  const { month } = req.query // month format YYYY-MM
  const [y, m] = month ? month.split('-').map(Number) : []
  const start = month ? new Date(y, m - 1, 1) : null
  const end = month ? new Date(y, m, 0, 23, 59, 59) : null

  const inRange = (d) => !month || (d >= start && d <= end)

  if (req.app.locals.useDemo) {
    const revenue = demo.income.filter(x => inRange(new Date(x.date))).reduce((s, x) => s + x.amount, 0)
    const expense = demo.expenses.filter(x => inRange(new Date(x.date))).reduce((s, x) => s + x.amount, 0)
    return res.json({ revenue, expense, profitLoss: revenue - expense })
  }
  const incomes = await Income.find(month ? { date: { $gte: start, $lte: end } } : {}).lean()
  const expenses = await Expense.find(month ? { date: { $gte: start, $lte: end } } : {}).lean()
  const revenue = incomes.reduce((s, x) => s + x.amount, 0)
  const expense = expenses.reduce((s, x) => s + x.amount, 0)
  res.json({ revenue, expense, profitLoss: revenue - expense })
})

export default router