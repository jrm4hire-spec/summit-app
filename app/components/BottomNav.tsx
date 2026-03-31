'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Explore', icon: '🏔' },
  { href: '/trips', label: 'Trip Planning', icon: '🗺' },
  { href: '/climbs', label: 'My Climbs', icon: '📋' },
  { href: '/profile', label: 'Profile', icon: '👤' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 text-xs px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}