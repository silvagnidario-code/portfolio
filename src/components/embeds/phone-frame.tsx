/**
 * A phone, drawn in CSS: a metal edge, a black bezel, the island, a status
 * bar and the app's tab bar at the bottom, with the live page in between.
 * Used for Instagram profiles, so a social page reads as what it is —
 * something seen inside the app on a phone — and never as a website in a
 * browser window.
 *
 * Behind it sits a faint glow in the accent colour, just enough to lift the
 * phone off a dark page without turning into a backdrop of its own.
 *
 * The phone is at most 25rem wide and keeps a real handset's proportions;
 * on a narrow screen it simply shrinks with the column.
 */
export function PhoneFrame({ url, title }: { url: string; title: string }) {
  return (
    <div className="relative isolate mx-auto w-full max-w-[25rem]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-[0.14] blur-[80px]"
      />

      {/* Metal edge: a thin gradient ring around the bezel. */}
      <div className="rounded-[3.4rem] bg-gradient-to-b from-[#5a5955] via-[#2a2a28] to-[#4a4946] p-[2px] shadow-[0_30px_70px_-40px_rgb(0_0_0/0.7)]">
        <div className="relative rounded-[3.3rem] bg-[#0B0B0A] p-[0.7rem]">
          {/* Side buttons */}
          <span
            aria-hidden="true"
            className="absolute -left-[4px] top-[6.5rem] h-[2rem] w-[3px] rounded-l bg-[#3a3937]"
          />
          <span
            aria-hidden="true"
            className="absolute -left-[4px] top-[9.5rem] h-[3.5rem] w-[3px] rounded-l bg-[#3a3937]"
          />
          <span
            aria-hidden="true"
            className="absolute -right-[4px] top-[8.5rem] h-[5rem] w-[3px] rounded-r bg-[#3a3937]"
          />

          <div className="relative flex aspect-[9/19] w-full flex-col overflow-hidden rounded-[2.6rem] bg-[#FFFFFF] text-[#0B0B0A]">
            {/* Status bar with the island in the middle */}
            <div
              aria-hidden="true"
              className="relative flex h-[3rem] shrink-0 items-center justify-between px-[1.6rem] pt-[0.3rem] text-[0.8rem] font-semibold"
            >
              <span>9:41</span>
              <span className="absolute left-1/2 top-[0.6rem] h-[1.75rem] w-[6.8rem] -translate-x-1/2 rounded-full bg-[#0B0B0A]" />
              <span className="flex items-center gap-[0.3rem]">
                <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
                  <rect x="0" y="7" width="3" height="4" rx="0.7" />
                  <rect x="4.5" y="5" width="3" height="6" rx="0.7" />
                  <rect x="9" y="2.5" width="3" height="8.5" rx="0.7" />
                  <rect x="13.5" y="0" width="3" height="11" rx="0.7" />
                </svg>
                <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="20"
                    height="10"
                    rx="3"
                    stroke="currentColor"
                    opacity="0.4"
                  />
                  <rect x="2" y="2" width="15" height="7" rx="1.6" fill="currentColor" />
                  <rect
                    x="21.5"
                    y="3.5"
                    width="1.6"
                    height="4"
                    rx="0.8"
                    fill="currentColor"
                    opacity="0.4"
                  />
                </svg>
              </span>
            </div>

            <div className="relative min-h-0 flex-1" data-lenis-prevent-wheel>
              <iframe
                src={url}
                title={title}
                loading="eager"
                className="absolute inset-0 h-full w-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              />
            </div>

            {/* The app's tab bar and the home indicator */}
            <div
              aria-hidden="true"
              className="shrink-0 border-t border-[#e5e5e5] bg-[#FFFFFF] px-[1.4rem] pb-[0.6rem] pt-[0.7rem]"
            >
              <div className="flex items-center justify-between">
                {[
                  'M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z',
                  'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9.5 16.5-4.6-4.6',
                  'M4 4h16v16H4zM12 8v8M8 12h8',
                  'M4 4h16v16H4zM4 9h16M9 4l3 5M15 4l3 5M10.5 12.5v5l4-2.5z',
                ].map((d) => (
                  <svg
                    key={d}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    <path d={d} />
                  </svg>
                ))}
                <span className="size-[1.5rem] rounded-full border-2 border-[#0B0B0A] bg-[#F2D22E]" />
              </div>
              <span className="mx-auto mt-[0.7rem] block h-[0.3rem] w-[8rem] rounded-full bg-[#0B0B0A]" />
            </div>
          </div>
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
