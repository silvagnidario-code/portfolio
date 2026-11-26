/**
 * A phone, drawn in CSS: rounded body, a thin bezel, the island at the top,
 * and a live page inside at a real phone width. Used for Instagram profiles,
 * so a social page reads as what it is — something seen on a phone — and
 * never as a website in a browser window.
 *
 * The phone is at most 22rem wide and keeps a real handset's proportions;
 * on a narrow screen it simply shrinks with the column.
 */
export function PhoneFrame({ url, title }: { url: string; title: string }) {
  return (
    <div className="mx-auto w-full max-w-[22rem]">
      <div className="relative rounded-[3rem] bg-[#0B0B0A] p-[0.65rem] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.6),inset_0_0_0_1.5px_rgb(255_255_255/0.08)]">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[1.15rem] z-10 h-[1.6rem] w-[6.5rem] -translate-x-1/2 rounded-full bg-[#0B0B0A]"
        />
        <span
          aria-hidden="true"
          className="absolute -left-[3px] top-[7rem] h-[3rem] w-[3px] rounded-l bg-[#1c1c1a]"
        />
        <span
          aria-hidden="true"
          className="absolute -right-[3px] top-[9rem] h-[4.5rem] w-[3px] rounded-r bg-[#1c1c1a]"
        />
        <div
          className="relative aspect-[390/800] w-full overflow-hidden rounded-[2.4rem] bg-white pt-[2.6rem]"
          data-lenis-prevent-wheel
        >
          <iframe
            src={url}
            title={title}
            loading="eager"
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      </div>
    </div>
  )
}

/** Instagram profiles and posts go in a phone; everything else in a window. */
export function isInstagram(url: string): boolean {
  try {
    return /(^|\.)instagram\.com$/.test(new URL(url).hostname)
  } catch {
    return false
  }
}
