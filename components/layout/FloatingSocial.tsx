"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { FloatingSocialItem } from "@/lib/supabase/contact";

type FloatingSocialProps = {
  labels?: {
    share: string;
    phone: string;
    facebook: string;
    line: string;
    instagram: string;
    mail: string;
    links?: {
      facebook: string;
      line: string;
      instagram: string;
      phone: string;
      mail: string;
    };
  };
  items?: FloatingSocialItem[];
  lang?: "en" | "th";
  style?: React.CSSProperties;
  isPreview?: boolean;
};

const FacebookIcon = () => (
  <svg
    className="social-icon"
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103.435.057.807.123 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
    />
  </svg>
);

const LineIcon = () => (
  <svg
    className="social-icon"
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg
    className="social-icon"
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    />
  </svg>
);

const defaultColors: Record<string, string> = {
  facebook: "#3b5998",
  line: "#06c755",
  instagram: "#e1306c",
  tiktok: "#000000",
  x: "#000000",
  whatsapp: "#25d366",
  youtube: "#ff0000",
  linkedin: "#0077b5",
  phone: "#ffc107",
  call: "#ffc107",
  mobile: "#ffc107",
  telephone: "#ffc107",
  mail: "#ff5f00",
};

export default function FloatingSocial({ labels, items, lang = "en", style, isPreview }: FloatingSocialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rotationCount, setRotationCount] = useState(0);
  const pathname = usePathname();

  // Show only if NOT in admin, OR if explicitly in Preview mode
  if (pathname?.startsWith("/admin") && !isPreview) {
    return null;
  }

  // Fallback defaults if not provided
  const shareLabel = labels?.share ?? "Contact menu";

  type TransformedItem = {
    key: string;
    label: string | undefined;
    className: string;
    href: string;
    bgColor: string;
    iconColor: string;
    shadowColor: string;
    external: boolean;
    icon: React.ReactNode;
  };

  let socialItems: TransformedItem[] = [];

  if (items && items.length > 0) {
    socialItems = items.map((item, index) => {
      // Determine background color: DB > Default by Type > Fallback
      const bgColor = item.bgColor || defaultColors[item.type] || "#1a1612";
      const iconColor = item.iconColor || "#ffffff";
      
      // Basic shadow color calculation (simplified for now, ideally use a color library)
      let shadowColor = "#000000";
      if (bgColor === "#3b5998") shadowColor = "#324a80";
      else if (bgColor === "#06c755") shadowColor = "#049b42";
      else if (bgColor === "#e1306c") shadowColor = "#b82555";
      else if (bgColor === "#ffc107") shadowColor = "#e0a800";
      else if (bgColor === "#ff5f00") shadowColor = "#e06f00";

      return {
        key: item.id,
        label: lang === "th" ? item.label_th || item.label : item.label,
        className: `social-item-${index + 1}`,
        href: item.href,
        bgColor,
        iconColor,
        shadowColor,
        external: !item.href.startsWith("tel:") && !item.href.startsWith("mailto:"),
        icon: (
          <span
            className="social-icon-wrapper block w-[22px] h-[22px]"
            dangerouslySetInnerHTML={{ __html: item.iconSvg }}
          />
        ),
      };
    });
  } else if (labels) {
    const links = labels.links ?? {
      facebook: "#",
      line: "#",
      instagram: "#",
      phone: "tel:+66000000000",
      mail: "mailto:hello@example.com",
    };
    socialItems = [
      {
        key: "facebook",
        label: labels.facebook,
        className: "social-item-1",
        href: links.facebook,
        external: true,
        icon: <FacebookIcon />,
        bgColor: defaultColors.facebook,
        iconColor: "#ffffff",
        shadowColor: "#324a80",
      },
      {
        key: "line",
        label: labels.line,
        className: "social-item-2",
        href: links.line,
        external: true,
        icon: <LineIcon />,
        bgColor: defaultColors.line,
        iconColor: "#ffffff",
        shadowColor: "#049b42",
      },
      {
        key: "instagram",
        label: labels.instagram,
        className: "social-item-3",
        href: links.instagram,
        external: true,
        icon: <InstagramIcon />,
        bgColor: defaultColors.instagram,
        iconColor: "#ffffff",
        shadowColor: "#b82555",
      },
      {
        key: "phone",
        label: labels.phone,
        className: "social-item-4",
        href: links.phone,
        external: false,
        icon: <span className="material-icons">phone</span>,
        bgColor: defaultColors.phone,
        iconColor: "#ffffff",
        shadowColor: "#e0a800",
      },
      {
        key: "mail",
        label: labels.mail,
        className: "social-item-5",
        href: links.mail,
        external: false,
        icon: <span className="material-icons">mail</span>,
        bgColor: defaultColors.mail,
        iconColor: "#ffffff",
        shadowColor: "#e06f00",
      },
    ];
  }

  return (
    <div className="social-share-container" style={style}>
      <style jsx global>{`
        .social-share-container .social-icon-wrapper svg,
        .social-share-container .social-icon-wrapper svg path {
          fill: currentColor !important;
          width: 100%;
          height: 100%;
        }
      `}</style>
      <ul
        id="social-share-list"
        className={`social-itens ${isOpen ? "open" : "hidden"}`}
      >
        {socialItems.map((item) => (
          <li key={item.key}>
            <a
              className={`btn-share ${item.className}`}
              href={item.href}
              aria-label={item.label}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              ref={(node) => {
                if (node && item.bgColor) {
                  node.style.setProperty("background-color", item.bgColor, "important");
                  node.style.setProperty("color", item.iconColor, "important");
                  if (item.shadowColor) {
                    node.style.setProperty("--icon-shadow-color", item.shadowColor);
                  }
                }
              }}
            >
              {item.icon}
              <span className="btn-share-text">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="social-open-menu">
        <button
          type="button"
          className="btn-share"
          aria-controls="social-share-list"
          aria-expanded={isOpen}
          onClick={() => {
            setIsOpen((prev) => !prev);
            setRotationCount((prev) => prev + 1);
          }}
          style={{
            transform: `rotate(${rotationCount * 360}deg)`,
            transition: "transform 0.6s ease",
          }}
        >
          <span className="material-icons" aria-hidden="true">
            {isOpen ? "close" : "chat"}
          </span>
          <span className="sr-only">{shareLabel}</span>
        </button>
      </div>
    </div>
  );
}