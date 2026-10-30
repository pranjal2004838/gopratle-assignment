'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Calendar, Layers } from 'lucide-react'

export default function Navbar() {
  const path = usePathname()

  const linkClass = (href) =>
    `px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm ${
      path === href
        ? 'bg-indigo-50 text-indigo-700 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2.5 text-slate-900 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900">GoPratle</span>
            <span className="text-xs ml-1.5 px-2 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              Requirements
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/" className={linkClass('/')}>
            <Calendar className="w-4 h-4" />
            <span>Post Requirement</span>
          </Link>
          <Link href="/submissions" className={linkClass('/submissions')}>
            <Layers className="w-4 h-4" />
            <span>Submissions</span>
          </Link>
        </nav>

      </div>
    </header>
  )
}
