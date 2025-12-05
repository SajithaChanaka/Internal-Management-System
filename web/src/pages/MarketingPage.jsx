import React from 'react'
import { Grid, Card, CardContent, Typography, TextField, MenuItem, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import PageHeader from '../components/PageHeader.jsx'
import { api } from '../api/client.js'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'

const platforms = ['Facebook', 'Google', 'Email', 'LinkedIn', 'Twitter']
const colors = ['#1976d2', '#2e7d32', '#ed6c02', '#d81b60', '#6d4c41']

export default function MarketingPage() {
  const theme = useTheme()
  const [form, setForm] = React.useState({ name: '', platform: 'Facebook', startDate: '', endDate: '', budget: 0, leadsGenerated: 0, conversions: 0 })
  const [platformStats, setPlatformStats] = React.useState([])
  const [successRate, setSuccessRate] = React.useState([])
  const errors = React.useMemo(() => {
    const e = {}
    if (!form.name) e.name = 'Campaign name is required'
    if (!form.startDate) e.startDate = 'Start date is required'
    if (!form.endDate) e.endDate = 'End date is required'
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) e.endDate = 'End date must be after start'
    if (form.budget < 0) e.budget = 'Budget cannot be negative'
    if (form.leadsGenerated < 0) e.leadsGenerated = 'Leads cannot be negative'
    if (form.conversions < 0) e.conversions = 'Conversions cannot be negative'
    if (form.conversions > form.leadsGenerated) e.conversions = 'Conversions cannot exceed leads'
    return e
  }, [form])

  const load = async () => {
    const res = await api.get('/analytics/marketing')
    setPlatformStats(res.data.platformStats)
    setSuccessRate(res.data.successRate)
  }

  React.useEffect(() => { load() }, [])

  const submit = async () => {
    await api.post('/campaigns', { ...form, startDate: new Date(form.startDate), endDate: new Date(form.endDate) })
    setForm({ name: '', platform: 'Facebook', startDate: '', endDate: '', budget: 0, leadsGenerated: 0, conversions: 0 })
    await load()
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PageHeader title="Marketing" crumbs={[{ label: 'Home', href: '#' }, { label: 'Marketing' }]} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Card><CardContent>
          <Typography variant="h6">Create Campaign</Typography>
          <TextField label="Name" fullWidth size="small" sx={{ mt: 2 }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={Boolean(errors.name)} helperText={errors.name} />
          <TextField select label="Platform" fullWidth size="small" sx={{ mt: 2 }} value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
            {platforms.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </TextField>
          <TextField type="date" label="Start" fullWidth size="small" sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} error={Boolean(errors.startDate)} helperText={errors.startDate} />
          <TextField type="date" label="End" fullWidth size="small" sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} error={Boolean(errors.endDate)} helperText={errors.endDate} />
          <TextField type="number" label="Budget" fullWidth size="small" sx={{ mt: 2 }} value={form.budget} onChange={e => setForm({ ...form, budget: Number(e.target.value) })} error={Boolean(errors.budget)} helperText={errors.budget} />
          <TextField type="number" label="Leads" fullWidth size="small" sx={{ mt: 2 }} value={form.leadsGenerated} onChange={e => setForm({ ...form, leadsGenerated: Number(e.target.value) })} error={Boolean(errors.leadsGenerated)} helperText={errors.leadsGenerated} />
          <TextField type="number" label="Conversions" fullWidth size="small" sx={{ mt: 2 }} value={form.conversions} onChange={e => setForm({ ...form, conversions: Number(e.target.value) })} error={Boolean(errors.conversions)} helperText={errors.conversions} />
          <Button variant="contained" sx={{ mt: 2 }} onClick={submit} disabled={Object.keys(errors).length > 0}>Save</Button>
        </CardContent></Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card><CardContent>
          <Typography variant="h6">Leads per Platform</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformStats}>
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="leads" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card sx={{ mt: 2 }}><CardContent>
          <Typography variant="h6">Campaign Success Rate</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={successRate} dataKey="rate" nameKey="name" outerRadius={120} label>
                {successRate.map((_, i) => <Cell key={i} fill={[theme.palette.primary.main, theme.palette.secondary.main, '#2e7d32', '#ed6c02'][i % 4]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent></Card>
      </Grid>
    </Grid>
  )
}
