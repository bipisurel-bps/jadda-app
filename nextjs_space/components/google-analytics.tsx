'use client';

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export default function GoogleAnalytics() {
  if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') {
    return null;
  }
  return <NextGoogleAnalytics gaId={GA_ID} />;
}
