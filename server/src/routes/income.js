import express from 'express'
import Income from '../models/Income.js'
import { demo } from './_demoStore.js'

const router = express.Router()

router.get('/', async (req, res) => {
  if (req.app.locals.useDemo) return res.json(demo.income)
  const list = await Income.find().lean()
  res.json(list)
})

router.post('/', async (req, res) => {
  if (req.app.locals.useDemo) {
    const payload = { id: `i${Date.now()}`, ...req.body }
    demo.income.push(payload)
    return res.status(201).json(payload)
  }
  const created = await Income.create(req.body)
  res.status(201).json(created)
})

export default router