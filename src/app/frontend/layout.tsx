import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Stories - Our Wall of Love',
  description: 'Read what our talented community members are saying about our platform.',
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 