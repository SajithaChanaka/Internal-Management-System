import express from 'express'
import Expense from '../models/Expense.js'
import { demo } from './_demoStore.js'

const router = express.Router()

router.get('/', async (req, res) => {
  if (req.app.locals.useDemo) return res.json(demo.expenses)
  const list = await Expense.find().lean()
  res.json(list)
})

router.post('/', async (req, res) => {
  if (req.app.locals.useDemo) {
    const payload = { id: `e${Date.now()}`, ...req.body }
    demo.expenses.push(payload)
    return res.status(201).json(payload)
  }
  const created = await Expense.create(req.body)
  res.status(201).json(created)
})

export default router