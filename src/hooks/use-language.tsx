import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Language = 'vi' | 'en'

const STORAGE_KEY = 'pro192-language'

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

// Ngôn ngữ hiển thị nội dung Docs — dùng Context vì LanguageSelector (header) và
// DocsPage/DocsLayout (nội dung + TOC) là các cây component tách biệt cần cùng đọc
// 1 state, khác với theme (chỉ cần class CSS, không cần re-render nội dung).
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'vi'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
