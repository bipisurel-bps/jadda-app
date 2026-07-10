'use client';

import HomeClient from './_components/home-client';
import { WebsiteJsonLd } from '@/components/json-ld';

export default function HomePage() {
  return (
    <>
      <WebsiteJsonLd baseUrl="https://jadda.app" />
      <HomeClient />
    </>
  );
}
