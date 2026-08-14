'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import MobilePreview from '@/components/admin/MobilePreview'
import { compressImageFile } from '@/lib/compress'
import { Bell, Upload, Palette, User, Check, Lock } from 'lucide-react'
import { AdminProfile, LinkBlockItem } from '@/types'

export default function AppearancePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [links, setLinks] = useState<LinkBlockItem[]>([])
  const [loading, setLoading] = useState(true)

  // Profile Form States
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  
  // Fixed signature 3-color gradient background
  const fixedGradient = 'linear-gradient(135deg, #ec8aa7 0%, #80a1d1 50%, #e6afbf 100%)'
  
  const [cardBackgroundColor, setCardBackgroundColor] = useState('#ffffff')
  const [cardTextColor, setCardTextColor] = useState('#333333')

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const presetsCardBg = ['#ffffff', '#f8fafc', '#f1f5f9', '#e0f2fe', '#fef3c7', '#1e293b', '#00c98d']
  const presetsCardText = ['#333333', '#0f172a', '#00c98d', '#2563eb', '#dc2626', '#ffffff']

  useEffect(() => {
    async function fetchData() {
      try {
        const [profRes, linksRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/links'),
        ])
        if (profRes.ok) {
          const profData: AdminProfile = await profRes.json()
          setProfile(profData)
          setDisplayName(profData.displayName || 'Rececowear')
          setUsername(profData.username || 'rececowear')
          setBio(profData.bio || '')
          setAvatarUrl(profData.avatarUrl || '')
          setCardBackgroundColor(profData.cardBackgroundColor || '#ffffff')
          setCardTextColor(profData.cardTextColor || '#333333')
        }
        if (linksRes.ok) setLinks(await linksRes.json())
      } catch (e) {
        console.error('Error fetching data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Compress avatar logo client-side
      const compressedBase64 = await compressImageFile(file, 400, 0.8)

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: compressedBase64 }),
      })
      const data = await res.json()
      if (res.ok && data.imageUrl) {
        setAvatarUrl(data.imageUrl)
      } else {
        alert('Gagal mengunggah foto profil')
      }
    } catch {
      alert('Gagal mengunggah foto profil')
    } finally {
      setUploading(false)
    }
  }

  const handleSaveAppearance = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          username,
          bio,
          avatarUrl,
          backgroundColor: fixedGradient,
          cardBackgroundColor,
          cardTextColor,
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setProfile(updated)
        setMessage('Penampilan berhasil diperbarui!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (e) {
      console.error('Error saving appearance:', e)
    } finally {
      setSaving(false)
    }
  }

  const livePreviewProfile: AdminProfile = {
    id: profile?.id || '1',
    username,
    displayName,
    bio,
    avatarUrl,
    backgroundColor: fixedGradient,
    cardBackgroundColor,
    cardTextColor,
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Appearance</h1>
          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-[#00c98d] px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column: Appearance Settings */}
          <div className="xl:col-span-7 space-y-6">
            <form onSubmit={handleSaveAppearance} className="space-y-6">
              {/* Profile Card Settings */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <User className="w-5 h-5 text-[#00c98d]" />
                  <span>Profile Info (Logo & Username)</span>
                </h3>

                {/* Avatar Upload */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-[#00c98d] flex items-center justify-center text-slate-400">
                    {avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#00c98d] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#00b07a] transition-all shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? 'Mengompres & Mengunggah...' : 'Ubah Logo / Avatar'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Upload logo brand atau foto profil kamu.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#00c98d] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Username Handle (@)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#00c98d] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Theme & Colors Customizer */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#00c98d]" />
                  <span>Kustomisasi Warna</span>
                </h3>

                {/* 1. Locked Fixed Background Gradient Display */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Warna Background Halaman (Permanen)
                    </label>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <Lock className="w-3 h-3" />
                      <span>Gradasi Tetap</span>
                    </span>
                  </div>

                  {/* Gradient Display Box */}
                  <div
                    className="w-full h-14 rounded-2xl border-2 border-slate-200 shadow-inner p-3 flex items-center justify-between text-white font-bold text-xs"
                    style={{ background: fixedGradient }}
                  >
                    <span className="drop-shadow">#ec8aa7 → #80a1d1 → #e6afbf</span>
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Active Theme</span>
                    </div>
                  </div>
                </div>

                {/* 2. Link Card Background Color */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Warna Background Card Produk
                  </label>
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="color"
                      value={cardBackgroundColor}
                      onChange={(e) => setCardBackgroundColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      value={cardBackgroundColor}
                      onChange={(e) => setCardBackgroundColor(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {presetsCardBg.map((c, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCardBackgroundColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${
                          cardBackgroundColor === c ? 'border-[#00c98d] scale-110' : 'border-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* 3. Link Card Text Color */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Warna Teks Judul Produk
                  </label>
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="color"
                      value={cardTextColor}
                      onChange={(e) => setCardTextColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      value={cardTextColor}
                      onChange={(e) => setCardTextColor(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {presetsCardText.map((c, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCardTextColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${
                          cardTextColor === c ? 'border-[#00c98d] scale-110' : 'border-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 bg-[#00c98d] hover:bg-[#00b07a] text-white font-bold rounded-2xl shadow-lg shadow-[#00c98d]/25 transition-all text-sm disabled:opacity-50"
              >
                {saving ? 'Menyimpan Perubahan...' : 'Simpan Penampilan'}
              </button>
            </form>
          </div>

          {/* Right Column: Live Mobile Preview */}
          <div className="xl:col-span-5 flex justify-center sticky top-8 self-start">
            <div className="bg-slate-200/60 p-6 rounded-3xl border border-slate-200/80 shadow-inner">
              <MobilePreview profile={livePreviewProfile} links={links} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
