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
  Minimize2,
} from 'lucide-react'
import type { Attachment, Email } from '../data/emails'
import Avatar from './Avatar'
import { useRef, useState } from 'react'
import { EMOJIS, fmtSize, kindFor, type ComposeData } from './ComposeModal'

interface ReadingPaneProps {
  mail: Email
  index: number
  total: number
  onBack: () => void
  onPrev: () => void
  onNext: () => void
  onToggleStar: (id: string) => void
  onDelete: (id: string) => void
  onSendReply: (data: ComposeData) => void
  onSaveReplyDraft: (data: ComposeData) => void
  onMarkUnread: (id: string) => void
  onForward: (mail: Email) => void
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

function AttachmentChip({ att, onDownload }: { att: Attachment; onDownload: (att: Attachment) => void }) {
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
        onClick={() => onDownload(att)}
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
  onSendReply,
  onSaveReplyDraft,
  onMarkUnread,
  onForward,
}: ReadingPaneProps) {
  const [toast, setToast] = useState<string | null>(null)
  const [font, setFont] = useState('Inter')
  const [fontOpen, setFontOpen] = useState(false)
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerFull, setComposerFull] = useState(false)
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [toVisible, setToVisible] = useState(true)
  const [files, setFiles] = useState<Attachment[]>([])
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [composerMenuOpen, setComposerMenuOpen] = useState(false)
  const [toolbarMenuOpen, setToolbarMenuOpen] = useState(false)

  const bodyRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const savedRange = useRef<Range | null>(null)

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

  /* ---------- rich-text helpers (keep the caret alive across toolbar clicks) ---------- */

  const saveSelection = () => {
    const sel = document.getSelection()
    if (sel && sel.rangeCount > 0 && bodyRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0)
    }
  }

  const exec = (cmd: string, value?: string) => {
    bodyRef.current?.focus()
    if (savedRange.current) {
      const sel = document.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(savedRange.current)
    }
    document.execCommand(cmd, false, value)
  }

  const insertLink = () => {
    const url = window.prompt('Link URL', 'https://')
    if (!url) return
    const sel = document.getSelection()
    if (sel && !sel.isCollapsed) exec('createLink', url)
    else exec('insertHTML', `<a href="${url}">${url}</a>`)
  }

  const insertImage = (list: FileList | null) => {
    const f = list?.[0]
    if (!f) return
    exec('insertHTML', `<img src="${URL.createObjectURL(f)}" alt="${f.name}" style="max-width:100%" />`)
  }

  const insertSignature = () => exec('insertHTML', '<br /><br />Best regards,<br />Rupesh')

  /* ---------- draft helpers ---------- */

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const next: Attachment[] = [...list].map((f, i) => ({
      id: `file-${Date.now()}-${i}`,
      name: f.name,
      size: fmtSize(f.size),
      kind: kindFor(f.name),
      url: URL.createObjectURL(f),
    }))
    setFiles((prev) => [...prev, ...next])
  }

  const draftText = () => bodyRef.current?.innerText.trim() ?? ''

  const draftData = (): ComposeData => ({
    to: toVisible ? mail.email : '',
    cc: cc.trim(),
    bcc: bcc.trim(),
    subject: `Re: ${mail.subject}`,
    body: draftText(),
    attachments: files.map(({ name, size, kind, url }) => ({ name, size, kind, url })),
  })

  const resetComposer = () => {
    if (bodyRef.current) bodyRef.current.innerHTML = ''
    setCc('')
    setBcc('')
    setShowCc(false)
    setShowBcc(false)
    setFiles([])
    setToVisible(true)
    setComposerOpen(false)
    setComposerFull(false)
  }

  const send = () => {
    if (!toVisible) return showToast('Add a recipient first')
    if (!draftText()) return showToast('Write a message first')
    onSendReply(draftData())
    resetComposer()
    showToast('Reply sent — see it in Sent')
  }

  const saveDraftReply = () => {
    if (!draftText() && files.length === 0) return showToast('Nothing to save yet')
    onSaveReplyDraft(draftData())
    resetComposer()
    showToast('Draft saved')
  }

  const discardDraft = () => {
    const hasContent = Boolean(draftText() || cc || bcc || files.length > 0)
    if (hasContent && !window.confirm('Discard this draft?')) return
    resetComposer()
    showToast('Draft discarded')
  }

  const downloadAttachment = (att: Attachment) => {
    if (att.url) {
      const a = document.createElement('a')
      a.href = att.url
      a.download = att.name
      a.click()
    } else {
      showToast('Preparing download…')
    }
  }

  const shareMail = () => {
    const text = `${mail.subject}\n\n${mail.body.join('\n\n')}`
    navigator.clipboard
      ?.writeText(text)
      .then(() => showToast('Copied to clipboard'))
      .catch(() => showToast('Copy failed'))
  }

  const iconBtn =
    'grid h-9 w-9 place-items-center text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'

  const ccField =
    'shrink-0 border-b border-gray-100 px-4 py-2 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400'

  const menuBtn = 'block w-full px-3 py-1.5 text-left text-sm text-gray-600 transition-colors duration-150 hover:bg-gray-100'

  return (
    <section className="relative flex h-full min-w-0 flex-1 flex-col bg-white">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-3">
        <div className="flex items-center gap-1">
          <button onClick={onBack} className={iconBtn} aria-label="Back" title="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              onDelete(mail.id)
              showToast('Conversation archived')
            }}
            className={iconBtn}
            aria-label="Archive"
            title="Archive"
          >
            <Archive className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              onDelete(mail.id)
              showToast('Marked as spam')
            }}
            className={iconBtn}
            aria-label="Report spam"
            title="Report spam"
          >
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
          <button onClick={shareMail} className={iconBtn} aria-label="Share" title="Copy message text">
            <Share className="h-5 w-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setToolbarMenuOpen((o) => !o)}
              className={iconBtn}
              aria-label="More"
              title="More"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            {toolbarMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setToolbarMenuOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-44 border border-gray-200 bg-white py-1">
                  <button
                    onClick={() => {
                      setToolbarMenuOpen(false)
                      onMarkUnread(mail.id)
                    }}
                    className={menuBtn}
                  >
                    Mark as unread
                  </button>
                  <button
                    onClick={() => {
                      setToolbarMenuOpen(false)
                      window.print()
                    }}
                    className={menuBtn}
                  >
                    Print
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable message area */}
      <div className={composerFull ? 'hidden' : 'slim-scroll flex-1 overflow-y-auto'}>
        {/* White message surface */}
        <div className="bg-white">
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
            <div className="-mx-6 mt-8 px-6 pb-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500">
                  {mail.attachments.length} Attachment{mail.attachments.length > 1 ? 's' : ''}
                </h3>
                <button
                  onClick={() => mail.attachments.forEach(downloadAttachment)}
                  className="text-xs font-medium text-gray-500 transition-colors duration-150 hover:text-gray-800"
                >
                  Download All
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {mail.attachments.map((att) => (
                  <AttachmentChip key={att.id} att={att} onDownload={downloadAttachment} />
                ))}
              </div>
            </div>
          )}
        </div>
        </div>

      </div>

      {/* Docked composer + actions — pinned to the foot of the pane */}
      <div
        className={
          composerOpen
            ? 'flex min-h-0 flex-1 flex-col border-t border-gray-200 bg-white'
            : 'shrink-0 border-t border-gray-200 bg-white'
        }
      >
        {/* Reply composer — collapsed strip by default */}
        <div className={composerOpen ? 'flex min-h-0 flex-1 flex-col px-6 pb-5 pt-4' : ''}>
          {composerOpen ? (
          <>
            {/* To row */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <button className={iconBtn + ' h-8 w-8'} aria-label="Reply mode" title="Reply">
                  <Reply className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-500">To:</span>
                {toVisible ? (
                  <span className="flex items-center gap-1.5 border border-gray-200 bg-gray-50 py-1 pl-2.5 pr-2.5 text-xs font-medium text-gray-700">
                    {mail.from}
                    <button
                      onClick={() => setToVisible(false)}
                      aria-label="Remove recipient"
                      title="Remove recipient"
                      className="text-gray-400 transition-colors hover:text-gray-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">No recipient — add one to send</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <button
                  onClick={() => setShowCc((s) => !s)}
                  className={`transition-colors hover:text-gray-600 ${showCc ? 'font-medium text-gray-800' : ''}`}
                >
                  Cc
                </button>
                <button
                  onClick={() => setShowBcc((s) => !s)}
                  className={`transition-colors hover:text-gray-600 ${showBcc ? 'font-medium text-gray-800' : ''}`}
                >
                  Bcc
                </button>
                <button
                  onClick={() => {
                    setComposerOpen(false)
                    setComposerFull(false)
                  }}
                  className={iconBtn + ' h-8 w-8'}
                  aria-label="Collapse composer"
                  title="Collapse"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setComposerFull((f) => !f)}
                  className={iconBtn + ' h-8 w-8'}
                  aria-label={composerFull ? 'Exit fullscreen' : 'Fullscreen'}
                  title={composerFull ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {composerFull ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Cc / Bcc rows */}
            {showCc && (
              <input
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="Cc"
                className={ccField}
              />
            )}
            {showBcc && (
              <input
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="Bcc"
                className={ccField}
              />
            )}

            {/* Files attached to this draft */}
            {files.length > 0 && (
              <div className="flex shrink-0 flex-wrap gap-2 px-4 pt-3">
                {files.map((f, i) => (
                  <span
                    key={f.id}
                    className="flex items-center gap-1.5 border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700"
                  >
                    <span className="font-semibold">{f.kind.toUpperCase()}</span>
                    <span className="max-w-[140px] truncate">{f.name}</span>
                    <span className="text-gray-400">{f.size}</span>
                    <button
                      onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                      aria-label={`Remove ${f.name}`}
                      className="text-gray-400 transition-colors hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Body + format toolbar — one continuous surface */}
            <div className="flex min-h-0 flex-1 items-stretch gap-3 px-4 pt-3">
              <div
                ref={bodyRef}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label="Reply body"
                data-placeholder="Write a reply…"
                style={{ fontFamily: activeFont.stack }}
                className="slim-scroll min-w-0 flex-1 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-gray-700 outline-none"
              />
              <div className="relative mt-0.5 shrink-0 self-start">
                <div className="flex items-center border border-gray-200 bg-white px-0.5 py-0.5">
                  <button
                    onClick={() => setFontOpen((o) => !o)}
                    className="flex items-center gap-0.5 px-1.5 py-1 text-[11px] font-medium text-gray-800 transition-colors duration-150 hover:bg-gray-100"
                    aria-label="Font family"
                  >
                    {font}
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </button>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => exec('bold')}
                    className={iconBtn + ' h-7 w-7 text-gray-800 hover:text-gray-900'}
                    aria-label="Bold"
                    title="Bold"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => exec('italic')}
                    className={iconBtn + ' h-7 w-7'}
                    aria-label="Italic"
                    title="Italic"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => exec('underline')}
                    className={iconBtn + ' h-7 w-7'}
                    aria-label="Underline"
                    title="Underline"
                  >
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

          </>
          ) : (
            <button
              onClick={() => setComposerOpen(true)}
              className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors duration-150 hover:bg-gray-50"
            >
              <Reply className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="min-w-0 truncate text-sm text-gray-500">
                Write a reply to <span className="font-medium text-gray-700">{mail.from}</span>…
              </span>
            </button>
          )}
        </div>

        {/* Composer actions — visible while composing */}
        {composerOpen && (
        <div className="flex shrink-0 items-center justify-between px-6 pb-3 pt-1">
        <div className="flex items-center gap-0.5">
          <button onClick={() => fileRef.current?.click()} className={iconBtn} aria-label="Attach" title="Attach files">
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ''
            }}
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertLink}
            className={iconBtn}
            aria-label="Insert link"
            title="Insert link"
          >
            <Link2 className="h-4 w-4" />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => imageRef.current?.click()}
            className={iconBtn}
            aria-label="Insert image"
            title="Insert image"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              insertImage(e.target.files)
              e.target.value = ''
            }}
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertSignature}
            className={iconBtn}
            aria-label="Insert signature"
            title="Insert signature"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <div className="relative">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                saveSelection()
                setEmojiOpen((o) => !o)
              }}
              className={iconBtn}
              aria-label="Emoji"
              title="Emoji"
            >
              <Smile className="h-4 w-4" />
            </button>
            {emojiOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setEmojiOpen(false)} />
                <div className="absolute bottom-full left-0 z-20 mb-1 flex w-56 flex-wrap gap-1 border border-gray-200 bg-white p-2">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => {
                        exec('insertText', e)
                        setEmojiOpen(false)
                      }}
                      className="grid h-8 w-8 place-items-center text-lg transition-colors hover:bg-gray-100"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={discardDraft} className={iconBtn} aria-label="Discard draft" title="Discard draft">
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setComposerMenuOpen((o) => !o)}
              className={iconBtn}
              aria-label="More options"
              title="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {composerMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setComposerMenuOpen(false)} />
                <div className="absolute bottom-full right-0 z-20 mb-1 w-40 border border-gray-200 bg-white py-1">
                  <button
                    onClick={() => {
                      setComposerMenuOpen(false)
                      saveDraftReply()
                    }}
                    className={menuBtn}
                  >
                    Save draft
                  </button>
                  <button
                    onClick={() => {
                      setComposerMenuOpen(false)
                      discardDraft()
                    }}
                    className={menuBtn}
                  >
                    Discard
                  </button>
                </div>
              </>
            )}
          </div>
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
      </div>

      {/* Mail actions — Forward/Print + Star/Delete */}
      <div className="flex shrink-0 items-center justify-between border-t border-gray-200 px-6 py-2.5">
        <div className="flex items-center gap-5">
          <button
            onClick={() => onForward(mail)}
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
