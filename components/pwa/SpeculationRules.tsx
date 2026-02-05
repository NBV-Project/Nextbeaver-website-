import Script from "next/script";

export function SpeculationRules() {
  return (
    <Script id="speculation-rules" strategy="afterInteractive">
      {`
        if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
          const specScript = document.createElement('script');
          specScript.type = 'speculationrules';
          const rules = {
            prerender: [
              {
                source: 'document',
                where: {
                  and: [
                    { href_matches: '/*' },
                    { not: { href_matches: '/api/*' } },
                    { not: { href_matches: '/admin/*' } }
                  ]
                },
                eagerness: 'moderate' // Preload on hover/mousedown (Smart & Safe)
              }
            ]
          };
          specScript.textContent = JSON.stringify(rules);
          document.body.appendChild(specScript);
        }
      `}
    </Script>
  );
}
