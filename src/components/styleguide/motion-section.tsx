'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { duration, easing, revealDistance, stagger } from '@/tokens/brand'

import { Mono, SubHeading, Table, Td, Th } from './section'

type DurationName = keyof typeof duration

/** Static class names so Tailwind can see the utilities. */
const durationClass: Record<DurationName, string> = {
  fast: 'duration-fast',
  base: 'duration-base',
  slow: 'duration-slow',
  slowest: 'duration-slowest',
}

const durationNames = Object.keys(durationClass) as DurationName[]

export function MotionSection() {
  const t = useTranslations('Styleguide.motion')
  const [playing, setPlaying] = useState(true)

  const replay = () => {
    setPlaying(false)
    // One frame with the elements reset, then let them come back in.
    requestAnimationFrame(() => requestAnimationFrame(() => setPlaying(true)))
  }

  return (
    <section id="motion" className="page-margin border-t border-line py-96">
      <h2 className="text-h2">{t('title')}</h2>
      <p className="mt-16 max-w-measure text-body-lg text-ink-2">{t('description')}</p>

      <div className="mt-48">
        <Table
          head={
            <>
              <Th>{t('duration')}</Th>
              <Th>{t('preview')}</Th>
            </>
          }
        >
          {durationNames.map((name, index) => (
            <tr key={name}>
              <Td>
                <Mono>
                  --duration-{name} · {duration[name]}ms
                </Mono>
              </Td>
              <Td>
                <span
                  className={`block h-16 w-64 bg-accent transition ease-reveal ${durationClass[name]}`}
                  style={{
                    opacity: playing ? 1 : 0,
                    transform: playing ? 'none' : 'translateY(var(--reveal-distance-max))',
                    transitionDelay: `calc(var(--stagger-base) * ${index})`,
                  }}
                  aria-hidden="true"
                />
              </Td>
            </tr>
          ))}
        </Table>

        <button
          type="button"
          onClick={replay}
          className="mt-32 border border-line-strong px-24 py-12 text-body transition ease-reveal duration-fast hover:bg-surface-2"
        >
          {t('replay')}
        </button>

        <div className="mt-64 grid gap-24 tablet:grid-cols-3">
          <div>
            <SubHeading>{t('easing')}</SubHeading>
            <Mono>{easing}</Mono>
          </div>
          <div>
            <SubHeading>{t('stagger')}</SubHeading>
            <Mono>
              {stagger.min}–{stagger.max}ms
            </Mono>
          </div>
          <div>
            <SubHeading>{t('distance')}</SubHeading>
            <Mono>
              {revealDistance.min}–{revealDistance.max}px
            </Mono>
          </div>
        </div>

        <p className="mt-48 max-w-measure text-body text-ink-muted">{t('reducedMotionNote')}</p>
      </div>
    </section>
  )
}
