"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const SLOT_COUNT = 13;

export default function AdminUnlock() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const slots = useMemo(() => {
    return Array.from({ length: SLOT_COUNT }, (_, index) => {
      const char = value[index] || "";
      return { char, filled: Boolean(char) };
    });
  }, [value]);

  const extraCount = Math.max(0, value.length - SLOT_COUNT);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!value.trim()) {
      setError("กรุณากรอกคำผ่านของแอดมิน");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      });

      if (!response.ok) {
        setError("คำผ่านไม่ถูกต้อง");
        return;
      }

      router.replace("/admin/home");
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-verify relative min-h-screen overflow-hidden text-[#f8f7f6]">
      <div className="admin-verify-light-1" aria-hidden="true" />
      <div className="admin-verify-light-2" aria-hidden="true" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-10 lg:px-24">
          <div className="flex w-full max-w-[1200px] flex-col items-center">
            <div className="mb-10 text-center sm:mb-16">
              <h1 className="text-[32px] font-extralight uppercase leading-tight tracking-[0.4em] text-[#f8f7f6] sm:text-[42px]">
                Nextbeaver <span className="font-bold text-[#ec7f13]">Secure Access</span>
              </h1>
              <div className="mt-6 flex items-center justify-center gap-6 sm:gap-10">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#ec7f13]/30 to-transparent sm:w-24" />
                <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#f8f7f6]/40">
                  Nextbeaver Security Matrix
                </p>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#ec7f13]/30 to-transparent sm:w-24" />
              </div>
            </div>

            <div className="admin-verify-panel relative w-full max-w-[920px] overflow-hidden rounded-2xl border border-white/5 p-8 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.8)] sm:p-12 lg:p-24">
              <form onSubmit={handleSubmit} className="flex flex-col items-center gap-12">
                <fieldset className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:flex-nowrap">
                  <div className="flex gap-2">
                    {slots.slice(0, 5).map((slot, index) => (
                      <div
                        key={`slot-1-${index}`}
                        className={`admin-verify-slot ${slot.filled ? "filled" : ""}`}
                        onClick={() => inputRef.current?.focus()}
                        role="presentation"
                      >
                        <div className="admin-verify-liquid" />
                        {slot.filled ? (
                          <Image
                            src="/images/beaver-dot.png"
                            alt=""
                            width={84}
                            height={84}
                            className="relative z-20 h-[84px] w-[84px] max-w-none object-contain"
                          />
                        ) : (
                          <span className="relative z-10 text-2xl font-light text-[#f8f7f6]/15">·</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center px-2">
                    <div className="h-6 w-px bg-[#ec7f13]/20" />
                  </div>

                  <div className="flex gap-2">
                    {slots.slice(5, 9).map((slot, index) => (
                      <div
                        key={`slot-2-${index}`}
                        className={`admin-verify-slot ${slot.filled ? "filled" : ""}`}
                        onClick={() => inputRef.current?.focus()}
                        role="presentation"
                      >
                        <div className="admin-verify-liquid" />
                        {slot.filled ? (
                          <Image
                            src="/images/beaver-dot.png"
                            alt=""
                            width={84}
                            height={84}
                            className="relative z-20 h-[84px] w-[84px] max-w-none object-contain"
                          />
                        ) : (
                          <span className="relative z-10 text-2xl font-light text-[#f8f7f6]/15">·</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center px-2">
                    <div className="h-6 w-px bg-[#ec7f13]/20" />
                  </div>

                  <div className="flex gap-2">
                    {slots.slice(9, 13).map((slot, index) => (
                      <div
                        key={`slot-3-${index}`}
                        className={`admin-verify-slot ${slot.filled ? "filled" : ""}`}
                        onClick={() => inputRef.current?.focus()}
                        role="presentation"
                      >
                        <div className="admin-verify-liquid" />
                        {slot.filled ? (
                          <Image
                            src="/images/beaver-dot.png"
                            alt=""
                            width={84}
                            height={84}
                            className="relative z-20 h-[84px] w-[84px] max-w-none object-contain"
                          />
                        ) : (
                          <span className="relative z-10 text-2xl font-light text-[#f8f7f6]/15">·</span>
                        )}
                      </div>
                    ))}
                  </div>
                </fieldset>

                <input
                  ref={inputRef}
                  type="password"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  maxLength={SLOT_COUNT}
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="sr-only"
                  autoComplete="current-password"
                  aria-label="Admin password"
                />

                {extraCount > 0 ? (
                  <div className="rounded-full border border-[#ec7f13]/25 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#f8f7f6]/60">
                    +{extraCount} more
                  </div>
                ) : null}

                {error ? (
                  <div className="w-full max-w-[520px] rounded-xl border border-[#f1c2b0]/30 bg-[#24140b]/70 px-4 py-3 text-center text-sm text-[#f6c7b8]">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative overflow-hidden border border-[#ec7f13]/20 px-10 py-4 text-[12px] font-medium uppercase tracking-[0.4em] text-[#f8f7f6] transition-all duration-700 hover:border-[#ec7f13] hover:bg-[#ec7f13]/5 disabled:cursor-not-allowed disabled:opacity-70 sm:px-20 sm:py-5 sm:text-[13px]"
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Verifying..." : "Unlock Admin Access"}
                  </span>
                  <span className="absolute inset-0 translate-y-full bg-[#ec7f13]/10 transition-transform duration-500 group-hover:translate-y-0" />
                </button>

                <div className="flex flex-col items-center gap-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#f8f7f6]/20 sm:flex-row sm:gap-10">
                  <span className="flex items-center gap-3 transition-colors hover:text-[#ec7f13]">
                    <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                    Protocol
                  </span>
                  <div className="hidden size-1 rounded-full bg-[#ec7f13]/20 sm:block" />
                  <div className="flex items-center gap-3">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-[#ec7f13]/40 opacity-75" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-[#ec7f13]/60" />
                    </span>
                    Active
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>

        <footer className="flex items-end justify-between p-8 sm:p-16">
          <div className="flex flex-col gap-4">
            <div className="h-px w-32 bg-gradient-to-r from-[#ec7f13]/20 to-transparent sm:w-40" />
          </div>
          <div className="text-right">
            <div className="ml-auto h-px w-32 bg-gradient-to-l from-[#ec7f13]/20 to-transparent sm:w-40" />
          </div>
        </footer>
      </div>
    </div>
  );
}
