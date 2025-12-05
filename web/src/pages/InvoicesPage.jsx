import React from 'react'
import { Grid, Card, CardContent, Typography, TextField, Button, MenuItem, Stack, Divider, Chip, Tooltip, Snackbar, Alert } from '@mui/material'
import PageHeader from '../components/PageHeader.jsx'
import { DataGrid } from '@mui/x-data-grid'
import { api } from '../api/client.js'

export default function InvoicesPage() {
  const [list, setList] = React.useState([])
  const [form, setForm] = React.useState({ number: '', customer: '', status: 'Pending', items: [{ description: '', quantity: 1, price: 0 }], issueDate: '', dueDate: '' })
  const [snack, setSnack] = React.useState({ open: false, message: '' })
  const errors = React.useMemo(() => {
    const e = {}
    if (!form.number) e.number = 'Invoice number is required'
    if (!form.customer) e.customer = 'Customer is required'
    if (!form.issueDate) e.issueDate = 'Issue date is required'
    if (!form.dueDate) e.dueDate = 'Due date is required'
    if (form.issueDate && form.dueDate && new Date(form.dueDate) < new Date(form.issueDate)) e.dueDate = 'Due date must be after issue'
    if (!form.items[0].description) e.description = 'Item description is required'
    if (form.items[0].quantity <= 0) e.quantity = 'Quantity must be greater than 0'
    if (form.items[0].price <= 0) e.price = 'Price must be greater than 0'
    return e
  }, [form])

  const load = async () => {
    const res = await api.get('/invoices')
    setList(res.data.map((x, idx) => ({ id: x._id || x.id || idx, ...x })))
  }
  React.useEffect(() => { load() }, [])

  const addInvoice = async () => {
    const items = form.items.map(i => ({ ...i, quantity: Number(i.quantity), price: Number(i.price) }))
    const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0)
    const tax = subtotal * 0.1
    const total = subtotal + tax
    await api.post('/invoices', { number: form.number, customer: form.customer, status: form.status, items, subtotal, tax, total, issueDate: new Date(form.issueDate), dueDate: new Date(form.dueDate) })
    setForm({ number: '', customer: '', status: 'Pending', items: [{ description: '', quantity: 1, price: 0 }], issueDate: '', dueDate: '' })
    await load()
  }

  const updateStatus = async (id, status) => {
    await api.patch(`/invoices/${id}/status`, { status })
    setSnack({ open: true, message: `Invoice marked ${status}` })
    await load()
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PageHeader title="Invoices" crumbs={[{ label: 'Home', href: '#' }, { label: 'Invoices' }]} />
      </Grid>
      <Grid item xs={12} md={5}>
        <Card><CardContent>
          <Typography variant="h6">Create Invoice</Typography>
          <TextField label="Number" fullWidth size="small" sx={{ mt: 2 }} value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} error={Boolean(errors.number)} helperText={errors.number} />
          <TextField label="Customer" fullWidth size="small" sx={{ mt: 2 }} value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} error={Boolean(errors.customer)} helperText={errors.customer} />
          <TextField select label="Status" fullWidth size="small" sx={{ mt: 2 }} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {['Paid', 'Pending', 'Overdue'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField type="date" label="Issue Date" fullWidth size="small" sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} error={Boolean(errors.issueDate)} helperText={errors.issueDate} />
          <TextField type="date" label="Due Date" fullWidth size="small" sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} error={Boolean(errors.dueDate)} helperText={errors.dueDate} />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Item</Typography>
          <TextField label="Description" fullWidth size="small" sx={{ mt: 1 }} value={form.items[0].description} onChange={e => setForm({ ...form, items: [{ ...form.items[0], description: e.target.value }] })} error={Boolean(errors.description)} helperText={errors.description} />
          <TextField type="number" label="Quantity" fullWidth size="small" sx={{ mt: 1 }} value={form.items[0].quantity} onChange={e => setForm({ ...form, items: [{ ...form.items[0], quantity: Number(e.target.value) }] })} error={Boolean(errors.quantity)} helperText={errors.quantity} />
          <TextField type="number" label="Price" fullWidth size="small" sx={{ mt: 1 }} value={form.items[0].price} onChange={e => setForm({ ...form, items: [{ ...form.items[0], price: Number(e.target.value) }] })} error={Boolean(errors.price)} helperText={errors.price} />
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2}>
            <Typography variant="subtitle2">Subtotal:</Typography>
            <Typography variant="subtitle1">{(form.items[0].quantity * form.items[0].price || 0).toLocaleString()}</Typography>
          </Stack>
          <Button variant="contained" sx={{ mt: 2 }} onClick={addInvoice} disabled={Object.keys(errors).length > 0}>Create</Button>
        </CardContent></Card>
      </Grid>
      <Grid item xs={12} md={7}>
        <Card><CardContent>
          <Typography variant="h6">Invoices</Typography>
          <div style={{ height: 420, marginTop: 16 }}>
            <DataGrid rows={list} columns={[
              { field: 'number', headerName: 'Number', flex: 1 },
              { field: 'customer', headerName: 'Customer', flex: 1 },
              { field: 'status', headerName: 'Status', flex: 1, renderCell: (params) => (
                <Chip label={params.value} color={params.value === 'Paid' ? 'success' : params.value === 'Overdue' ? 'error' : 'warning'} size="small" />
              ) },
              { field: 'total', headerName: 'Total', flex: 1 },
              {
                field: 'actions', headerName: 'Actions', width: 240, sortable: false, filterable: false, renderCell: (params) => (
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Set status to Paid">
                      <Button variant="contained" color="success" size="small" onClick={() => updateStatus(params.row.id, 'Paid')}>Mark Paid</Button>
                    </Tooltip>
                    <Tooltip title="Set status to Overdue">
                      <Button variant="contained" color="error" size="small" onClick={() => updateStatus(params.row.id, 'Overdue')}>Mark Overdue</Button>
                    </Tooltip>
                  </Stack>
                )
              }
            ]} pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: (t) => t.palette.action.hover }, '& .MuiDataGrid-row:hover': { backgroundColor: (t) => t.palette.action.selected } }} />
          </div>
        </CardContent></Card>
      </Grid>
      <Snackbar open={snack.open} autoHideDuration={2000} onClose={() => setSnack({ open: false, message: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>{snack.message}</Alert>
      </Snackbar>
    </Grid>
  )
}