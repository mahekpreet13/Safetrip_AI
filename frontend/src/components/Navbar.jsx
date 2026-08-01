import { Link, useLocation } from 'react-router-dom'
import { Compass } from 'lucide-react'

const navLinks = [
  { label: 'Itineraries', path: '/' },
  { label: 'Safety Index', path: '/dashboard' },
  { label: 'Map Explorer', path: '/map' },
  { label: 'Saved Plans', path: '/saved' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-ink text-paper px-6 py-4 flex items-center justify-between border-b border-white/10">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="bg-signal text-ink p-1.5 rounded-md">
          <Compass size={16} strokeWidth={2.5} />
        </div>
        <div>
          <span className="font-display text-lg font-medium leading-none block">SafeTrip AI</span>
          <span className="text-[10px] font-mono text-paper/40 tracking-widest uppercase">Field Safety Guide</span>
        </div>
      </Link>

      <div className="flex gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm px-3.5 py-2 rounded-md transition-colors ${
              location.pathname === link.path
                ? 'text-ink bg-signal font-medium'
                : 'text-paper/70 hover:text-paper hover:bg-white/5'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Link
        to="/profile"
        className="text-sm font-medium text-paper/70 hover:text-paper border border-white/15 hover:border-white/30 rounded-full px-4 py-1.5 transition"
      >
        Profile
      </Link>
    </nav>
  )
}