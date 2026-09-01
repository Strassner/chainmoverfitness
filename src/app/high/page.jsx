import { HighRiskPage } from '@/components/BucketPage'

export const metadata = {
  title: "High Risk — Your Metabolic Results",
  description: "Your quiz put you in the high risk band for insulin resistance. Here is what that means, and the sequence that reverses it.",
  alternates: { canonical: "/high" },
  openGraph: { title: "High Risk — Your Metabolic Results", description: "Your quiz put you in the high risk band for insulin resistance. Here is what that means, and the sequence that reverses it.", url: "/high" },
}

export default function Page() {
  return <HighRiskPage />
}
