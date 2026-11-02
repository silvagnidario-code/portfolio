import type { BioBlockType } from '@/payload-types'

type Links = NonNullable<BioBlockType['links']>

const isPdf = (url: string) => /\.pdf($|\?)/i.test(url)
const isLinkedIn = (url: string) => /linkedin\.com/i.test(url)

// "CV (IT)" -> "IT", "Resume (EN)" -> "EN"
const langOf = (label: string) => label.match(/\(([^)]+)\)/)?.[1] ?? label

const linkClass =
  'bio-ul bio-row text-ink-2 transition-colors duration-fast hover:text-ink'

/**
 * Links under the About bio. PDF links are grouped behind a single CV icon
 * (IT / EN), a LinkedIn URL gets its own icon, anything else stays a plain
 * link. Hover: the underline redraws from the left, the CV arrow drops a
 * little, the LinkedIn icon lifts and its arrow moves out. All motion is
 * switched off under prefers-reduced-motion.
 */
export function BioLinks({ links }: { links?: Links | null }) {
  if (!links || links.length === 0) return null

  const cvs = links.filter((l) => isPdf(l.url))
  const linkedin = links.find((l) => isLinkedIn(l.url))
  const others = links.filter((l) => !isPdf(l.url) && !isLinkedIn(l.url))

  return (
    <>
      <style>{css}</style>
      <ul className="bio-list mt-32 flex flex-wrap items-center font-mono text-caption uppercase">
        {cvs.length > 0 ? (
          <li className="bio-item bio-cv bio-row text-ink-2">
            <svg
              className="bio-ico"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5" />
              <g className="bio-arrow">
                <path d="M12 11v6" />
                <path d="m9.5 14.5 2.5 2.5 2.5-2.5" />
              </g>
            </svg>
            <span className="text-ink-muted">CV</span>
            {cvs.map((link, i) => (
              <span key={link.id ?? link.url} className="bio-row">
                {i > 0 ? (
                  <span className="opacity-40" aria-hidden="true">
                    /
                  </span>
                ) : null}
                <a
                  href={link.url}
                  rel="noreferrer"
                  target="_blank"
                  aria-label={link.label}
                  className={linkClass}
                >
                  {langOf(link.label)}
                </a>
              </span>
            ))}
          </li>
        ) : null}

        {linkedin ? (
          <li className="bio-item" style={{ animationDelay: '370ms' }}>
            <a href={linkedin.url} rel="noreferrer" target="_blank" className={`${linkClass} bio-in`}>
              <svg className="bio-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zm7 0h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4z" />
              </svg>
              <span>{linkedin.label}</span>
              <svg
                className="bio-ext"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
          </li>
        ) : null}

        {others.map((link, i) => (
          <li
            key={link.id ?? link.url}
            className="bio-item"
            style={{ animationDelay: `${490 + i * 120}ms` }}
          >
            <a href={link.url} rel="noreferrer" target="_blank" className={linkClass}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

const css = `
.bio-list{column-gap:32px;row-gap:16px}
.bio-row{display:inline-flex;align-items:center;gap:8px}
.bio-item{opacity:0;transform:translateY(8px);animation:bio-rise .6s cubic-bezier(.2,.7,.2,1) .25s forwards}
@keyframes bio-rise{to{opacity:1;transform:none}}
.bio-ico{width:15px;height:15px;flex:none;transition:transform .35s cubic-bezier(.2,.7,.2,1)}
.bio-ext{width:12px;height:12px;flex:none;opacity:.6;transition:transform .35s cubic-bezier(.2,.7,.2,1),opacity .2s}
.bio-ul{padding-bottom:3px;background:linear-gradient(currentColor,currentColor) left bottom/100% 1px no-repeat}
.bio-ul:hover{animation:bio-redraw .45s cubic-bezier(.2,.7,.2,1)}
@keyframes bio-redraw{from{background-size:0 1px}to{background-size:100% 1px}}
.bio-arrow{transition:transform .35s cubic-bezier(.2,.7,.2,1)}
.bio-cv:hover .bio-arrow{transform:translateY(2px)}
.bio-in:hover .bio-ico{transform:translateY(-2px)}
.bio-in:hover .bio-ext{transform:translate(2px,-2px);opacity:1}
@media (prefers-reduced-motion:reduce){
  .bio-item{animation:none;opacity:1;transform:none}
  .bio-ul:hover{animation:none}
  .bio-ico,.bio-ext,.bio-arrow{transition:none}
}
`

export default BioLinks
