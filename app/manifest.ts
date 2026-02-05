import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nextbeaver Studio",
    short_name: "Nextbeaver",
    description: "Digital craftsmanship for bespoke web experiences.",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    background_color: "#181411",
    theme_color: "#181411",
    icons: [
      {
        src: "/icon/icon_192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon/icon_512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon/icon_192x192_maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon/icon_512x512_maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
