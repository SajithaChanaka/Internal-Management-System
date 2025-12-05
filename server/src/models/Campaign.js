import mongoose from 'mongoose'

const CampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    platform: { type: String, enum: ['Facebook', 'Google', 'Email', 'LinkedIn', 'Twitter'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number, required: true },
    leadsGenerated: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 }
  },
  { timestamps: true }
)

CampaignSchema.virtual('durationDays').get(function () {
  const ms = Math.abs(this.endDate - this.startDate)
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
})

CampaignSchema.virtual('costPerLead').get(function () {
  return this.leadsGenerated > 0 ? this.budget / this.leadsGenerated : 0
})

CampaignSchema.virtual('conversionRate').get(function () {
  return this.leadsGenerated > 0 ? (this.conversions / this.leadsGenerated) * 100 : 0
})

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema)