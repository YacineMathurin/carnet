'use client'
import { useRowLabel } from '@payloadcms/ui'

export const MedicamentRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ nomMedicament?: string; dosage?: string }>()

  if (data?.nomMedicament && data?.dosage) {
    return (
      <div>
        {data.nomMedicament} - {data.dosage}
      </div>
    )
  }

  if (data?.nomMedicament) {
    return <div>{data.nomMedicament}</div>
  }

  return <div>Médicament {String(rowNumber).padStart(2, '0')}</div>
}

export default MedicamentRowLabel
