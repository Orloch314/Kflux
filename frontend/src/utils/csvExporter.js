export function downloadLogsCSV(logs) {
  const headers = ['Timestamp', 'Tipo', 'Workflow', 'Messaggio']
  const rows = logs.map(log => [
    log.timestamp,
    log.type,
    log.workflow,
    log.message
  ])

  generateAndDownloadCSV('logs.csv', headers, rows)
}

export function downloadHistoryCSV(history) {
  const headers = [
    'Timestamp',
    'Workflow',
    'Durata (sec)',
    'Stato',
    'Trigger',
    'StartedAt',
    'FinishedAt',
    'Note'
  ]

  const rows = history.map(entry => [
    entry.timestamp,
    entry.workflow,
    entry.duration,
    entry.status,
    entry.trigger || '',
    entry.startedAt || '',
    entry.finishedAt || '',
    entry.notes || ''
  ])

  generateAndDownloadCSV('history.csv', headers, rows)
}

function generateAndDownloadCSV(filename, headers, rows) {
  const csvContent =
    [headers, ...rows]
      .map(row =>
        row
          .map(item => `"${String(item).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
