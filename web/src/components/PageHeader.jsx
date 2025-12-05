import React from 'react'
import { Breadcrumbs, Link, Typography, Box } from '@mui/material'

export default function PageHeader({ title, crumbs = [] }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs aria-label="breadcrumb">
        {crumbs.map((c, i) => (
          i < crumbs.length - 1 ? (
            <Link key={c.label} underline="hover" color="inherit" href={c.href || '#'}>
              {c.label}
            </Link>
          ) : (
            <Typography key={c.label} color="text.primary">{c.label}</Typography>
          )
        ))}
      </Breadcrumbs>
      <Typography variant="h5" sx={{ mt: 1 }}>{title}</Typography>
    </Box>
  )
}