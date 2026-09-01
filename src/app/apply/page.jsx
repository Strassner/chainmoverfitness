import ApplicationPage from '@/components/ApplicationPage'

export const metadata = {
  title: "Book a Call with Luke",
  description: "Book a 30-minute one-on-one call with Luke Strassner about your metabolic health. Pick a time that works and we will tell you honestly whether coaching is the right fit.",
  alternates: { canonical: "/apply" },
  openGraph: { title: "Book a Call with Luke", description: "Book a 30-minute one-on-one call with Luke Strassner about your metabolic health. Pick a time that works and we will tell you honestly whether coaching is the right fit.", url: "/apply" },
}

export default function Page() {
  return <ApplicationPage />
}
