import { useEffect, useState } from 'react'

// Dải số theo khung giờ trong ngày (giờ máy người dùng) để trông có quy luật thay vì
// random thuần — khung tối (19h-23h) là giờ học bài cao điểm nên số cao nhất.
export function bandForHour(hour: number): [number, number] {
  if (hour >= 19 && hour <= 23) return [150, 320]
  if (hour >= 7 && hour <= 18) return [60, 150]
  return [20, 60] // 0h-6h, ít người học nhất
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Giả lập số sinh viên đang truy cập — hoàn toàn phía client, không gọi API bên thứ ba
// nào (tránh phụ thuộc 1 dịch vụ mock không có SLA/auth). Sinh số ban đầu theo khung giờ
// hiện tại, rồi "nhích" nhẹ mỗi vài giây để trông như đang cập nhật live thay vì đứng yên.
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
