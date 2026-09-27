import { CircleAlert, FileText, Inbox, Menu, Moon, Send, Star, Sun, Trash2 } from 'lucide-react'
import { useState } from 'react'

export type Folder = 'inbox' | 'starred' | 'sent' | 'drafts' | 'alerts' | 'trash'

interface RailItem {
  id: Folder
  icon: typeof Inbox
  label: string
}

const items: RailItem[] = [
  { id: 'inbox', icon: Inbox, label: 'Inbox' },
  { id: 'starred', icon: Star, label: 'Starred' },
  { id: 'sent', icon: Send, label: 'Sent' },
  { id: 'drafts', icon: FileText, label: 'Drafts' },
  { id: 'alerts', icon: CircleAlert, label: 'Alerts' },
  { id: 'trash', icon: Trash2, label: 'Trash' },
]

interface IconRailProps {
  active: Folder
  onSelectFolder: (folder: Folder) => void
}

export default function IconRail({ active, onSelectFolder }: IconRailProps) {
  const [dark, setDark] = useState(false)

  return (
    <aside className="flex h-full w-16 shrink-0 flex-col items-center border-r border-gray-100 bg-white py-4">
      <button
        className="grid h-10 w-10 place-items-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <nav className="mt-4 flex flex-col items-center gap-1.5">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSelectFolder(item.id)}
              aria-label={item.label}
              className={`group relative grid h-11 w-11 place-items-center transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />

              <span className="pointer-events-none absolute left-full z-50 ml-2 hidden whitespace-nowrap bg-gray-900 px-2 py-1 text-xs font-medium text-white group-hover:block">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto">
        <button
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle theme"
          className="grid h-10 w-10 place-items-center text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          {dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  )
}
