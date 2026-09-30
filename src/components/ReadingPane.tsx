import {
  ArrowLeft,
  Archive,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CircleAlert,
  Download,
  Link2,
  MoreVertical,
  Paperclip,
  Pencil,
  Reply,
  Share,
  Smile,
  Trash2,
  Underline,
  Bold,
  Italic,
  Image as ImageIcon,
  Forward,
  Printer,
  Star,
  Send as SendIcon,
  X,
  Maximize2,
} from 'lucide-react'
import type { Attachment, Email } from '../data/emails'
import Avatar from './Avatar'
import { useState } from 'react'

interface ReadingPaneProps {
  mail: Email
  index: number
  total: number
  onBack: () => void
  onPrev: () => void
  onNext: () => void
  onToggleStar: (id: string) => void
  onDelete: (id: string) => void
}

const kindStyles: Record<string, string> = {
  pdf: 'bg-red-600',
  zip: 'bg-emerald-600',
  img: 'bg-violet-600',
  doc: 'bg-blue-600',
  xls: 'bg-green-700',
  ppt: 'bg-orange-600',
  code: 'bg-gray-700',
}

const kindLabels: Record<string, string> = {
  pdf: 'PDF',
  zip: 'ZIP',
  img: 'IMG',
  doc: 'DOC',
  xls: 'XLS',
  ppt: 'PPT',
  code: 'JSON',
}

function AttachmentChip({ att }: { att: Attachment }) {
  return (
    <div className="flex max-w-[260px] items-center gap-2 border border-gray-200 bg-gray-50 px-2.5 py-1.5 transition-colors hover:border-gray-400">
      <div
        className={`grid h-[18px] w-[18px] shrink-0 place-items-center text-[7px] font-bold text-white ${kindStyles[att.kind] ?? 'bg-gray-500'}`}
      >
        {kindLabels[att.kind] ?? 'FILE'}
      </div>
      <span className="truncate text-xs font-medium text-gray-700">{att.name}</span>
      <span className="shrink-0 text-[11px] text-gray-400">{att.size}</span>
      <button
        aria-label={`Download ${att.name}`}
        className="shrink-0 text-gray-300 transition-colors hover:text-gray-600"
      >
        <Download className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default function ReadingPane({
  mail,
  index,
  total,
  onBack,
  onPrev,
  onNext,
  onToggleStar,
  onDelete,
}: ReadingPaneProps) {
  const [reply, setReply] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [font, setFont] = useState('Inter')
  const [fontOpen, setFontOpen] = useState(false)
  const [composerOpen, setComposerOpen] = useState(false)

  const fontOptions: { label: string; stack: string }[] = [
    { label: 'Inter', stack: '"Inter", sans-serif' },
    { label: 'Arial', stack: 'Arial, sans-serif' },
    { label: 'Georgia', stack: 'Georgia, serif' },
    { label: 'Times New Roman', stack: '"Times New Roman", serif' },
    { label: 'Courier New', stack: '"Courier New", monospace' },
  ]
  const activeFont = fontOptions.find((f) => f.label === font) ?? fontOptions[0]

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }

  const send = () => {
    if (!reply.trim()) return
    showToast('Message sent')
    setReply('')
  }

  const iconBtn =
    'grid h-9 w-9 place-items-center text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'

  return (
    <section className="relative flex h-full min-w-0 flex-1 flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
        <div className="flex items-center gap-1">
          <button onClick={onBack} className={iconBtn} aria-label="Back" title="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => showToast('Conversation archived')}
            className={iconBtn}
            aria-label="Archive"
            title="Archive"
          >
            <Archive className="h-5 w-5" />
          </button>
          <button onClick={() => showToast('Marked as spam')} className={iconBtn} aria-label="Report spam" title="Report spam">
            <CircleAlert className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center border border-gray-200 px-0.5">
          <button
            onClick={onPrev}
            disabled={index < 0 || index <= 0}
            className={`${iconBtn} disabled:opacity-30`}
            aria-label="Previous email"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="px-2 text-xs font-semibold text-gray-600">
            {index >= 0 ? `${index + 1} of ${total}` : `${total} in view`}
          </span>
          <button
            onClick={onNext}
            disabled={index < 0 || index >= total - 1}
            className={`${iconBtn} disabled:opacity-30`}
            aria-label="Next email"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => showToast('Share link copied')} className={iconBtn} aria-label="Share" title="Share">
            <Share className="h-5 w-5" />
          </button>
          <button className={iconBtn} aria-label="More" title="More">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Scrollable message area */}
      <div className="slim-scroll flex-1 overflow-y-auto">
        {/* Sender header */}
        <div className="flex items-start justify-between px-6 pb-2 pt-5">
          <div className="flex items-center gap-4">
            <Avatar name={mail.from} src={mail.avatar} color={mail.color} size="lg" />
            <div>
              <p className="text-[15px] font-semibold text-gray-900">{mail.from}</p>
              <p className="text-sm text-gray-400">{mail.email}</p>
            </div>
          </div>
          <p className="pt-1 text-sm text-gray-400">{mail.time}</p>
        </div>

        {/* Subject + body */}
        <div className="px-6 pb-8">
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{mail.subject}</h2>
          <div className="mt-5 space-y-4">
            {mail.body.map((para, i) => (
              <p key={i} className="max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-gray-700">
                {para}
              </p>
            ))}
          </div>

          {/* Attachments */}
          {mail.attachments.length > 0 && (
            <div className="-mx-6 mt-8 border-b border-gray-200 px-6 pb-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500">
                  {mail.attachments.length} Attachment{mail.attachments.length > 1 ? 's' : ''}
                </h3>
                <button
                  onClick={() => showToast('Preparing download…')}
                  className="text-xs font-medium text-gray-500 transition-colors duration-150 hover:text-gray-800"
                >
                  Download All
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {mail.attachments.map((att) => (
                  <AttachmentChip key={att.id} att={att} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reply composer — collapsed by default; tinted zone when open */}
        <div className={composerOpen ? '-mx-6 bg-gray-50 px-6 pb-6' : '-mx-6 bg-gray-50 px-6 py-1'}>
          {composerOpen ? (
          <div>
            {/* To row */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <button className={iconBtn + ' h-8 w-8'} aria-label="Reply mode">
                  <Reply className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-500">To:</span>
                <span className="flex items-center gap-1.5 border border-gray-200 bg-gray-50 py-1 pl-2.5 pr-2.5 text-xs font-medium text-gray-700">
                  {mail.from}
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <button className="transition-colors hover:text-gray-600">Cc</button>
                <button className="transition-colors hover:text-gray-600">Bcc</button>
                <button
                  onClick={() => setComposerOpen(false)}
                  className={iconBtn + ' h-8 w-8'}
                  aria-label="Collapse composer"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button className={iconBtn + ' h-8 w-8'} aria-label="Fullscreen">
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Textarea + format toolbar — one continuous body */}
            <div className="flex items-start gap-3 px-4 pt-3">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a reply…"
                rows={2}
                style={{ fontFamily: activeFont.stack }}
                className="min-w-0 flex-1 resize-none bg-transparent text-sm leading-relaxed text-gray-700 outline-none placeholder:text-gray-400"
              />
              <div className="relative mt-0.5 shrink-0">
                <div className="flex items-center border border-gray-200 bg-white px-0.5 py-0.5">
                  <button
                    onClick={() => setFontOpen((o) => !o)}
                    className="flex items-center gap-0.5 px-1.5 py-1 text-[11px] font-medium text-gray-800 transition-colors duration-150 hover:bg-gray-100"
                    aria-label="Font family"
                  >
                    {font}
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </button>
                  <button className={iconBtn + ' h-7 w-7 text-gray-800 hover:text-gray-900'} aria-label="Bold">
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button className={iconBtn + ' h-7 w-7'} aria-label="Italic">
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button className={iconBtn + ' h-7 w-7'} aria-label="Underline">
                    <Underline className="h-3.5 w-3.5" />
                  </button>

                  {fontOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setFontOpen(false)} />
                      <div className="absolute right-0 top-full z-20 mt-1 w-44 border border-gray-200 bg-white py-1">
                        {fontOptions.map((f) => (
                          <button
                            key={f.label}
                            onClick={() => {
                              setFont(f.label)
                              setFontOpen(false)
                            }}
                            style={{ fontFamily: f.stack }}
                            className={`block w-full px-3 py-1.5 text-left text-sm transition-colors duration-150 hover:bg-gray-100 ${
                              f.label === font ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
          ) : (
            <button
              onClick={() => setComposerOpen(true)}
              className="flex w-full items-center gap-3 px-2 py-2.5 text-left transition-colors duration-150 hover:bg-gray-100"
            >
              <Reply className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="min-w-0 truncate text-sm text-gray-500">
                Write a reply to <span className="font-medium text-gray-700">{mail.from}</span>…
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom action bar — visible while composing */}
      {composerOpen && (
      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
        <div className="flex items-center gap-0.5">
          <button onClick={() => showToast('Attach a file')} className={iconBtn} aria-label="Attach">
            <Paperclip className="h-4 w-4" />
          </button>
          <button onClick={() => showToast('Insert link')} className={iconBtn} aria-label="Insert link">
            <Link2 className="h-4 w-4" />
          </button>
          <button onClick={() => showToast('Insert image')} className={iconBtn} aria-label="Insert image">
            <ImageIcon className="h-4 w-4" />
          </button>
          <button onClick={() => showToast('Signature pad')} className={iconBtn} aria-label="Signature">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => showToast('Emoji picker')} className={iconBtn} aria-label="Emoji">
            <Smile className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => showToast('Draft discarded')} className={iconBtn} aria-label="Discard">
            <Trash2 className="h-4 w-4" />
          </button>
          <button className={iconBtn} aria-label="More options">
            <MoreVertical className="h-4 w-4" />
          </button>
          <button
            onClick={send}
            className="ml-1 flex items-center gap-2 border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors duration-150 hover:bg-gray-200"
          >
            Send now
            <SendIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      )}

      {/* Mail actions — Reply/Forward/Print + Star/Delete */}
      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-2.5">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setComposerOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
          >
            <Reply className="h-4 w-4" /> Reply
          </button>
          <button
            onClick={() => showToast('Forward mode — use the composer above')}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
          >
            <Forward className="h-4 w-4" /> Forward
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={() => onToggleStar(mail.id)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              mail.starred ? 'text-amber-500' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Star className={`h-4 w-4 ${mail.starred ? 'fill-amber-400' : ''}`} />
            {mail.starred ? 'Starred' : 'Star'}
          </button>
          <button
            onClick={() => onDelete(mail.id)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-50 -translate-x-1/2 border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-white">
          {toast}
        </div>
      )}
    </section>
  )
}
