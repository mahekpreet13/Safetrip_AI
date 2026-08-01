export function getTimeAdvisory(trends) {
  if (!trends || !trends.by_hour) return null

  let day = 0
  let night = 0
  Object.entries(trends.by_hour).forEach(([hour, count]) => {
    const h = Number(hour)
    if (h >= 6 && h < 18) {
      day += count
    } else {
      night += count
    }
  })

  if (day === 0 && night === 0) return null

  // Avoid divide-by-zero; if one bucket is empty, treat the ratio as
  // "significantly higher" rather than computing Infinity
  if (day === 0) return 'All reported incidents occurred at night. Consider daytime visits where possible.'
  if (night === 0) return 'All reported incidents occurred during the day. No unusual nighttime risk detected.'

  const ratio = night / day

  if (ratio >= 1.5) {
    return `Crime in this area is about ${ratio.toFixed(1)}x higher at night — consider planning visits during daytime hours.`
  }
  if (ratio <= 0.67) {
    return `Crime in this area is more common during the day (about ${(1 / ratio).toFixed(1)}x higher than at night).`
  }
  return 'Crime is fairly evenly distributed between day and night in this area.'
}