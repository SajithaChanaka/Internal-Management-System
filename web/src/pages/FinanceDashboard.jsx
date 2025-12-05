import React from 'react'
import { Card, CardContent, Typography, Grid, TextField, Stack } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AssessmentIcon from '@mui/icons-material/Assessment'
import { api } from '../api/client.js'

export default function FinanceDashboard() {
  const [month, setMonth] = React.useState('')
  const [data, setData] = React.useState({ revenue: 0, expense: 0, profitLoss: 0 })

  const load = async () => {
    const res = await api.get('/analytics/financial', { params: month ? { month } : {} })
    setData(res.data)
  }

  React.useEffect(() => { load() }, [month])

  const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' })

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField type="month" label="Month" value={month} onChange={e => setMonth(e.target.value)} size="small" />
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <AssessmentIcon color="primary" />
              <div>
                <Typography variant="overline">Total Revenue</Typography>
                <Typography variant="h5">{fmt.format(data.revenue)}</Typography>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <TrendingDownIcon color="secondary" />
              <div>
                <Typography variant="overline">Total Expense</Typography>
                <Typography variant="h5">{fmt.format(data.expense)}</Typography>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <TrendingUpIcon color={data.profitLoss >= 0 ? 'primary' : 'secondary'} />
              <div>
                <Typography variant="overline">Profit / Loss</Typography>
                <Typography variant="h5">{fmt.format(data.profitLoss)}</Typography>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}