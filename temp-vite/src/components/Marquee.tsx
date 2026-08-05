interface MarqueeProps {
  items: string[]
  className?: string
  itemClassName?: string
}

export default function Marquee({ items, className = '', itemClassName = '' }: MarqueeProps) {
  const doubled = [...items, ...items]

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className={`inline-flex items-center shrink-0 mx-6 md:mx-10 ${itemClassName}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
