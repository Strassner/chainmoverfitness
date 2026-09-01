import LandingPage from '@/components/LandingPage'

export const metadata = {
  title: "Stop Guessing. Get the Data, Then Lose the Weight for Good",
  description: "Bloodwork-led metabolic coaching. Find out what is actually driving your weight and fatigue, then fix it in the right order.",
  alternates: { canonical: "/metabolic" },
  openGraph: { title: "Stop Guessing. Get the Data, Then Lose the Weight for Good", description: "Bloodwork-led metabolic coaching. Find out what is actually driving your weight and fatigue, then fix it in the right order.", url: "/metabolic" },
}

export default function Page() {
  return <LandingPage />
}
