import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema(
  {
    description: String,
    quantity: Number,
    price: Number
  },
  { _id: false }
)

const InvoiceSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
    items: [ItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    payments: [{ amount: Number, date: Date }]
  },
  { timestamps: true }
)

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema)