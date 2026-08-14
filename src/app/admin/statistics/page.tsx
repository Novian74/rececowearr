'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import Image from 'next/image'
import {
  Bell,
  BarChart3,
  MousePointerClick,
  Eye,
  TrendingUp,
  Trophy,
  ExternalLink,
  Clock,
  Flame,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

interface ProductStat {
  rank: number
  id: string
  title: string
  url: string
  imageUrl: string
  clicks: number
  percentage: number
  isActive: boolean
}

interface ActivityLog {
  id: string
  productTitle: string
  imageUrl: string
  timestamp: string
}

interface DetailedAnalytics {
  totalViews: number
  totalClicks: number
  ctr: string
  productStats: ProductStat[]
  activityLogs: ActivityLog[]
}

const COLORS = ['#00c98d', '#3b82f6', '#ec8aa7', '#fbbf24', '#8b5cf6', '#f97316', '#06b6d4']

export default function StatisticsPage() {
  const [data, setData] = useState<DetailedAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/analytics/detailed')
        if (res.ok) {
          setData(await res.json())
        }
      } catch (e) {
        console.error('Error fetching statistics:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const topProduct = data?.productStats?.[0]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-[#00c98d]" />
              <span>Statistics & Product Analytics</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Analisis detail produk Shopee mana yang paling sering diklik pengunjung
            </p>
          </div>
          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 font-medium">
            Memuat data statistik detail...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top 4 KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Total Clicks */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00c98d] flex items-center justify-center flex-shrink-0">
                  <MousePointerClick className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Total Clicks
                  </p>
                  <h3 className="text-2xl font-black text-slate-800">
                    {data?.totalClicks || 0}
                  </h3>
                </div>
              </div>

              {/* Card 2: Total Views */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Total Views
                  </p>
                  <h3 className="text-2xl font-black text-slate-800">
                    {data?.totalViews || 0}
                  </h3>
                </div>
              </div>

              {/* Card 3: CTR (Click-through Rate) */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    CTR (Click Rate)
                  </p>
                  <h3 className="text-2xl font-black text-slate-800">
                    {data?.ctr || '0'}%
                  </h3>
                </div>
              </div>

              {/* Card 4: Top Product #1 */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-3xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-amber-100 font-semibold uppercase tracking-wider">
                    Produk Terlaris #1
                  </p>
                  <h3 className="text-sm font-bold text-white truncate">
                    {topProduct && topProduct.clicks > 0 ? topProduct.title : 'Belum Ada'}
                  </h3>
                  {topProduct && topProduct.clicks > 0 && (
                    <p className="text-xs text-amber-100 font-medium">
                      {topProduct.clicks} klik ({topProduct.percentage}%)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Row: Product Leaderboard & Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Leaderboard Table (7 Columns) */}
              <div className="xl:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500" />
                    <span>Peringkat Klik Produk (Leaderboard)</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    Diurutkan dari paling banyak diklik
                  </span>
                </div>

                <div className="space-y-3">
                  {data?.productStats && data.productStats.length > 0 ? (
                    data.productStats.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Rank Badge */}
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0 ${
                              prod.rank === 1
                                ? 'bg-amber-400 text-amber-950 shadow'
                                : prod.rank === 2
                                ? 'bg-slate-300 text-slate-800'
                                : prod.rank === 3
                                ? 'bg-amber-700/20 text-amber-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            #{prod.rank}
                          </div>

                          {/* Image Thumbnail */}
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {prod.imageUrl ? (
                              <Image
                                src={prod.imageUrl}
                                alt={prod.title}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-emerald-50 text-[#00c98d] font-bold text-xs flex items-center justify-center">
                                PROD
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm text-slate-800 truncate">
                              {prod.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {/* Progress bar percentage */}
                              <div className="w-28 bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#00c98d] h-full rounded-full transition-all duration-500"
                                  style={{ width: `${Math.max(prod.percentage, 5)}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-bold text-slate-500">
                                {prod.percentage}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Click Count Badge */}
                        <div className="text-right flex-shrink-0">
                          <span className="px-3.5 py-1.5 bg-[#00c98d]/10 text-[#00c98d] font-extrabold text-sm rounded-xl inline-block border border-emerald-200">
                            {prod.clicks} Klik
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-400">
                      Belum ada data produk.
                    </div>
                  )}
                </div>
              </div>

              {/* Chart & Recent Activity Stream (5 Columns) */}
              <div className="xl:col-span-5 space-y-6">
                {/* Visual Chart */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">
                    Distribusi Klik Per Produk
                  </h3>
                  <div className="h-56 w-full">
                    {data?.productStats && data.totalClicks > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.productStats} layout="vertical" margin={{ left: -10, right: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                          <YAxis dataKey="title" type="category" width={80} tick={{ fill: '#475569', fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="clicks" fill="#00c98d" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                        Belum ada klik terdeteksi untuk grafik.
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity Log Stream */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Aktivitas Klik Terbaru</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {data?.activityLogs && data.activityLogs.length > 0 ? (
                      data.activityLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-2 h-2 rounded-full bg-[#00c98d] flex-shrink-0" />
                            <span className="font-bold text-slate-700 truncate">
                              {log.productTitle}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium flex-shrink-0">
                            {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-slate-400">
                        Belum ada aktivitas klik terbaru.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
