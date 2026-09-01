import CarbsPage from '@/components/CarbsPage'

export const metadata = {
  title: "The Best Carbs for Fat Loss",
  description: "Which carbohydrates actually help fat loss, which ones stall it, and why the answer depends on how insulin sensitive you currently are.",
  alternates: { canonical: "/carbs" },
  openGraph: { title: "The Best Carbs for Fat Loss", description: "Which carbohydrates actually help fat loss, which ones stall it, and why the answer depends on how insulin sensitive you currently are.", url: "/carbs" },
}

export default function Page() {
  return <CarbsPage />
}
