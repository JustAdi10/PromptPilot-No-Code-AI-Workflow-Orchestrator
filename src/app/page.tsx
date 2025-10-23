import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/landing/landing-page';

export default function HomePage() {
  // In a real app, check if user is authenticated and redirect to dashboard
  // For now, show landing page
  return <LandingPage />;
}