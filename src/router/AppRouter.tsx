import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { firstChapterSlug } from '../content/chapters'
import { LanguageProvider } from '../hooks/use-language'

// Tách bundle theo route: LandingPage nhẹ (marketing), DocsLayout/DocsPage kéo theo
// react-markdown + prism-react-renderer nên tải riêng, không làm nặng trang chủ.
const LandingPage = lazy(() =>
  import('../pages/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const DocsLayout = lazy(() =>
  import('../layout/DocsLayout').then((m) => ({ default: m.DocsLayout })),
)
const DocsPage = lazy(() => import('../pages/DocsPage').then((m) => ({ default: m.DocsPage })))
const SyllabusPage = lazy(() =>
  import('../pages/SyllabusPage').then((m) => ({ default: m.SyllabusPage })),
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
            <Route path="/syllabus-pro192-spring2021" element={<DocsLayout />}>
              <Route index element={<SyllabusPage />} />
            </Route>
          </Routes>
        </Suspense>
      </LanguageProvider>
    </BrowserRouter>
  )
}
