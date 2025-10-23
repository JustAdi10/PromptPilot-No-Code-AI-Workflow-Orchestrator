import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { AppwriteProvider } from '@/lib/providers/appwrite-provider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PromptPilot - No-Code AI Workflow Orchestrator',
  description: 'Build powerful AI workflows visually with drag-and-drop blocks. Connect AI tasks, APIs, and actions without coding.',
  keywords: ['AI', 'automation', 'workflow', 'no-code', 'Appwrite', 'ChatGPT', 'DALL-E'],
  authors: [{ name: 'PromptPilot Team' }],
  openGraph: {
    title: 'PromptPilot - No-Code AI Workflow Orchestrator',
    description: 'Build powerful AI workflows visually with drag-and-drop blocks.',
    type: 'website',
    locale: 'en_US',
    siteName: 'PromptPilot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptPilot - No-Code AI Workflow Orchestrator',
    description: 'Build powerful AI workflows visually with drag-and-drop blocks.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#00D4FF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-900 text-white antialiased`}>
        <AppwriteProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {children}
          </div>
          <Toaster 
            position="bottom-right" 
            theme="dark"
            toastOptions={{
              style: {
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
              },
            }}
          />
        </AppwriteProvider>
      </body>
    </html>
  );
}