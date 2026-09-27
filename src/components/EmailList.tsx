import { Paperclip, Search, ChevronDown, Star } from 'lucide-react'
import type { Email } from '../data/emails'
import Avatar from './Avatar'

export type Filter = 'all' | 'unread' | 'starred' | 'attachments'
export type SortOrder = 'recent' | 'oldest'

interface EmailListProps {
  title: string
  emails: Email[]
  selectedId: string | null
  search: string
  filter: Filter
  sort: SortOrder
  emptyMessage: string
  onSearch: (q: string) => void
  onFilterChange: (f: Filter) => void
  onSortChange: (s: SortOrder) => void
  onSelect: (id: string) => void
  onToggleStar: (id: string) => void
}

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'starred', label: 'Starred' },
  { id: 'attachments', label: 'Attachments' },
]

export default function EmailList({
  title,
  emails,
  selectedId,
  search,
  filter,
  sort,
  emptyMessage,
  onSearch,
  onFilterChange,
  onSortChange,
  onSelect,
  onToggleStar,
}: EmailListProps) {
  return (
    <section className="flex h-full w-[340px] shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Title + sort */}
      <div className="flex items-center justify-between px-5 pb-2 pt-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        <button
          onClick={() => onSortChange(sort === 'recent' ? 'oldest' : 'recent')}
          className="flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
        >
          {sort === 'recent' ? 'Recent' : 'Oldest'}
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-5 pb-3 pt-1">
        <div className="flex items-center gap-2 border border-gray-200 px-3 py-2.5 transition-colors focus-within:border-gray-900">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-5 pb-3">
        {filters.map((f) => {
          const count =
            f.id === 'all' ? emails.length : f.id === 'unread' ? emails.filter((e) => e.unread).length : undefined
          return (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`border px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.id
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700'
              }`}
            >
              {f.label}
              {count !== undefined && count > 0 && (
                <span className={`ml-1 ${filter === f.id ? 'text-gray-400' : 'text-gray-400'}`}>{count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Rows — borderless, separated by hairline dividers */}
      <div className="slim-scroll flex-1 overflow-y-auto border-t border-gray-200 pb-4">
        {emails.length === 0 && (
          <p className="px-3 py-10 text-center text-sm text-gray-400">{emptyMessage}</p>
        )}

        {emails.map((mail) => {
          const selected = mail.id === selectedId
          return (
            <article
              key={mail.id}
              onClick={() => onSelect(mail.id)}
              className={`group relative cursor-pointer border-b border-gray-100 py-3.5 pl-4 pr-4 transition-colors ${
                selected ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              {/* Top row: avatar | name + dot … paperclip */}
              <div className="flex items-start gap-3">
                <Avatar name={mail.from} src={mail.avatar} color={mail.color} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-gray-700">
                      {mail.from}
                    </span>
                    {mail.attachments.length > 0 && (
                      <Paperclip className="h-4 w-4 shrink-0 text-gray-300" />
                    )}
                  </div>

                  {/* Subject */}
                  <h3
                    className={`mt-1 truncate text-[15px] ${
                      mail.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'
                    }`}
                  >
                    {mail.subject}
                  </h3>

                  {/* Snippet */}
                  <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-gray-500">
                    {mail.snippet}
                  </p>

                  {/* Bottom row: star (hover) + time bottom-right */}
                  <div className="mt-1.5 flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleStar(mail.id)
                      }}
                      aria-label={mail.starred ? 'Unstar' : 'Star'}
                      className={`grid h-6 w-6 place-items-center transition-colors ${
                        mail.starred ? 'text-amber-500' : 'text-gray-300 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${mail.starred ? 'fill-amber-400' : ''}`} />
                    </button>
                    <span className="text-xs text-gray-400">{mail.time}</span>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
