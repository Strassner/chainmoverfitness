import { EarlyWarningPage } from '@/components/BucketPage'

export const metadata = {
  title: "Early Warning — Your Metabolic Results",
  description: "Your quiz put you at the early warning stage of insulin resistance. Here is what that means, what is driving it, and the order to fix it in.",
  alternates: { canonical: "/early" },
  openGraph: { title: "Early Warning — Your Metabolic Results", description: "Your quiz put you at the early warning stage of insulin resistance. Here is what that means, what is driving it, and the order to fix it in.", url: "/early" },
}

export default function Page() {
  return <EarlyWarningPage />
}
