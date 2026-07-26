import { AnnouncementBar } from '../components/landing/AnnouncementBar'
import { ChapterGrid } from '../components/landing/ChapterGrid'
import { HeroSection } from '../components/landing/HeroSection'
import { LandingNav } from '../components/landing/LandingNav'
import { SiteFooter } from '../components/landing/SiteFooter'
import { StatsSection } from '../components/landing/StatsSection'
import '../styles/landing.css'

export function LandingPage() {
  return (
    <div className="landing-page dark relative min-h-svh overflow-x-clip">
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
