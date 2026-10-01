import { Bold, ChevronDown, Italic, Maximize2, Minimize2, Paperclip, Smile, Underline, X } from 'lucide-react'
import { useRef, useState } from 'react'

export interface ComposeData {
  to: string
  cc: string
  bcc: string
  subject: string
  body: string
  attachments: { name: string; size: string; kind: string; url?: string }[]
}

interface ComposeModalProps {
  initial?: Partial<ComposeData>
  onClose: () => void
  onSend: (data: ComposeData) => void
  onSaveDraft: (data: ComposeData) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const kindFor = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf') return 'pdf'
  if (['zip', 'rar', '7z'].includes(ext)) return 'zip'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'img'
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return 'doc'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'xls'
  if (['ppt', 'pptx'].includes(ext)) return 'ppt'
  return 'code'
}

export const fmtSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

export const EMOJIS = ['😊', '👍', '🙏', '🎉', '❤️', '😅', '🤝', '📅', '✅', '🚀']

const fonts = [
  { label: 'Inter', stack: '"Inter", sans-serif' },
  { label: 'Arial', stack: 'Arial, sans-serif' },
  { label: 'Georgia', stack: 'Georgia, serif' },
  { label: 'Courier New', stack: '"Courier New", monospace' },
]

export default function ComposeModal({ initial, onClose, onSend, onSaveDraft }: ComposeModalProps) {
  const [to, setTo] = useState(initial?.to ?? '')
  const [cc, setCc] = useState(initial?.cc ?? '')
  const [bcc, setBcc] = useState(initial?.bcc ?? '')
  const [showCcBcc, setShowCcBcc] = useState(Boolean(initial?.cc || initial?.bcc))
  const [subject, setSubject] = useState(initial?.subject ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [attachments, setAttachments] = useState<ComposeData['attachments']>(initial?.attachments ?? [])
  const [fullscreen, setFullscreen] = useState(false)
  const [font, setFont] = useState(fonts[0])
  const [fontOpen, setFontOpen] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const valid = to
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .every((t) => EMAIL_RE.test(t)) && to.trim().length > 0

  const hasContent = to || cc || bcc || subject || body || attachments.length > 0

  const discard = () => {
    if (hasContent && !window.confirm('Discard this message?')) return
    onClose()
  }

  const send = () => {
    if (!valid) return
    onSend({ to: to.trim(), cc: cc.trim(), bcc: bcc.trim(), subject: subject.trim() || '(no subject)', body, attachments })
  }

  const saveDraft = () => {
    if (!hasContent) return onClose()
    onSaveDraft({ to: to.trim(), cc: cc.trim(), bcc: bcc.trim(), subject: subject.trim() || '(no subject)', body, attachments })
  }

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const next = [...files].map((f) => ({
      name: f.name,
      size: fmtSize(f.size),
      kind: kindFor(f.name),
      url: URL.createObjectURL(f),
    }))
    setAttachments((prev) => [...prev, ...next])
  }

  const insertEmoji = (emoji: string) => {
    const el = bodyRef.current
    if (!el) return setBody((b) => b + emoji)
    const start = el.selectionStart ?? body.length
    setBody(body.slice(0, start) + emoji + body.slice(el.selectionEnd ?? start))
    setEmojiOpen(false)
  }

  const field = 'border-b border-gray-100 px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400'
  const toolBtn = (active: boolean) =>
    `grid h-7 w-7 place-items-center transition-colors duration-150 ${active ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 p-4" onClick={discard}>
      <div
        className={`flex max-h-[92vh] w-full flex-col border border-gray-200 bg-white ${fullscreen ? 'max-w-3xl' : 'max-w-xl'}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') send()
        }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5">
          <h2 className="text-sm font-semibold text-gray-900">New Message</h2>
          <div className="flex items-center">
            <button
              onClick={() => setFullscreen((f) => !f)}
              className="grid h-8 w-8 place-items-center text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={discard}
              className="grid h-8 w-8 place-items-center text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Recipients */}
        <div className="flex items-center gap-3">
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="To" autoFocus className={`flex-1 ${field}`} />
          <button
            onClick={() => setShowCcBcc((s) => !s)}
            className="pr-4 text-xs font-medium text-gray-400 transition-colors hover:text-gray-700"
          >
            Cc Bcc
          </button>
        </div>
        {showCcBcc && (
          <>
            <input value={cc} onChange={(e) => setCc(e.target.value)} placeholder="Cc" className={field} />
            <input value={bcc} onChange={(e) => setBcc(e.target.value)} placeholder="Bcc" className={field} />
          </>
        )}
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className={field} />

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-gray-100 px-4 py-2">
            {attachments.map((att, i) => (
              <span
                key={`${att.name}-${i}`}
                className="flex items-center gap-1.5 border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700"
              >
                <span className="font-semibold">{att.kind.toUpperCase()}</span>
                <span className="max-w-[140px] truncate">{att.name}</span>
                <span className="text-gray-400">{att.size}</span>
                <button
                  onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                  aria-label={`Remove ${att.name}`}
                  className="text-gray-400 transition-colors hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Body */}
        <textarea
          ref={bodyRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message…"
          rows={fullscreen ? 14 : 7}
          style={{
            fontFamily: font.stack,
            fontWeight: bold ? 700 : 400,
            fontStyle: italic ? 'italic' : 'normal',
            textDecoration: underline ? 'underline' : 'none',
          }}
          className="slim-scroll flex-1 resize-none px-4 py-3 text-sm leading-relaxed text-gray-700 outline-none placeholder:text-gray-400"
        />

        {/* Formatting + insert bar */}
        <div className="relative flex items-center justify-between border-t border-gray-100 px-3 py-1.5">
          <div className="flex items-center gap-0.5">
            <div className="relative flex items-center">
              <button
                onClick={() => setFontOpen((o) => !o)}
                className="flex items-center gap-0.5 px-1.5 py-1 text-[11px] font-medium text-gray-800 transition-colors duration-150 hover:bg-gray-100"
                aria-label="Font family"
              >
                {font.label}
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>
              {fontOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setFontOpen(false)} />
                  <div className="absolute left-0 top-full z-20 mt-1 w-40 border border-gray-200 bg-white py-1">
                    {fonts.map((f) => (
                      <button
                        key={f.label}
                        onClick={() => {
                          setFont(f)
                          setFontOpen(false)
                        }}
                        style={{ fontFamily: f.stack }}
                        className={`block w-full px-3 py-1.5 text-left text-sm transition-colors duration-150 hover:bg-gray-100 ${
                          f.label === font.label ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => setBold((b) => !b)} className={toolBtn(bold)} aria-label="Bold" title="Bold">
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setItalic((i) => !i)} className={toolBtn(italic)} aria-label="Italic" title="Italic">
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setUnderline((u) => !u)} className={toolBtn(underline)} aria-label="Underline" title="Underline">
              <Underline className="h-3.5 w-3.5" />
            </button>

            <span className="mx-1 h-5 w-px bg-gray-200" />

            <button onClick={() => fileRef.current?.click()} className={toolBtn(false)} aria-label="Attach file" title="Attach file">
              <Paperclip className="h-3.5 w-3.5" />
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

            <div className="relative flex items-center">
              <button onClick={() => setEmojiOpen((o) => !o)} className={toolBtn(emojiOpen)} aria-label="Emoji" title="Emoji">
                <Smile className="h-3.5 w-3.5" />
              </button>
              {emojiOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setEmojiOpen(false)} />
                  <div className="absolute left-0 top-full z-20 mt-1 flex w-56 flex-wrap gap-1 border border-gray-200 bg-white p-2">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => insertEmoji(e)}
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

          <span className="text-[10px] text-gray-300">Ctrl+Enter to send</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5">
          <button
            onClick={saveDraft}
            className="px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-800"
          >
            Save Draft
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={discard}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-800"
            >
              Discard
            </button>
            <button
              onClick={send}
              disabled={!valid}
              title={valid ? 'Send (Ctrl+Enter)' : 'Enter a valid recipient email'}
              className="flex items-center gap-2 border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors duration-150 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
