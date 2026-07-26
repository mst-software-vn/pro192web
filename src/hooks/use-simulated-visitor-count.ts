import { useEffect, useState } from 'react'

export function bandForHour(hour: number): [number, number] {
  if (hour >= 19 && hour <= 23) return [150, 320]
  if (hour >= 7 && hour <= 18) return [60, 150]
  return [20, 60]
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function useSimulatedVisitorCount(): number {
  const [count, setCount] = useState(() => {
    const [min, max] = bandForHour(new Date().getHours())
    return randomInRange(min, max)
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((current) => {
        const [min, max] = bandForHour(new Date().getHours())
        const next = current + randomInRange(-4, 4)
        return Math.min(max, Math.max(min, next))
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return count
}
