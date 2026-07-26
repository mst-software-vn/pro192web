import { AnnouncementBar } from '../components/landing/AnnouncementBar'
import { ChapterGrid } from '../components/landing/ChapterGrid'
import { HeroSection } from '../components/landing/HeroSection'
import { LandingNav } from '../components/landing/LandingNav'
import { SiteFooter } from '../components/landing/SiteFooter'
import { StatsSection } from '../components/landing/StatsSection'
import '../styles/landing.css'

// 2026-07-26: khôi phục light mode cho Landing (đã dùng thử luôn-dark 1 ngày trước, giờ
// đổi lại theo yêu cầu) — không còn gắn cứng class "dark" ở đây, Landing dùng chung theme
// sáng/tối/hệ thống với Docs qua class .dark ở <html> (do useTheme() điều khiển).
export function LandingPage() {
  return (
    <div className="landing-page relative min-h-svh overflow-x-clip">
      <div className="landing-grid-bg pointer-events-none absolute inset-0" />

      <div className="relative">
        <header className="sticky top-0 z-50">
          <AnnouncementBar />
          <LandingNav />
        </header>

        <HeroSection />
        <StatsSection />
        <ChapterGrid />
      </div>

      <SiteFooter />
    </div>
  )
}
