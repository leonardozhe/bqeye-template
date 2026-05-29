// Root layout — server component (GeoSEO standard: root layout must be server-side)
import ThemeRegistry from '@/components/theme/ThemeRegistry';
import '@fontsource/bricolage-grotesque/400.css';
import '@fontsource/bricolage-grotesque/500.css';
import '@fontsource/bricolage-grotesque/700.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'BQEye — Premium Colored Contacts & Cosplay Lenses',
    template: '%s | BQEye',
  },
  description:
    'Shop premium colored contact lenses, cosplay lenses, and eyewear accessories. Transform your look with stunning galaxy blue, hazel brown, and violet lenses.',
  keywords: ['colored contacts', 'cosplay lenses', 'contact lenses', 'eyewear accessories'],
  openGraph: {
    title: 'BQEye — Premium Colored Contacts & Cosplay Lenses',
    description: 'Shop premium colored contact lenses, cosplay lenses, and eyewear accessories.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
