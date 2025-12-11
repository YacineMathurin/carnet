'use client'
import { useRowLabel } from '@payloadcms/ui'

export const JourTraitementRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ date?: string }>()

  if (data?.date) {
    const date = new Date(data.date)
    const formatted = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    return <div>{formatted}</div>
  }

  return <div>Jour {String(rowNumber).padStart(2, '0')}</div>
}

export default JourTraitementRowLabel
