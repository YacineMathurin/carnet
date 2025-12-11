'use client'
import { useRowLabel } from '@payloadcms/ui'

export const HospitalisationRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ nomHopital?: string }>()

  return <div>{data?.nomHopital || `Hospitalisation ${String(rowNumber).padStart(2, '0')}`}</div>
}

export default HospitalisationRowLabel
