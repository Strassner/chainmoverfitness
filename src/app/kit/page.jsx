import KitPage from '@/components/KitPage'

export const metadata = {
  title: "It Was Never a Willpower Problem",
  description: "The metabolic starter kit: what to measure, what the numbers mean, and the first changes that move them.",
  alternates: { canonical: "/kit" },
  openGraph: { title: "It Was Never a Willpower Problem", description: "The metabolic starter kit: what to measure, what the numbers mean, and the first changes that move them.", url: "/kit" },
}

export default function Page() {
  return <KitPage />
}
