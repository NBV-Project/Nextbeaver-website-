"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";

const CONSENT_COOKIE = "analytics_consent";
const CONSENT_GRANTED = "granted";
const CONSENT_DENIED = "denied";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}`;
};

type ConsentStatus = "unknown" | "granted" | "denied";

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentStatus>("unknown");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const stored = getCookieValue(CONSENT_COOKIE);
      if (stored === CONSENT_GRANTED || stored === CONSENT_DENIED) {
        setConsent(stored);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    setCookie(CONSENT_COOKIE, CONSENT_GRANTED, ONE_YEAR_SECONDS);
    setConsent(CONSENT_GRANTED);
  };

  const decline = () => {
    setCookie(CONSENT_COOKIE, CONSENT_DENIED, ONE_YEAR_SECONDS);
    setConsent(CONSENT_DENIED);
  };

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const isGranted = consent === CONSENT_GRANTED && Boolean(gaId);
  const isProduction = process.env.NODE_ENV === "production";
  const shouldLoadAnalytics = isGranted && isProduction;

  if (!isMounted) return null;

  return (
    <>
      {shouldLoadAnalytics ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="lazyOnload"
          />
          <Script id="ga4-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {consent === "unknown" ? (
        <div className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-6 sm:px-6">
          <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-[var(--color-surface)] p-5 text-text shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2 text-sm leading-relaxed text-muted">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  ประกาศการใช้คุกกี้
                </div>
                <p className="text-sm text-text/90">
                  เราใช้คุกกี้เพื่อวิเคราะห์การใช้งานเว็บไซต์และปรับปรุงประสบการณ์ของคุณ โปรดอ่าน
                  <Link href="/privacy" className="ml-1 font-semibold text-text underline underline-offset-4">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={decline}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text transition hover:border-primary"
                >
                  ปฏิเสธ
                </button>
                <button
                  type="button"
                  onClick={accept}
                  className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:opacity-90"
                >
                  ยอมรับ
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
