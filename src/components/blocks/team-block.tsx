import { MediaImage } from '@/components/media/media-image'
import type { Locale } from '@/i18n/routing'
import { getTeamMembersList } from '@/lib/queries'
import type { TeamBlockType, TeamMember } from '@/payload-types'

import { BlockSection } from './block-section'

async function resolveMembers(block: TeamBlockType, locale: Locale): Promise<TeamMember[]> {
  const selected = (block.members ?? []).filter(
    (member): member is TeamMember => typeof member === 'object',
  )

  if (selected.length > 0) return selected

  return getTeamMembersList(locale)
}

export async function TeamBlock({ block, locale }: { block: TeamBlockType; locale: Locale }) {
  const members = await resolveMembers(block, locale)

  if (members.length === 0) return null

  const MemberHeading = block.heading ? 'h3' : 'h2'

  // A block with neither heading nor intro must not reserve the space for them.
  const intro =
    !block.heading && !block.intro ? null : (
      <div className="page-grid mb-64">
        <div className="col-span-4 tablet:col-span-4 desktop:col-span-6">
          {block.heading ? <h2 className="text-h2 text-balance">{block.heading}</h2> : null}
        </div>
        {block.intro ? (
          <p className="col-span-4 tablet:col-span-4 tablet:col-start-3 desktop:col-span-5 desktop:col-start-8 text-body-lg text-ink-2">
            {block.intro}
          </p>
        ) : null}
      </div>
    )

  if (block.variant === 'listReveal') {
    return (
      <BlockSection settings={block.settings}>
        {intro}
        <ul className="page-grid">
          {members.map((member) => (
            <li
              key={member.id}
              className="col-span-4 tablet:col-span-6 desktop:col-span-10 desktop:col-start-2 border-t border-line py-32"
            >
              <div className="flex flex-col gap-8 tablet:flex-row tablet:items-baseline tablet:justify-between">
                <MemberHeading className="text-h2">{member.name}</MemberHeading>
                <p className="font-mono text-caption uppercase text-ink-muted">{member.role}</p>
              </div>
              {member.bio ? (
                <p className="mt-16 max-w-measure text-body text-ink-2">{member.bio}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </BlockSection>
    )
  }

  return (
    <BlockSection settings={block.settings}>
      {intro}
      <ul className="page-grid gap-y-48">
        {members.map((member, index) => (
          <li
            key={member.id}
            className={`col-span-2 tablet:col-span-3 desktop:col-span-3 ${
              index % 2 === 1 ? 'desktop:mt-96' : ''
            }`}
          >
            <div className="aspect-[3/4] w-full overflow-hidden rounded-glass-lg">
              <MediaImage
                media={member.photo}
                sizes="(min-width: 1180px) 25vw, (min-width: 768px) 50vw, 50vw"
                className="h-full w-full object-cover"
              />
            </div>
            <MemberHeading className="mt-24 text-h3">{member.name}</MemberHeading>
            <p className="mt-8 font-mono text-caption uppercase text-ink-muted">{member.role}</p>
          </li>
        ))}
      </ul>
    </BlockSection>
  )
}
