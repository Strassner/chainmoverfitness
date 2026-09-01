import SleepPage from '@/components/SleepPage'

export const metadata = {
  title: "Eight Hours in Bed and Still Exhausted",
  description: "The three reasons you wake up tired after a full night of sleep, why sleep apnea gets missed for years, and what to do about each one.",
  alternates: { canonical: "/sleep" },
  openGraph: { title: "Eight Hours in Bed and Still Exhausted", description: "The three reasons you wake up tired after a full night of sleep, why sleep apnea gets missed for years, and what to do about each one.", url: "/sleep" },
}

export default function Page() {
  return <SleepPage />
}
