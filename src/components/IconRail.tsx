import { CircleAlert, FileText, Inbox, Menu, PenLine, Send, Star, Trash2 } from 'lucide-react'
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
  onCompose: () => void
}

export default function IconRail({ active, onSelectFolder, onCompose }: IconRailProps) {
  const [expanded, setExpanded] = useState(false)

  /** Row: fixed 44px icon cell at the left; label revealed as the panel glides open. */
  const row = (isActive: boolean) =>
    `flex h-11 w-full items-center gap-3 px-[10px] transition-colors duration-150 ${
      isActive ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
    }`

  const iconCell = 'grid h-11 w-11 shrink-0 place-items-center'

  const label = `min-w-0 flex-1 truncate whitespace-nowrap text-left text-sm font-medium transition-opacity duration-200 ${
    expanded ? 'opacity-100' : 'opacity-0'
  }`

  return (
    /* Fixed 64px footprint — the expanding panel overlays the list instead of pushing it. */
    <aside className="relative h-full w-16 shrink-0">
      <div
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`absolute inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-gray-200 bg-white py-4 transition-[width] duration-200 ease-out ${
          expanded ? 'w-52' : 'w-16'
        }`}
      >
        <div>
          <button className={row(false)} aria-label="Menu">
            <span className={iconCell}>
              <Menu className="h-5 w-5" />
            </span>
            <span className={label}>Menu</span>
          </button>
        </div>

        <div className="pt-1">
          <button
            onClick={onCompose}
            className="flex h-11 w-full items-center gap-3 bg-gray-900 px-[10px] text-white transition-colors duration-150 hover:bg-gray-700"
          >
            <span className={iconCell}>
              <PenLine className="h-5 w-5" />
            </span>
            <span
              className={`min-w-0 flex-1 truncate whitespace-nowrap pr-2 text-left text-sm font-semibold transition-opacity duration-200 ${
                expanded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Compose
            </span>
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1.5">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectFolder(item.id)}
                aria-label={item.label}
                className={row(isActive)}
              >
                <span className={iconCell}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className={label}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-auto">
          <button className={row(false)} aria-label="Account — Rupesh" title="Rupesh (you)">
            <span className={iconCell}>
              <span className="grid h-6 w-6 place-items-center bg-gray-800 text-[10px] font-bold text-white">
                R
              </span>
            </span>
            <span className={label}>Rupesh</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
