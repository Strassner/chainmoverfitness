import QuizPage from '@/components/QuizPage'

export const metadata = {
  title: "Metabolic Health Quiz",
  description: "Answer a few questions and get a personalized read on your insulin resistance risk, the markers driving it, and what to do next. Takes about 60 seconds.",
  alternates: { canonical: "/quiz" },
  openGraph: { title: "Metabolic Health Quiz", description: "Answer a few questions and get a personalized read on your insulin resistance risk, the markers driving it, and what to do next. Takes about 60 seconds.", url: "/quiz" },
}

export default function Page() {
  return <QuizPage />
}
