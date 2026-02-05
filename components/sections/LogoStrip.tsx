"use client";

import Image from "next/image";

export default function LogoStrip() {
  const hardcodedLogos = [
    { src: "/tech/bun.svg", alt: "Bun.js" },
    { src: "/tech/nextjs.svg", alt: "Next.js" },
    { src: "/tech/tailwind.svg", alt: "Tailwind CSS" },
    { src: "/tech/supabase.svg", alt: "Supabase" },
    { src: "/tech/typescript.svg", alt: "TypeScript" },
    { src: "/tech/react.svg", alt: "React" },
    { src: "/tech/nodejs.svg", alt: "Node.js" },
    { src: "/tech/docker.svg", alt: "Docker" },
    { src: "/tech/python.svg", alt: "Python" },
    { src: "/tech/firebase.svg", alt: "Firebase" },
    { src: "/tech/figma.svg", alt: "Figma" },
    { src: "/tech/github.svg", alt: "GitHub" },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#181411] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg leading-8 font-semibold text-neutral-900 dark:text-white transition-colors duration-300">
          Trusted by leading brands
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {hardcodedLogos.map((logo, index) => (
            <Image
              key={index}
              className="col-span-2 max-h-12 w-full object-contain sm:col-span-3 lg:col-span-1 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              src={logo.src}
              alt={logo.alt}
              width={158}
              height={48}
            />
          ))}
        </div>
      </div>
    </section>
  );
}