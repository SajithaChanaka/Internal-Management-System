import mongoose from 'mongoose'

const IncomeSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['ProjectPayment', 'InvoicePayment', 'CustomerDeposit', 'Adhoc'], required: true },
    customer: { type: String },
    project: { type: String },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    notes: { type: String }
  },
  { timestamps: true }
)

export default mongoose.models.Income || mongoose.model('Income', IncomeSchema)