export interface AdminProfile {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  bio: string
  backgroundColor: string
  cardBackgroundColor: string
  cardTextColor: string
}

export interface LinkBlockItem {
  id: string
  title: string
  url: string
  imageUrl: string
  position: number
  isActive: boolean
  clicks: number
  createdAt: string
}

export interface AnalyticsSummary {
  totalViews: number
  totalClicks: number
  chartData: Array<{
    date: string
    Views: number
    Clicks: number
  }>
}
