'use client'

import { useState } from 'react'
import { Search, User as UserIcon } from 'lucide-react'
import { AdminProfile, LinkBlockItem } from '@/types'
import { resolveImageUrl, handleImageError } from '@/lib/image-helper'
import { CATEGORIES, CategoryName, detectCategory } from '@/lib/category-helper'

interface MobilePreviewProps {
  profile?: AdminProfile | null
  links?: LinkBlockItem[]
}

export default function MobilePreview({ profile, links }: MobilePreviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>('Semua')

  // Fixed signature 3-color gradient background (#ec8aa7, #80a1d1, #e6afbf)
  const bgStyle = {
    background: 'linear-gradient(135deg, #ec8aa7 0%, #80a1d1 50%, #e6afbf 100%)',
  }

  const cardStyle = {
    backgroundColor: profile?.cardBackgroundColor || '#ffffff',
    color: profile?.cardTextColor || '#333333',
  }

  const filteredLinks = links?.filter((l) => {
    if (!l.isActive) return false
    if (selectedCategory !== 'Semua') {
      const cat = detectCategory(l.title)
      if (cat !== selectedCategory) return false
    }
    return true
  })

  return (
    <div className="flex flex-col items-center">
      <p className="text-[#333333] font-bold text-base mb-4 self-start">Page Preview</p>

      {/* Phone Body Container matching Screenshot 1 & 3 */}
      <div className="w-[320px] h-[640px] bg-slate-800 rounded-[42px] p-3 shadow-2xl border-4 border-slate-700 relative overflow-hidden flex flex-col">
        {/* Top Phone Notch / Speaker Bar */}
        <div className="w-28 h-4 bg-slate-900 rounded-b-xl mx-auto flex items-center justify-center gap-1.5 z-20">
          <div className="w-8 h-1 bg-slate-700 rounded-full" />
          <div className="w-2 h-2 bg-slate-800 rounded-full" />
        </div>

        {/* Smartphone Screen Viewport with Fixed Signature 3-Color Gradient Background */}
        <div
          className="flex-1 rounded-[30px] overflow-y-auto flex flex-col relative text-slate-800 transition-all duration-300"
          style={bgStyle}
        >
          {/* Header Navigation Bar */}
          <div className="bg-[#444444] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <span className="font-bold text-sm mx-auto pl-5">Home</span>
            <Search className="w-4 h-4 text-slate-200 cursor-pointer" />
          </div>

          {/* Profile Section Header */}
          <div className="flex flex-col items-center pt-5 pb-3 px-4 text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-md border-2 border-white mb-2">
              {profile?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={resolveImageUrl(profile.avatarUrl)}
                  alt={profile.displayName || 'Avatar'}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-9 h-9 text-white" />
              )}
            </div>
            <h2 className="font-bold text-sm tracking-tight text-white drop-shadow-sm">
              @{profile?.username || 'rececowear'}
            </h2>
          </div>

          {/* Category Filter Pills Grid (Balanced 3-Column Layout for 12 categories) */}
          <div className="px-4 pb-3">
            <div className="grid grid-cols-3 gap-1.5 max-w-[260px] mx-auto text-center">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-1.5 px-1 rounded-full text-[11px] font-bold transition-all shadow-sm ${
                      isActive
                        ? 'bg-white text-slate-800 shadow scale-105 border border-[#ec8aa7]'
                        : 'bg-white/25 text-white border border-white/30 hover:bg-white/35 backdrop-blur-md'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Product Links List matching Screenshot 1 */}
          <div className="px-4 space-y-3 pb-8 flex-1">
            {filteredLinks && filteredLinks.length > 0 ? (
              filteredLinks.map((link) => {
                const resolvedImg = resolveImageUrl(link.imageUrl)
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    style={cardStyle}
                    className="flex items-center gap-3 p-3 rounded-xl shadow-md hover:shadow-lg transition-all border border-white/40 group"
                  >
                    {/* Left Thumbnail Preview Image */}
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-200">
                      {resolvedImg ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={resolvedImg}
                          alt={link.title}
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#00c98d]/20 text-[#00c98d] flex items-center justify-center font-bold text-xs">
                          PROD
                        </div>
                      )}
                    </div>

                    {/* Product Title */}
                    <span className="font-medium text-xs line-clamp-2 leading-snug flex-1">
                      {link.title}
                    </span>
                  </a>
                )
              })
            ) : (
              <div className="text-center py-8 text-xs text-white/80 font-medium drop-shadow-sm bg-white/10 rounded-2xl border border-white/20 p-4">
                Belum ada produk di kategori &quot;{selectedCategory}&quot;.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
