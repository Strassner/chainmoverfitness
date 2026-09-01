import LandingSalesPage from '@/components/LandingSalesPage'

export const metadata = {
  title: "Redefine Your Health",
  description: "The full case for the MROI Method: what it is, who it is for, the results it has produced, and what working together looks like.",
  alternates: { canonical: "/landing" },
  openGraph: { title: "Redefine Your Health", description: "The full case for the MROI Method: what it is, who it is for, the results it has produced, and what working together looks like.", url: "/landing" },
}

export default function Page() {
  return <LandingSalesPage />
}
