import React from 'react'
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CampaignIcon from '@mui/icons-material/Campaign'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import MarketingPage from './pages/MarketingPage.jsx'
import FinanceDashboard from './pages/FinanceDashboard.jsx'
import InvoicesPage from './pages/InvoicesPage.jsx'
import IncomeExpensesPage from './pages/IncomeExpensesPage.jsx'

const drawerWidth = 240

function buildTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#d81b60' },
      background: { default: mode === 'light' ? '#f7f9fc' : '#0b0f14' }
    },
    typography: {
      fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
      h6: { fontWeight: 600 }
    }
  })
}

export default function App() {
  const [page, setPage] = React.useState('dashboard')
  const [mode, setMode] = React.useState(() => localStorage.getItem('themeMode') || 'light')
  const theme = React.useMemo(() => buildTheme(mode), [mode])

  const menu = [
    { key: 'dashboard', label: 'Finance Dashboard', icon: <DashboardIcon /> },
    { key: 'marketing', label: 'Marketing', icon: <CampaignIcon /> },
    { key: 'income', label: 'Income & Expenses', icon: <AccountBalanceIcon /> },
    { key: 'invoices', label: 'Invoices', icon: <ReceiptLongIcon /> }
  ]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Marketing & Finance</Typography>
          <Button color="inherit" href="http://localhost:5000/api/reports/income-expense?format=excel" target="_blank">Export Excel</Button>
          <Button color="inherit" href="http://localhost:5000/api/reports/income-expense?format=pdf" target="_blank">Export PDF</Button>
          <IconButton color="inherit" onClick={() => { const next = mode === 'light' ? 'dark' : 'light'; setMode(next); localStorage.setItem('themeMode', next) }}>
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: drawerWidth, [`& .MuiDrawer-paper`]: { width: drawerWidth } }}>
        <Toolbar />
        <List>
          {menu.map(m => (
            <ListItem key={m.key} disablePadding>
              <ListItemButton selected={page === m.key} onClick={() => setPage(m.key)}>
                <ListItemIcon>{m.icon}</ListItemIcon>
                <ListItemText primary={m.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box sx={{ ml: `${drawerWidth}px` }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {page === 'dashboard' && <FinanceDashboard />}
          {page === 'marketing' && <MarketingPage />}
          {page === 'income' && <IncomeExpensesPage />}
          {page === 'invoices' && <InvoicesPage />}
        </Container>
      </Box>
    </ThemeProvider>
  )
}