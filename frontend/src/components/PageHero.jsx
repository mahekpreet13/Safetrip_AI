export default function PageHero({ eyebrow, eyebrowIcon: EyebrowIcon, title, description, coords, children }) {
  return (
    <div className="relative bg-ink topo-texture text-paper overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-16 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-signal text-xs font-mono uppercase tracking-widest">
            {EyebrowIcon && <EyebrowIcon size={13} />}
            {eyebrow}
          </div>
          {coords && (
            <div className="hidden sm:block text-[11px] font-mono text-paper/40 tracking-wide">
              {coords}
            </div>
          )}
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-paper/60 mt-3 text-sm md:text-base max-w-xl font-light">
            {description}
          </p>
        )}

        {children}
      </div>

      {/* Bottom edge divider — like a torn ticket stub */}
      <div className="h-2 bg-paper" style={{
        maskImage: 'repeating-linear-gradient(90deg, black 0 8px, transparent 8px 14px)',
        WebkitMaskImage: 'repeating-linear-gradient(90deg, black 0 8px, transparent 8px 14px)',
      }} />
    </div>
  )
}