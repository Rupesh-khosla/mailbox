import { useState } from 'react'

interface AvatarProps {
  name: string
  /** Portrait photo URL; falls back to initials when missing or failed */
  src?: string
  /** Solid background class for the initials fallback, e.g. "bg-sky-600" */
  color: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Avatar({ name, src, color, size = 'md' }: AvatarProps) {
  const [failed, setFailed] = useState(false)

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sizes = {
    sm: 'h-8 w-8 text-[11px]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-12 w-12 text-sm',
  }

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={`${sizes[size]} shrink-0 rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizes[size]} grid shrink-0 select-none place-items-center rounded-full font-semibold text-white ${color}`}
    >
      {initials}
    </div>
  )
}
