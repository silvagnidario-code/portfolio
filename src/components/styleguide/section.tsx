import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  title: string
  description: string
  children: ReactNode
}

export function Section({ id, title, description, children }: SectionProps) {
  return (
    <section id={id} className="page-margin border-t border-line py-96">
      <h2 className="text-h2">{title}</h2>
      <p className="mt-16 max-w-measure text-body-lg text-ink-2">{description}</p>
      <div className="mt-48">{children}</div>
    </section>
  )
}

export function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="mb-24 font-mono text-caption uppercase text-ink-muted">{children}</h3>
}

/** Monospaced cell used for token names and raw values. */
export function Mono({ children }: { children: ReactNode }) {
  return <span className="font-mono text-caption text-ink-2">{children}</span>
}

export function Table({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-body">
        <thead>
          <tr className="border-b border-line-strong text-left">{head}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th scope="col" className="py-12 pr-24 font-mono text-caption uppercase text-ink-muted">
      {children}
    </th>
  )
}

export function Td({ children }: { children: ReactNode }) {
  return <td className="border-b border-line py-12 pr-24 align-middle">{children}</td>
}
