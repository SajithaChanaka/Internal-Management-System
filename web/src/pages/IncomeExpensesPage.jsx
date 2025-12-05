import React from 'react'
import { Grid, Card, CardContent, Typography, TextField, MenuItem, Button, Divider, Stack } from '@mui/material'
import PageHeader from '../components/PageHeader.jsx'
import { DataGrid } from '@mui/x-data-grid'
import { api } from '../api/client.js'

const categories = ['Salary', 'Subscription', 'Marketing', 'Utility', 'Other']

export default function IncomeExpensesPage() {
  const [income, setIncome] = React.useState([])
  const [expenses, setExpenses] = React.useState([])
  const [incomeForm, setIncomeForm] = React.useState({ type: 'Adhoc', customer: '', amount: 0, date: '' })
  const [expenseForm, setExpenseForm] = React.useState({ category: 'Other', vendor: '', amount: 0, date: '' })
  const incomeErrors = React.useMemo(() => {
    const e = {}
    if (incomeForm.amount <= 0) e.amount = 'Amount must be greater than 0'
    if (!incomeForm.date) e.date = 'Date is required'
    return e
  }, [incomeForm])
  const expenseErrors = React.useMemo(() => {
    const e = {}
    if (expenseForm.amount <= 0) e.amount = 'Amount must be greater than 0'
    if (!expenseForm.date) e.date = 'Date is required'
    return e
  }, [expenseForm])

  const load = async () => {
    const [i, e] = await Promise.all([api.get('/income'), api.get('/expenses')])
    setIncome(i.data.map((x, idx) => ({ id: x._id || x.id || idx, ...x })))
    setExpenses(e.data.map((x, idx) => ({ id: x._id || x.id || idx, ...x })))
  }
  React.useEffect(() => { load() }, [])

  const addIncome = async () => {
    await api.post('/income', { ...incomeForm, date: new Date(incomeForm.date) })
    setIncomeForm({ type: 'Adhoc', customer: '', amount: 0, date: '' })
    await load()
  }
  const addExpense = async () => {
    await api.post('/expenses', { ...expenseForm, date: new Date(expenseForm.date) })
    setExpenseForm({ category: 'Other', vendor: '', amount: 0, date: '' })
    await load()
  }

  const totalIncome = income.reduce((s, x) => s + (Number(x.amount) || 0), 0)
  const totalExpense = expenses.reduce((s, x) => s + (Number(x.amount) || 0), 0)
  const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' })

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PageHeader title="Income & Expenses" crumbs={[{ label: 'Home', href: '#' }, { label: 'Income & Expenses' }]} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Card><CardContent>
          <Typography variant="h6">Income</Typography>
          <TextField select label="Type" fullWidth size="small" sx={{ mt: 2 }} value={incomeForm.type} onChange={e => setIncomeForm({ ...incomeForm, type: e.target.value })}>
            {['ProjectPayment', 'InvoicePayment', 'CustomerDeposit', 'Adhoc'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField label="Customer" fullWidth size="small" sx={{ mt: 2 }} value={incomeForm.customer} onChange={e => setIncomeForm({ ...incomeForm, customer: e.target.value })} />
          <TextField type="number" label="Amount" fullWidth size="small" sx={{ mt: 2 }} value={incomeForm.amount} onChange={e => setIncomeForm({ ...incomeForm, amount: Number(e.target.value) })} error={Boolean(incomeErrors.amount)} helperText={incomeErrors.amount} />
          <TextField type="date" label="Date" fullWidth size="small" sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} value={incomeForm.date} onChange={e => setIncomeForm({ ...incomeForm, date: e.target.value })} error={Boolean(incomeErrors.date)} helperText={incomeErrors.date} />
          <Button variant="contained" sx={{ mt: 2 }} onClick={addIncome} disabled={Object.keys(incomeErrors).length > 0}>Add</Button>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2}>
            <Typography variant="subtitle2">Total:</Typography>
            <Typography variant="subtitle1">{fmt.format(totalIncome)}</Typography>
          </Stack>
          <div style={{ height: 320, marginTop: 16 }}>
            <DataGrid rows={income} columns={[
              { field: 'type', headerName: 'Type', flex: 1 },
              { field: 'customer', headerName: 'Customer', flex: 1 },
              { field: 'amount', headerName: 'Amount', flex: 1 },
              { field: 'date', headerName: 'Date', flex: 1 }
            ]} pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: (t) => t.palette.action.hover }, '& .MuiDataGrid-row:hover': { backgroundColor: (t) => t.palette.action.selected } }} />
          </div>
        </CardContent></Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card><CardContent>
          <Typography variant="h6">Expenses</Typography>
          <TextField select label="Category" fullWidth size="small" sx={{ mt: 2 }} value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}>
            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField label="Vendor" fullWidth size="small" sx={{ mt: 2 }} value={expenseForm.vendor} onChange={e => setExpenseForm({ ...expenseForm, vendor: e.target.value })} />
          <TextField type="number" label="Amount" fullWidth size="small" sx={{ mt: 2 }} value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })} error={Boolean(expenseErrors.amount)} helperText={expenseErrors.amount} />
          <TextField type="date" label="Date" fullWidth size="small" sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} value={expenseForm.date} onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })} error={Boolean(expenseErrors.date)} helperText={expenseErrors.date} />
          <Button variant="contained" sx={{ mt: 2 }} onClick={addExpense} disabled={Object.keys(expenseErrors).length > 0}>Add</Button>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2}>
            <Typography variant="subtitle2">Total:</Typography>
            <Typography variant="subtitle1">{fmt.format(totalExpense)}</Typography>
          </Stack>
          <div style={{ height: 320, marginTop: 16 }}>
            <DataGrid rows={expenses} columns={[
              { field: 'category', headerName: 'Category', flex: 1 },
              { field: 'vendor', headerName: 'Vendor', flex: 1 },
              { field: 'amount', headerName: 'Amount', flex: 1 },
              { field: 'date', headerName: 'Date', flex: 1 }
            ]} pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: (t) => t.palette.action.hover }, '& .MuiDataGrid-row:hover': { backgroundColor: (t) => t.palette.action.selected } }} />
          </div>
        </CardContent></Card>
      </Grid>
    </Grid>
  )
}