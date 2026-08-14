'use client'

import { useEffect, useState } from 'react'
import { Search, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { AdminProfile, LinkBlockItem } from '@/types'
import { resolveImageUrl, handleImageError } from '@/lib/image-helper'
import { CATEGORIES, CategoryName, detectCategory } from '@/lib/category-helper'

export default function PublicPage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [links, setLinks] = useState<LinkBlockItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const ITEMS_PER_PAGE = 25

  useEffect(() => {
    async function fetchData() {
      try {
        const [profRes, linksRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/links'),
        ])
        if (profRes.ok) setProfile(await profRes.json())
        if (linksRes.ok) setLinks(await linksRes.json())
      } catch (e) {
        console.error('Error fetching public data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Reset pagination when category or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  // Filter links by Category & Search Query
  const filteredLinks = links.filter((link) => {
    if (!link.isActive) return false

    // 1. Category Filter
    if (selectedCategory !== 'Semua') {
      const cat = detectCategory(link.title)
      if (cat !== selectedCategory) return false
    }

    // 2. Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      const matchTitle = link.title.toLowerCase().includes(q)
      const matchUrl = link.url.toLowerCase().includes(q)
      if (!matchTitle && !matchUrl) return false
    }

    return true
  })

  // Pagination calculation
  const totalPages = Math.ceil(filteredLinks.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedLinks = filteredLinks.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const bgStyle = {
    background: 'linear-gradient(135deg, #ec8aa7 0%, #80a1d1 50%, #e6afbf 100%)',
  }

  const cardStyle = {
    backgroundColor: profile?.cardBackgroundColor || '#ffffff',
    color: profile?.cardTextColor || '#333333',
  }

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center sm:py-8 sm:px-4 select-none">
      {/* Smartphone Viewport Outer Frame */}
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[820px] sm:max-h-[880px] bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border-8 sm:border-slate-800">
        
        {/* Screen Viewport with Fixed Signature 3-Color Gradient Background */}
        <div className="flex-1 flex flex-col overflow-y-auto" style={bgStyle}>
          
          {/* Top Sticky Search & Header Bar */}
          <header className="bg-[#444444]/95 backdrop-blur-md text-white px-4 py-3 sticky top-0 z-20 shadow-md">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-300 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kode produk (misal: C001, AS, BT, RK)..."
                className="w-full pl-9 pr-8 py-2 bg-slate-700/60 border border-slate-600 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ec8aa7] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </header>

          {/* Profile Header */}
          <div className="flex flex-col items-center pt-6 pb-4 px-4 text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-lg border-2 border-white mb-3 relative group">
              {profile?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={resolveImageUrl(profile.avatarUrl)}
                  alt={profile.displayName || 'Profile'}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <h2 className="font-bold text-lg tracking-tight text-white drop-shadow-sm">
              @{profile?.username || 'rececowear'}
            </h2>
            {profile?.bio && (
              <p className="text-xs text-white/95 mt-1 max-w-xs font-medium drop-shadow-sm px-2">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Category Filter Pills Grid (Balanced 3-Column Layout) */}
          <div className="px-5 pb-4">
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto text-center">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-2 px-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                      isActive
                        ? 'bg-white text-slate-800 shadow-md scale-105 border-2 border-[#ec8aa7]'
                        : 'bg-white/25 text-white border border-white/40 hover:bg-white/35 backdrop-blur-md'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Product Cards List (Paginated 25 per page) */}
          <main className="px-5 space-y-3.5 pb-6 flex-1">
            {loading ? (
              <div className="py-12 text-center text-xs text-white/80 font-medium">
                Memuat rekomendasi produk...
              </div>
            ) : paginatedLinks.length > 0 ? (
              paginatedLinks.map((link) => {
                const resolvedImg = resolveImageUrl(link.imageUrl)
                return (
                  <a
                    key={link.id}
                    href={`/api/click/${link.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={cardStyle}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 border border-white/40 group transform hover:-translate-y-0.5"
                  >
                    {/* Left Thumbnail Image Preview */}
                    <div className="w-13 h-13 rounded-xl bg-slate-50 flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-100 shadow-inner">
                      {resolvedImg ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={resolvedImg}
                          alt={link.title}
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#00c98d]/10 text-[#00c98d] flex items-center justify-center font-bold text-xs">
                          PROD
                        </div>
                      )}
                    </div>

                    {/* Right Product Title */}
                    <span className="font-semibold text-xs sm:text-sm line-clamp-2 leading-snug flex-1">
                      {link.title}
                    </span>
                  </a>
                )
              })
            ) : (
              <div className="text-center py-12 text-xs text-white/80 font-medium drop-shadow-sm bg-white/10 rounded-2xl border border-white/20 p-6">
                {selectedCategory !== 'Semua'
                  ? `Belum ada produk di kategori "${selectedCategory}".`
                  : searchQuery
                  ? `Tidak ada produk dengan kata kunci "${searchQuery}".`
                  : 'Belum ada produk yang ditampilkan.'}
              </div>
            )}
          </main>

          {/* Pagination Controls (25 items per page) */}
          {totalPages > 1 && (
            <div className="px-5 pb-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/40 flex items-center justify-center disabled:opacity-30 transition-all"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-bold text-white bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/40 flex items-center justify-center disabled:opacity-30 transition-all"
                title="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Footer Branding */}
          <footer className="py-4 text-center text-xs text-white/80 font-medium">
            Powered by <strong className="text-white">Rececowear</strong>
          </footer>
        </div>
      </div>
    </div>
  )
}
