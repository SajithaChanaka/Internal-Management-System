// Simple in-memory demo store used when USE_DEMO_DATA is true
export const demo = {
  campaigns: [
    { id: 'c1', name: 'Q1 Lead Gen', platform: 'Facebook', startDate: new Date('2025-01-10'), endDate: new Date('2025-02-15'), budget: 5000, leadsGenerated: 300, conversions: 45 },
    { id: 'c2', name: 'Spring Promo', platform: 'Google', startDate: new Date('2025-03-01'), endDate: new Date('2025-03-31'), budget: 7000, leadsGenerated: 420, conversions: 60 }
  ],
  income: [
    { id: 'i1', type: 'ProjectPayment', customer: 'Acme Corp', amount: 15000, date: new Date('2025-03-05') },
    { id: 'i2', type: 'InvoicePayment', customer: 'Beta LLC', amount: 8000, date: new Date('2025-03-20') }
  ],
  expenses: [
    { id: 'e1', category: 'Salary', vendor: 'Employees', amount: 12000, date: new Date('2025-03-30') },
    { id: 'e2', category: 'Marketing', vendor: 'Google Ads', amount: 3000, date: new Date('2025-03-25') },
    { id: 'e3', category: 'Subscription', vendor: 'GitHub', amount: 300, date: new Date('2025-03-02') }
  ],
  invoices: [
    { id: 'inv1', number: 'INV-1001', customer: 'Beta LLC', status: 'Pending', items: [{ description: 'Development', quantity: 50, price: 100 }], subtotal: 5000, tax: 500, total: 5500, issueDate: new Date('2025-03-01'), dueDate: new Date('2025-03-31'), payments: [] }
  ]
}