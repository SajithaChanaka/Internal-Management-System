import express from 'express'
import Invoice from '../models/Invoice.js'
import { demo } from './_demoStore.js'

const router = express.Router()

router.get('/', async (req, res) => {
  if (req.app.locals.useDemo) return res.json(demo.invoices)
  const list = await Invoice.find().lean()
  res.json(list)
})

router.post('/', async (req, res) => {
  if (req.app.locals.useDemo) {
    const payload = { id: `inv${Date.now()}`, ...req.body }
    demo.invoices.push(payload)
    return res.status(201).json(payload)
  }
  const created = await Invoice.create(req.body)
  res.status(201).json(created)
})

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body
  if (req.app.locals.useDemo) {
    const inv = demo.invoices.find(i => i.id === req.params.id)
    if (!inv) return res.status(404).json({ message: 'Not found' })
    inv.status = status
    return res.json(inv)
  }
  const updated = await Invoice.findByIdAndUpdate(req.params.id, { status }, { new: true })
  res.json(updated)
})

export default router