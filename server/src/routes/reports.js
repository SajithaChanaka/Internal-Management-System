import express from 'express'
import Income from '../models/Income.js'
import Expense from '../models/Expense.js'
import { demo } from './_demoStore.js'
import { buildIncomeExpenseExcel, buildIncomeExpensePdf } from '../utils/export.js'

const router = express.Router()

router.get('/income-expense', async (req, res) => {
  const { format = 'excel', from, to } = req.query
  const inRange = (d) => {
    const dt = new Date(d)
    const okFrom = from ? dt >= new Date(from) : true
    const okTo = to ? dt <= new Date(to) : true
    return okFrom && okTo
  }

  const income = req.app.locals.useDemo
    ? demo.income.filter(x => inRange(x.date)).map(x => ({ ...x, date: new Date(x.date).toISOString() }))
    : (await Income.find().lean()).filter(x => inRange(x.date)).map(x => ({ ...x, date: new Date(x.date).toISOString() }))

  const expenses = req.app.locals.useDemo
    ? demo.expenses.filter(x => inRange(x.date)).map(x => ({ ...x, date: new Date(x.date).toISOString() }))
    : (await Expense.find().lean()).filter(x => inRange(x.date)).map(x => ({ ...x, date: new Date(x.date).toISOString() }))

  if (format === 'pdf') {
    const buf = await buildIncomeExpensePdf({ income, expenses })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="income-expense.pdf"')
    return res.send(buf)
  }
  const buf = await buildIncomeExpenseExcel({ income, expenses })
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', 'attachment; filename="income-expense.xlsx"')
  res.send(Buffer.from(buf))
})

export default router