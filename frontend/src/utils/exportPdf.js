import jsPDF from 'jspdf'

export function exportSafetyPlan({ city, summary, aiNote, timeAdvisory }) {
  const doc = new jsPDF()
  const margin = 20
  let y = margin

  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.text('SafeTrip AI — Safety Brief', margin, y)
  y += 12

  doc.setFontSize(11)
  doc.setFont(undefined, 'normal')
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y)
  y += 10

  doc.setDrawColor(200)
  doc.line(margin, y, 190, y)
  y += 10

  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text(city || 'Destination', margin, y)
  y += 10

  doc.setFontSize(11)
  doc.setFont(undefined, 'normal')

  if (summary) {
    doc.text(`Risk Level: ${summary.risk_level} (score: ${summary.risk_score}/100)`, margin, y)
    y += 8
    doc.text(`Reported Crimes: ${summary.crime_count}`, margin, y)
    y += 8
    doc.text(`Most Common Crime: ${summary.most_common_crime || 'N/A'}`, margin, y)
    y += 8
    if (summary.peak_hour !== null && summary.peak_hour !== undefined) {
      doc.text(`Peak Activity Hour: ${summary.peak_hour}:00`, margin, y)
      y += 8
    }
  }

  y += 4
  if (aiNote) {
    doc.setFont(undefined, 'bold')
    doc.text('AI Safety Note:', margin, y)
    y += 7
    doc.setFont(undefined, 'normal')
    const noteLines = doc.splitTextToSize(aiNote, 170)
    doc.text(noteLines, margin, y)
    y += noteLines.length * 6 + 4
  }

  if (timeAdvisory) {
    doc.setFont(undefined, 'bold')
    doc.text('Time-of-Day Advisory:', margin, y)
    y += 7
    doc.setFont(undefined, 'normal')
    const advisoryLines = doc.splitTextToSize(timeAdvisory, 170)
    doc.text(advisoryLines, margin, y)
    y += advisoryLines.length * 6 + 4
  }

  y += 6
  doc.setFontSize(9)
  doc.setTextColor(120)
  doc.text(
    'Data source: This report may include sample/demo data alongside real crime records. Always verify local conditions before travel.',
    margin,
    y,
    { maxWidth: 170 }
  )

  const safeName = (city || 'destination').replace(/[^a-z0-9]/gi, '_').toLowerCase()
  doc.save(`safetrip-${safeName}-safety-brief.pdf`)
}