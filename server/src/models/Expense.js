import mongoose from 'mongoose'

const ExpenseSchema = new mongoose.Schema(
  {
    category: { type: String, enum: ['Salary', 'Subscription', 'Marketing', 'Utility', 'Other'], required: true },
    vendor: { type: String },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    notes: { type: String }
  },
  { timestamps: true }
)

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema)