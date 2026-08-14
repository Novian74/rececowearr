'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import {
  Bell,
  Share2,
  PlusCircle,
  ShoppingBag,
  FileText,
  Video,
  Globe,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { AdminProfile, AnalyticsSummary } from '@/types'

export default function AdminHomePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [profRes, anaRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/analytics'),
        ])
        if (profRes.ok) setProfile(await profRes.json())
        if (anaRes.ok) setAnalytics(await anaRes.json())
      } catch (e) {
        console.error('Error loading dashboard data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header Navbar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Home</h1>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 font-medium">
            Memuat data dashboard...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Card (Full Width) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-500">Account</span>
                  <button className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#00c98d] border border-emerald-200 rounded-full text-xs font-semibold hover:bg-emerald-100 transition-all">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Upgrade to PRO</span>
                  </button>
                </div>

                {/* Profile info bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#00c98d] text-white flex items-center justify-center font-bold text-base shadow">
                      {profile?.displayName?.charAt(0) || 'R'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">
                        {profile?.displayName || 'Rececowear'}
                      </h3>
                      <a
                        href={`/`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#00c98d] font-bold hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span>https://rececowear.my.id</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white text-[#00c98d] border border-[#00c98d] rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all shadow-sm self-start sm:self-auto"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Page</span>
                  </a>
                </div>

                <p className="text-xs font-semibold text-slate-500 mb-3">
                  Start creating now!
                </p>

                {/* Action items buttons */}
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                  <a
                    href="/admin/my-lynk"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#00c98d] text-white rounded-xl text-xs font-bold hover:bg-[#00b07a] transition-all shadow-sm whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Link</span>
                  </a>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 opacity-75 hover:opacity-100 transition-all whitespace-nowrap">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>Digital Product</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 opacity-75 hover:opacity-100 transition-all whitespace-nowrap">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Blog Content</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 opacity-75 hover:opacity-100 transition-all whitespace-nowrap">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span>Course Video</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 opacity-75 hover:opacity-100 transition-all whitespace-nowrap">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Media Kit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Total Views & Clicks Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Total Views & Clicks</h2>
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                      <span className="text-xs text-slate-500 font-semibold">Views</span>
                      <span className="text-xl font-bold text-slate-800 ml-1">
                        {analytics?.totalViews || 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#00c98d]"></span>
                      <span className="text-xs text-slate-500 font-semibold">Clicks</span>
                      <span className="text-xl font-bold text-slate-800 ml-1">
                        {analytics?.totalClicks || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium cursor-pointer hover:bg-slate-100 transition-all">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Select Date..</span>
                </div>
              </div>

              {/* Analytics Bar Chart */}
              <div className="h-64 w-full pt-4">
                {analytics?.chartData && analytics.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Bar dataKey="Views" fill="#fbbf24" radius={[6, 6, 0, 0]} maxBarSize={32} />
                      <Bar dataKey="Clicks" fill="#00c98d" radius={[6, 6, 0, 0]} maxBarSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                    Belum ada data grafik yang tercatat.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
