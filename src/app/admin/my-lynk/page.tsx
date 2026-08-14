'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import MobilePreview from '@/components/admin/MobilePreview'
import { resolveImageUrl } from '@/lib/image-helper'
import {
  Bell,
  Share2,
  Plus,
  Settings as SettingsIcon,
  GripVertical,
  Link as LinkIcon,
  MoreHorizontal,
  Trash2,
  Edit2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'
import { AdminProfile, LinkBlockItem } from '@/types'

export default function MyLynkPage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [links, setLinks] = useState<LinkBlockItem[]>([])
  const [loading, setLoading] = useState(true)

  // Pagination state (30 items per page)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 30

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Form Modal state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)

  // Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState<LinkBlockItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    try {
      const [profRes, linksRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/links'),
      ])
      if (profRes.ok) setProfile(await profRes.json())
      if (linksRes.ok) setLinks(await linksRes.json())
    } catch (e) {
      console.error('Error loading data:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Auto-fill Image Field when Title changes
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    // Automatically match Image Field to Title if it hasn't been manually detached
    if (!imageUrl || imageUrl === title) {
      setImageUrl(newTitle)
    }
  }

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !url) {
      alert('Judul produk dan Link Shopee wajib diisi!')
      return
    }

    const formattedImageUrl = resolveImageUrl(imageUrl)

    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/links/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, url, imageUrl: formattedImageUrl }),
        })
        if (res.ok) {
          await fetchData()
          resetForm()
        }
      } else {
        const res = await fetch('/api/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, url, imageUrl: formattedImageUrl }),
        })
        if (res.ok) {
          await fetchData()
          resetForm()
        }
      }
    } catch (e) {
      console.error('Error saving link:', e)
    } finally {
      setSaving(false)
    }
  }

  // Delete Link Handler with Modal Confirmation & Instant Page Reload
  const confirmDeleteLink = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/links/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteTarget(null)
        // Refresh page immediately after deletion to update list
        window.location.reload()
      }
    } catch (e) {
      console.error('Error deleting link:', e)
    } finally {
      setDeleting(false)
    }
  }

  // Drag and Drop Handler
  const saveReorderedList = async (newList: LinkBlockItem[]) => {
    setLinks(newList)
    const orderedIds = newList.map((item) => item.id)

    try {
      await fetch('/api/links/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      })
    } catch (e) {
      console.error('Error saving order:', e)
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const updated = [...links]
    const [movedItem] = updated.splice(draggedIndex, 1)
    updated.splice(index, 0, movedItem)

    setDraggedIndex(null)
    setDragOverIndex(null)
    saveReorderedList(updated)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const updated = [...links]
    const temp = updated[index]
    updated[index] = updated[index - 1]
    updated[index - 1] = temp
    saveReorderedList(updated)
  }

  const moveDown = (index: number) => {
    if (index === links.length - 1) return
    const updated = [...links]
    const temp = updated[index]
    updated[index] = updated[index + 1]
    updated[index + 1] = temp
    saveReorderedList(updated)
  }

  const startEdit = (link: LinkBlockItem) => {
    setEditingId(link.id)
    setTitle(link.title)
    setUrl(link.url)
    setImageUrl(link.imageUrl)
    setShowForm(true)
  }

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setUrl('')
    setImageUrl('')
    setShowForm(false)
  }

  const previewResolvedUrl = resolveImageUrl(imageUrl)

  // Calculate paginated list for 30 items per page
  const totalPages = Math.ceil(links.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedLinks = links.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">My Links</h1>
          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column: Link Management Controls */}
          <div className="xl:col-span-7 space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button className="px-5 py-2 rounded-full bg-emerald-50 text-[#00c98d] font-bold text-xs border border-emerald-200 shadow-sm">
                My Bio Links
              </button>
              <button className="px-5 py-2 rounded-full bg-slate-100 text-slate-500 font-semibold text-xs hover:bg-slate-200 transition-all">
                Landing Pages
              </button>
            </div>

            {/* Rececowear URL Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-xl flex-1 border border-slate-200">
                <span className="text-slate-400">Website URL:</span>
                <span className="font-bold text-slate-800">
                  https://rececowear.my.id
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#00c98d] border border-[#00c98d] rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </a>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#00c98d] text-white rounded-xl text-xs font-bold hover:bg-[#00b07a] transition-all shadow-sm">
                  <span>Customize URL</span>
                </button>
              </div>
            </div>

            {/* Your Pages Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-700">Your Pages</span>
                <button className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#00c98d] hover:bg-emerald-50 transition-all">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Page</span>
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600">
                  <SettingsIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 bg-[#00c98d] text-white rounded-full text-xs font-bold shadow-sm">
                  Home
                </span>
              </div>
            </div>

            {/* Add New Block Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetForm()
                  setShowForm(true)
                }}
                className="flex-1 py-3 bg-[#00c98d] hover:bg-[#00b57e] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#00c98d]/20 transition-all text-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Add new block</span>
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Add / Edit Form Modal Box */}
            {showForm && (
              <div className="bg-white p-6 rounded-3xl border-2 border-[#00c98d] shadow-lg space-y-4 animate-in fade-in duration-200">
                <h3 className="font-bold text-slate-800 text-base">
                  {editingId ? 'Edit Produk Shopee' : 'Tambah Produk Shopee Baru'}
                </h3>

                <form onSubmit={handleSaveLink} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Judul Produk (Contoh: C023 banyak warna)
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Masukkan judul produk..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#00c98d] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Link Shopee / Affiliate URL
                    </label>
                    <input
                      type="url"
                      required
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://shopee.co.id/product/..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#00c98d] focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Thumbnail Image Input Field (Auto-Filled from Title) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-600">
                      Nama File Gambar Produk (Otomatis Terisi Sama Dengan Judul)
                    </label>
                    
                    <div className="relative">
                      <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Otomatis mengikuti judul (misal: C023)..."
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#00c98d] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2 text-xs text-slate-600">
                      <span className="text-[#00c98d] font-bold text-sm">💡</span>
                      <div>
                        <strong>Fitur Otomatis:</strong> Nama file gambar otomatis mengikuti Judul Produk. Sistem juga <strong>toleran huruf besar/kecil & nama mirip</strong> (misal: <code className="bg-white px-1 py-0.5 rounded text-[11px]">C023.jpeg</code> vs <code className="bg-white px-1 py-0.5 rounded text-[11px]">c023.jpeg</code>).
                        {previewResolvedUrl && (
                          <p className="mt-1 text-[11px] text-emerald-700 font-semibold">
                            URL Gambar: {previewResolvedUrl}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-[#00c98d] hover:bg-[#00b07a] text-white text-xs font-bold rounded-xl shadow transition-all disabled:opacity-50"
                    >
                      {saving ? 'Menyimpan...' : 'Simpan Produk'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Block List with Drag and Drop (Paginated 30 items per page) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Block List ({links.length} total produk)
                </p>
                <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  💡 30 produk per halaman
                </span>
              </div>

              {loading ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  Memuat daftar block...
                </div>
              ) : paginatedLinks.length > 0 ? (
                paginatedLinks.map((link, relativeIndex) => {
                  const absoluteIndex = startIndex + relativeIndex
                  return (
                    <div
                      key={link.id}
                      draggable
                      onDragStart={() => handleDragStart(absoluteIndex)}
                      onDragOver={(e) => handleDragOver(e, absoluteIndex)}
                      onDrop={() => handleDrop(absoluteIndex)}
                      className={`bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between transition-all group ${
                        dragOverIndex === absoluteIndex
                          ? 'border-[#00c98d] bg-emerald-50/40 ring-2 ring-[#00c98d]/20 scale-[1.01]'
                          : 'border-slate-100 hover:border-emerald-200'
                      } ${draggedIndex === absoluteIndex ? 'opacity-40' : 'opacity-100'}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                        {/* Drag handle */}
                        <div
                          className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                          title="Tarik untuk memindahkan urutan"
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>

                        {/* Icon / Image preview */}
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {link.imageUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={resolveImageUrl(link.imageUrl)}
                              alt={link.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <LinkIcon className="w-4 h-4 text-[#00c98d]" />
                          )}
                        </div>

                        {/* Title & URL */}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm text-slate-800 truncate">
                            {link.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
                            <span className="truncate">{link.url}</span>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#00c98d] hover:underline flex items-center gap-0.5"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Quick Move Up/Down & Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200 rounded-xl p-1 mr-1">
                          <button
                            onClick={() => moveUp(absoluteIndex)}
                            disabled={absoluteIndex === 0}
                            className="p-1 text-slate-400 hover:text-[#00c98d] disabled:opacity-30 transition-all"
                            title="Naikkan urutan"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveDown(absoluteIndex)}
                            disabled={absoluteIndex === links.length - 1}
                            className="p-1 text-slate-400 hover:text-[#00c98d] disabled:opacity-30 transition-all"
                            title="Turunkan urutan"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => startEdit(link)}
                          className="p-2 text-slate-400 hover:text-[#00c98d] hover:bg-emerald-50 rounded-xl transition-all"
                          title="Edit Block"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(link)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Hapus Block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                  Belum ada link block. Klik <strong className="text-[#00c98d]">+ Add new block</strong> untuk membuat link produk Shopee pertamamu!
                </div>
              )}
            </div>

            {/* Admin Pagination Controls (30 items per page) */}
            {totalPages > 1 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, links.length)} dari {links.length} produk
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-all text-xs font-bold flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>

                  <span className="text-xs font-bold text-slate-800 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-all text-xs font-bold flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Mobile Preview Simulator */}
          <div className="xl:col-span-5 flex justify-center sticky top-8 self-start">
            <div className="bg-slate-200/60 p-6 rounded-3xl border border-slate-200/80 shadow-inner">
              <MobilePreview profile={profile} links={links} />
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal Dialog (Iya / Tidak) */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-800">
                  Konfirmasi Hapus Produk
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Apakah kamu yakin ingin menghapus produk <strong className="text-slate-800 font-semibold">&quot;{deleteTarget.title}&quot;</strong>?
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  Tidak
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteLink}
                  disabled={deleting}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {deleting ? 'Menghapus...' : 'Iya'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
