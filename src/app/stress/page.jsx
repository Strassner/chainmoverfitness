import { MetabolicStressPage } from '@/components/BucketPage'

export const metadata = {
  title: "Metabolic Stress — Your Metabolic Results",
  description: "Your quiz put you in metabolic stress. Here is what is driving it, why the usual advice stops working at this stage, and what changes it.",
  alternates: { canonical: "/stress" },
  openGraph: { title: "Metabolic Stress — Your Metabolic Results", description: "Your quiz put you in metabolic stress. Here is what is driving it, why the usual advice stops working at this stage, and what changes it.", url: "/stress" },
}

export default function Page() {
  return <MetabolicStressPage />
}
