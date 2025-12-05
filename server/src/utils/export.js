import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'

export async function buildIncomeExpenseExcel({ income, expenses }) {
  const wb = new ExcelJS.Workbook()
  const sh = wb.addWorksheet('Income & Expense')
  sh.getColumn(3).numFmt = '$#,##0.00'
  sh.getColumn(4).numFmt = 'yyyy-mm-dd'
  sh.getColumn(1).width = 20
  sh.getColumn(2).width = 28
  sh.getColumn(3).width = 16
  sh.getColumn(4).width = 16

  const bold = { bold: true }
  sh.addRow(['Income']).font = bold
  sh.addRow(['Type', 'Customer', 'Amount', 'Date']).font = bold
  income.forEach(i => sh.addRow([i.type, i.customer || '', i.amount, new Date(i.date)]))

  sh.addRow([])
  sh.addRow(['Expenses']).font = bold
  sh.addRow(['Category', 'Vendor', 'Amount', 'Date']).font = bold
  expenses.forEach(e => sh.addRow([e.category, e.vendor || '', e.amount, new Date(e.date)]))

  return wb.xlsx.writeBuffer()
}

export async function buildIncomeExpensePdf({ income, expenses }) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 })
    const chunks = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))

    doc.fontSize(18).text('Income & Expense Report', { align: 'center' })
    doc.moveDown()
    doc.fontSize(14).text('Income')
    doc.moveDown(0.5)
    income.forEach(i => doc.text(`${i.date.slice(0,10)} - ${i.type} - ${i.customer || ''} - $${i.amount.toFixed(2)}`))
    doc.moveDown()
    doc.fontSize(14).text('Expenses')
    doc.moveDown(0.5)
    expenses.forEach(e => doc.text(`${e.date.slice(0,10)} - ${e.category} - ${e.vendor || ''} - $${e.amount.toFixed(2)}`))
    doc.end()
  })
}