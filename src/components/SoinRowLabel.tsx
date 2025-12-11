'use client'
import { useRowLabel } from '@payloadcms/ui'

export const SoinRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ heureSoin?: string; titre?: string }>()

  if (data?.heureSoin && data?.titre) {
    return (
      <div>
        {data.heureSoin} - {data.titre}
      </div>
    )
  }

  if (data?.titre) {
    return <div>{data.titre}</div>
  }

  return <div>Soin {String(rowNumber).padStart(2, '0')}</div>
}

export default SoinRowLabel
