'use client';

import { useEffect, useState } from 'react';

/**
 * The pages are prerendered, so a year rendered on the server is the year of
 * the last deploy — visibly wrong every January until someone redeploys.
 * Render the build-time year first so the markup is never empty, then correct
 * it on the client.
 */
export function Year({ buildYear }: { buildYear: number }) {
  const [year, setYear] = useState(buildYear);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <span>{year}</span>;
}
