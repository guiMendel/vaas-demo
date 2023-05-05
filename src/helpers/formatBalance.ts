export default function formatBalance(value: number | undefined) {
  return value != undefined ? (Math.round(value * 100) / 100).toFixed(2) : '—'
}
