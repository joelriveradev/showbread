export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  // Pad the seconds with leading zero if less than 10
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString()

  return `${minutes}:${paddedSeconds}`
}
