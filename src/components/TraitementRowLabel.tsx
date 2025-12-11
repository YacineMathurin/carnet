'use client'
import { useRowLabel } from '@payloadcms/ui'

export const TraitementRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ datePrescription?: string; medecin?: string }>()

  if (data?.datePrescription && data?.medecin) {
    const date = new Date(data.datePrescription)
    const formatted = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    return (
      <div>
        {formatted} - Dr. {data.medecin}
      </div>
    )
  }

  if (data?.datePrescription) {
    const date = new Date(data.datePrescription)
    const formatted = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    return <div>{formatted}</div>
  }

  return <div>Traitement {String(rowNumber).padStart(2, '0')}</div>
}

export default TraitementRowLabel
