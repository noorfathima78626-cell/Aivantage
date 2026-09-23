import React from 'react'

export default function MetricChip({ label, value }) {
  return (
    <div className="metric-chip">
      <span>{label}</span>
      <span className="val">{value}</span>
    </div>
  )
}
