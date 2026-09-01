import PudgeScorePage from '@/components/PudgeScorePage'

export const metadata = {
  title: "What's Your Pudge Score?",
  description: "Upload one photo and get a body fat estimate plus your Pudge Score, with what the number actually means for your metabolic health.",
  alternates: { canonical: "/pudgescore" },
  openGraph: { title: "What's Your Pudge Score?", description: "Upload one photo and get a body fat estimate plus your Pudge Score, with what the number actually means for your metabolic health.", url: "/pudgescore" },
}

export default function Page() {
  return <PudgeScorePage />
}
