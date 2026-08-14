'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  Link2,
  Palette,
  BarChart3,
  ShoppingBag,
  Settings,
  HelpCircle,
  LogOut,
  Users,
  Mail,
  MessageSquare,
  Video,
  Ticket,
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (e) {
      console.error('Logout error:', e)
    }
  }

  const menuItems = [
    { label: 'Home', href: '/admin', icon: Home },
    { label: 'My Links', href: '/admin/my-lynk', icon: Link2 },
    { label: 'Appearance', href: '/admin/appearance', icon: Palette },
    { label: 'Statistics', href: '/admin/statistics', icon: BarChart3 },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: '0' },
    { label: 'Tutorials', href: '/admin/tutorials', icon: HelpCircle },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const marketingItems = [
    { label: 'Affiliates', href: '/admin/affiliates', icon: Users },
    { label: 'E-Mail Marketing', href: '/admin/email-marketing', icon: Mail },
    { label: 'WhatsApp Blast', href: '/admin/whatsapp-blast', icon: MessageSquare },
    { label: 'Clip Campaign', href: '/admin/clip-campaign', icon: Video },
    { label: 'Vouchers', href: '/admin/vouchers', icon: Ticket },
  ]

  return (
    <aside className="w-64 bg-[#00c98d] text-white flex flex-col justify-between p-4 min-h-screen shadow-lg select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="bg-white text-slate-800 font-black text-xl px-3 py-1.5 rounded-2xl tracking-tight shadow flex items-center gap-0.5">
            <span className="text-[#ec8aa7]">Receco</span>
            <span className="text-[#80a1d1]">wear</span>
          </div>
        </div>

        {/* Main Menu */}
        <div className="mb-6">
          <p className="text-xs uppercase text-emerald-100 font-semibold mb-3 px-3 tracking-wider">
            Menu
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-white text-[#00c98d] shadow-sm font-bold'
                      : 'text-white hover:bg-emerald-600/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Marketing Tools Section */}
        <div>
          <p className="text-xs uppercase text-emerald-100 font-semibold mb-3 px-3 tracking-wider">
            Marketing Tools
          </p>
          <nav className="space-y-1">
            {marketingItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-emerald-50 hover:bg-emerald-600/30 transition-all opacity-85 hover:opacity-100"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-emerald-400/40">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-rose-100 hover:bg-rose-600/30 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  )
}
