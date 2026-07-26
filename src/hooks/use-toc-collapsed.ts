import { useState } from 'react'

const STORAGE_KEY = 'pro192-toc-collapsed'

export function readTocCollapsed(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function writeTocCollapsed(collapsed: boolean): void {
  localStorage.setItem(STORAGE_KEY, String(collapsed))
}

export function useTocCollapsed() {
  const [collapsed, setCollapsedState] = useState<boolean>(readTocCollapsed)

  function setCollapsed(value: boolean) {
    writeTocCollapsed(value)
    setCollapsedState(value)
  }

  return { collapsed, setCollapsed }
}
