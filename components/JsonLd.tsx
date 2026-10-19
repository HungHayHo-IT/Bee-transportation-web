/**
 * Structured data. The payload is built on the server from lib/site.ts — it
 * never contains anything a visitor typed — so serialising it into a script
 * tag is safe; `<` is still escaped so a stray value can never close the tag
 * early.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
