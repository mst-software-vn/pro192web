import { AnnouncementBar } from '../components/landing/AnnouncementBar'
import { ChapterGrid } from '../components/landing/ChapterGrid'
import { HeroSection } from '../components/landing/HeroSection'
import { LandingNav } from '../components/landing/LandingNav'
import { SiteFooter } from '../components/landing/SiteFooter'
import '../styles/landing.css'

// Landing Page — chuyển đổi từ docs/design-references/PRO192-Landing.dc.html.
// Font dùng --font-sans hệ thống sẵn có (không thêm Google Fonts Inter — skill
// minimalist-ui cấm rõ), chapter card/CTA trỏ về route /docs/<slug thật> thay vì
// /chapters/<slug> hư cấu trong bản thiết kế gốc (xem src/data/chapters.ts).
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
        <ChapterGrid />
      </div>

      <SiteFooter />
    </div>
  )
}
