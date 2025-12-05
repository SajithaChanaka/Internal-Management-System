import express from 'express'
import Campaign from '../models/Campaign.js'
import { demo } from './_demoStore.js'

const router = express.Router()

router.get('/', async (req, res) => {
  if (req.app.locals.useDemo) return res.json(demo.campaigns)
  const list = await Campaign.find().lean()
  res.json(list)
})

router.post('/', async (req, res) => {
  if (req.app.locals.useDemo) {
    const payload = { id: `c${Date.now()}`, ...req.body }
    demo.campaigns.push(payload)
    return res.status(201).json(payload)
  }
  const created = await Campaign.create(req.body)
  res.status(201).json(created)
})

export default router