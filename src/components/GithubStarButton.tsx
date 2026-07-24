const REPO_URL = 'https://github.com/mst-software-vn/pro192web'

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5 shrink-0">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.833.09-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.921.678 1.856 0 1.34-.012 2.421-.012 2.751 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  )
}

// Chỉ hiển thị icon — không hiển thị số sao vì repo hiện còn ít sao, hiển thị ra sẽ
// không đẹp. Nếu cần lại số sao thật (GitHub REST API, không cần token) thì thêm sau.
export function GithubStarButton() {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="GitHub repository"
      className="text-ink-muted hover:bg-panel hover:text-ink flex h-9 w-9 items-center justify-center rounded-md transition-colors"
    >
      <GithubIcon />
    </a>
  )
}
