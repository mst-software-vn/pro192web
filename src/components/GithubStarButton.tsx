import { useEffect, useState } from 'react'

const REPO_URL = 'https://github.com/mst-software-vn/pro192web'
const API_URL = 'https://api.github.com/repos/mst-software-vn/pro192web'

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.833.09-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.921.678 1.856 0 1.34-.012 2.421-.012 2.751 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  )
}

// Lấy số sao thật từ GitHub REST API (public, không cần token) một lần khi mount.
// Lỗi hoặc rate-limit thì im lặng bỏ qua — nút vẫn hoạt động, chỉ ẩn số sao.
export function GithubStarButton() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(API_URL)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: { stargazers_count?: number }) => {
        if (!cancelled && typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count)
        }
      })
      .catch(() => {
        // Bỏ qua — giữ nguyên UI không có số sao.
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      className="border-hairline text-ink-secondary hover:bg-panel flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors"
    >
      <GithubIcon />
      <span className="hidden lg:inline">GitHub</span>
      {stars !== null ? (
        <span className="text-ink-faint hidden items-center gap-0.5 lg:flex">
          <span aria-hidden>★</span>
          {stars}
        </span>
      ) : null}
    </a>
  )
}
