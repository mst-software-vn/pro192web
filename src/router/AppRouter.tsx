import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { firstChapterSlug } from '../content/chapters'
import { LanguageProvider } from '../hooks/use-language'

const LandingPage = lazy(() =>
  import('../pages/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const DocsLayout = lazy(() =>
  import('../layout/DocsLayout').then((m) => ({ default: m.DocsLayout })),
)
const DocsPage = lazy(() => import('../pages/DocsPage').then((m) => ({ default: m.DocsPage })))
const PrintChapterPage = lazy(() =>
  import('../pages/PrintChapterPage').then((m) => ({ default: m.PrintChapterPage })),
)

function RouteFallback() {
  return <div className="bg-canvas min-h-svh" />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/docs" element={<DocsLayout />}>
              <Route index element={<Navigate to={firstChapterSlug} replace />} />
              <Route path=":slug" element={<DocsPage />} />
            </Route>
            <Route path="/print/docs/:slug" element={<PrintChapterPage />} />
          </Routes>
        </Suspense>
      </LanguageProvider>
    </BrowserRouter>
  )
}
