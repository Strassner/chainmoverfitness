import PostCallPage from '@/components/PostCallPage'

export const metadata = {
  title: "Your Call Is Not Confirmed Yet",
  description: "One more step before your call is confirmed. Watch this first so we can use the time properly, then check your email for the calendar invite.",
  alternates: { canonical: "/booked" },
  robots: { index: false, follow: true },
}

export default function Page() {
  return <PostCallPage />
}
