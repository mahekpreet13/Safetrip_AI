import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 p-4 hidden md:block">
      <ul className="space-y-2">
        <li>
          <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700">
            Home
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/map" className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700">
            Map
          </Link>
        </li>
      </ul>
    </aside>
  )
}