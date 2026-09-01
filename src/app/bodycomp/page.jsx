import BodyCompPage from '@/components/BodyCompPage'

export const metadata = {
  title: "Get Your Real Body Composition in 60 Seconds",
  description: "A free body composition estimate from a single photo. No scale, no calipers, no appointment.",
  alternates: { canonical: "/bodycomp" },
  openGraph: { title: "Get Your Real Body Composition in 60 Seconds", description: "A free body composition estimate from a single photo. No scale, no calipers, no appointment.", url: "/bodycomp" },
}

export default function Page() {
  return <BodyCompPage />
}
