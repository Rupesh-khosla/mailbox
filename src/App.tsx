import { useMemo, useState } from 'react'
import { Mail } from 'lucide-react'
import { emails as seedEmails, type Email } from './data/emails'
import IconRail, { type Folder } from './components/IconRail'
import EmailList, { type Filter, type SortOrder } from './components/EmailList'
import ReadingPane from './components/ReadingPane'
import ComposeModal, { type ComposeData } from './components/ComposeModal'

const folderTitles: Record<Folder, string> = {
  inbox: 'Inbox',
  starred: 'Starred',
  sent: 'Sent',
  drafts: 'Drafts',
  alerts: 'Alerts',
  trash: 'Trash',
}

const folderEmpty: Record<Folder, string> = {
  inbox: 'No emails match your search or filters.',
  starred: 'Nothing starred yet. Hover a card and hit the star.',
  sent: 'No sent messages yet.',
  drafts: 'No drafts. Compose something!',
  alerts: 'No alerts. All clear!',
  trash: 'Trash is empty.',
}

export default function App() {
  const [mails, setMails] = useState<Email[]>(seedEmails)
  const [folder, setFolder] = useState<Folder>('inbox')
  const [selectedId, setSelectedId] = useState<string | null>('1')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<SortOrder>('recent')

  const [trash, setTrash] = useState<string[]>([])

  /** Folder membership: trash holds deleted mail; sent holds composed mail; drafts empty. */
  const visible = useMemo(() => {
    if (folder === 'drafts') return []
    let list =
      folder === 'sent'
        ? mails.filter((m) => m.id.startsWith('sent-'))
        : folder === 'trash'
          ? mails.filter((m) => trash.includes(m.id))
          : mails.filter((m) => !trash.includes(m.id) && !m.id.startsWith('sent-'))

    if (folder === 'starred') list = list.filter((m) => m.starred)
    if (folder === 'alerts') list = list.filter((m) => m.unread)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (m) =>
          m.from.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.snippet.toLowerCase().includes(q),
      )
    }
    if (filter === 'unread') list = list.filter((m) => m.unread)
    if (filter === 'starred') list = list.filter((m) => m.starred)
    if (filter === 'attachments') list = list.filter((m) => m.attachments.length > 0)

    return [...list].sort((a, b) => (sort === 'recent' ? b.recency - a.recency : a.recency - b.recency))
  }, [mails, folder, search, filter, sort, trash])

  const selectedIndex = visible.findIndex((m) => m.id === selectedId)
  // Keep the reading pane on the opened mail even if filters/search hide it from the list.
  const selected = mails.find((m) => m.id === selectedId) ?? null

  const openMail = (id: string) => {
    setSelectedId(id)
    setMails((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)))
  }

  const toggleStar = (id: string) =>
    setMails((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)))

  const deleteMail = (id: string) => {
    setTrash((prev) => [...prev, id])
    if (selectedId === id) setSelectedId(null)
  }

  const [composeOpen, setComposeOpen] = useState(false)
  const [composeDraft, setComposeDraft] = useState<Partial<ComposeData> | undefined>(undefined)

  const recipientsLine = (raw: string) =>
    raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .join(', ')

  const buildMail = (id: string, data: ComposeData): Email => ({
    id,
    from: recipientsLine(data.to),
    email: data.to,
    subject: data.subject || '(no subject)',
    snippet:
      data.body.slice(0, 70) + (data.body.length > 70 ? '...' : '') || '(no content)',
    body: data.body ? [data.body] : ['(no content)'],
    time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    day: 'Today',
    unread: false,
    starred: false,
    attachments: data.attachments.map((a, i) => ({ id: `${id}-a${i}`, ...a })),
    color: 'bg-gray-600',
    avatar: '',
    recency: 101,
  })

  const sendMail = (data: ComposeData) => {
    const newMail = buildMail(`sent-${Date.now()}`, data)
    setMails((prev) => [newMail, ...prev])
    setComposeOpen(false)
    setComposeDraft(undefined)
    setFolder('sent')
    setSelectedId(newMail.id)
  }

  const saveDraft = (data: ComposeData) => {
    const newMail = buildMail(`draft-${Date.now()}`, data)
    setMails((prev) => [newMail, ...prev])
    setComposeOpen(false)
    setComposeDraft(undefined)
    setFolder('drafts')
    setSelectedId(null)
  }

  const openCompose = (prefill?: Partial<ComposeData>) => {
    setComposeDraft(prefill)
    setComposeOpen(true)
  }

  /** Clicking a draft reopens the compose window prefilled and removes the draft entry. */
  const editDraft = (id: string) => {
    const mail = mails.find((m) => m.id === id)
    if (!mail) return
    openCompose({
      to: mail.email,
      subject: mail.subject === '(no subject)' ? '' : mail.subject,
      body: mail.body.join('\n\n') === '(no content)' ? '' : mail.body.join('\n\n'),
      attachments: mail.attachments.map(({ name, size, kind }) => ({ name, size, kind })),
    })
    setMails((prev) => prev.filter((m) => m.id !== id))
    setSelectedId(null)
  }

  const step = (dir: 1 | -1) => {
    if (selectedIndex < 0) return
    const next = visible[selectedIndex + dir]
    if (next) openMail(next.id)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      {composeOpen && (
        <ComposeModal
          initial={composeDraft}
          onClose={() => {
            setComposeOpen(false)
            setComposeDraft(undefined)
          }}
          onSend={sendMail}
          onSaveDraft={saveDraft}
        />
      )}
      <IconRail
        active={folder}
        onSelectFolder={(f) => {
          setFolder(f)
          setFilter('all')
          setSelectedId(null)
        }}
        onCompose={() => setComposeOpen(true)}
      />

      <EmailList
        title={folderTitles[folder]}
        onCompose={() => openCompose()}
        onEditDraft={editDraft}
        emails={visible}
        selectedId={selectedId}
        search={search}
        filter={filter}
        sort={sort}
        emptyMessage={folderEmpty[folder]}
        onSearch={setSearch}
        onFilterChange={setFilter}
        onSortChange={setSort}
        onSelect={openMail}
        onToggleStar={toggleStar}
      />

      {selected ? (
        <ReadingPane
          key={selected.id}
          mail={selected}
          index={selectedIndex}
          total={visible.length}
          onBack={() => setSelectedId(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onToggleStar={toggleStar}
          onDelete={deleteMail}
        />
      ) : (
        <section className="hidden min-w-0 flex-1 items-center justify-center bg-white md:flex">
          <div className="text-center">
            <div className="mx-auto grid place-items-center text-gray-300">
              <Mail className="h-12 w-12" strokeWidth={1.25} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-800">Select an email</h2>
            <p className="mt-1 text-sm text-gray-400">
              Pick a message from the list to read it here.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
