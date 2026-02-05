import { supabaseClient } from "@/lib/supabase/client";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";

export type PortfolioHeroStyles = {
  titleFontFamily?: string;
  titleFontSize?: string;
  titleColor?: string; // Light mode default
  titleColorDark?: string; // Dark mode override
  accentColor?: string;
  accentColorDark?: string;
  descriptionFontFamily?: string;
  descriptionFontSize?: string;
  descriptionColor?: string;
  descriptionColorDark?: string;
};

export type PortfolioHeroConfig = {
  title: string;
  title_th?: string;
  accent: string;
  accent_th?: string;
  description: string;
  description_th?: string;
  styles?: PortfolioHeroStyles;
};

export type PortfolioProjectStyles = {
  titleFontFamily?: string;
  titleFontSize?: string;
  titleColor?: string;
  titleColorDark?: string;
  descriptionFontFamily?: string;
  descriptionFontSize?: string;
  descriptionColor?: string;
  descriptionColorDark?: string;
};

export type PortfolioProject = {
  id: string;
  title: string;
  title_th?: string;
  description: string;
  description_th?: string;
  image: string;
  link?: string;
  gallery?: string[];
  breadcrumbs?: string;
  breadcrumbs_th?: string;
  details?: string[];
  details_th?: string[];
  tech?: string[];
  styles?: PortfolioProjectStyles;
};

export type PortfolioContent = {
  hero: PortfolioHeroConfig;
  projects: PortfolioProject[];
};

export const PORTFOLIO_HERO_TABLE = "portfolio_hero";
export const PORTFOLIO_PROJECTS_TABLE = "portfolio_projects";

const defaultHero: PortfolioHeroConfig = {
  title: "Crafting Digital",
  title_th: "สร้างสรรค์ดิจิทัล",
  accent: "Grandeur.",
  accent_th: "ความยิ่งใหญ่",
  description:
    "Specializing in high-end web experiences that blend aesthetic luxury with technical precision.",
  description_th: "เชี่ยวชาญในการสร้างประสบการณ์เว็บระดับไฮเอนด์ที่ผสมผสานความหรูหราทางสุนทรียศาสตร์เข้ากับความแม่นยำทางเทคนิค",
  styles: {
    titleFontFamily: "Space Grotesk, sans-serif",
    titleFontSize: "clamp(2.75rem, 6vw, 4.5rem)",
    titleColor: "#181411", // Dark text for Light mode
    titleColorDark: "#f5f1da", // Light text for Dark mode
    accentColor: "#f27f0d",
    accentColorDark: "#ffffff",
    descriptionFontFamily: "Space Grotesk, sans-serif",
    descriptionFontSize: "1.25rem",
    descriptionColor: "#6b5d52",
    descriptionColorDark: "#bbae9b",
  },
};

const defaultProjectStyles: PortfolioProjectStyles = {
  titleFontFamily: "Space Grotesk, sans-serif",
  titleFontSize: "clamp(1.75rem, 3vw, 2.5rem)",
  titleColor: "#181411",
  titleColorDark: "#ffffff",
  descriptionFontFamily: "Space Grotesk, sans-serif",
  descriptionFontSize: "1rem",
  descriptionColor: "#6b5d52",
  descriptionColorDark: "#eae6d6",
};

const defaultProjects: PortfolioProject[] = [
  {
    id: "minecraft",
    title: "A Minecraft Movie",
    title_th: "ภาพยนตร์มายคราฟ",
    description: "Four misfits are suddenly pulled through a mysterious portal...",
    description_th: "คนแปลกหน้า 4 คนถูกดูดผ่านพอร์ทัลลึกลับ...",
    image: "https://posters.movieposterdb.com/25_02/2025/3566834/l_a-minecraft-movie-movie-poster_0be81db1.jpg",
    link: "https://nextbeaver.com/projects/minecraft",
    breadcrumbs: "Home | Dashboard",
    breadcrumbs_th: "หน้าหลัก | แดชบอร์ด",
    styles: { ...defaultProjectStyles },
  },
];

const CACHE_ENABLED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const PORTFOLIO_REVALIDATE_SECONDS = 600;

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  hero: defaultHero,
  projects: defaultProjects,
};

const getPortfolioReader = () => {
  if (typeof window !== "undefined") {
    return supabaseClient;
  }
  const adminClient = getSupabaseAdminClient();
  return adminClient ?? supabaseClient;
};

const getPortfolioContentInternal = async (): Promise<PortfolioContent> => {
  const reader = getPortfolioReader();

  // Fetch Hero
  const heroQuery = reader
    .from(PORTFOLIO_HERO_TABLE)
    .select("*")
    .limit(1)
    .maybeSingle();

  // Fetch Projects
  const projectsQuery = reader
    .from(PORTFOLIO_PROJECTS_TABLE)
    .select("*")
    .order("order_index", { ascending: true });

  const [heroRes, projectsRes] = await Promise.all([heroQuery, projectsQuery]);

  if (heroRes.error) console.error("Error fetching hero:", heroRes.error);
  if (projectsRes.error) console.error("Error fetching projects:", projectsRes.error);

  const hero = heroRes.data ? {
    title: heroRes.data.title,
    title_th: heroRes.data.title_th,
    accent: heroRes.data.accent,
    accent_th: heroRes.data.accent_th,
    description: heroRes.data.description,
    description_th: heroRes.data.description_th,
    styles: heroRes.data.styles
  } : defaultHero;

  const projects = (projectsRes.data || []).map((p: PortfolioProject) => ({
    id: p.id,
    title: p.title,
    title_th: p.title_th,
    description: p.description,
    description_th: p.description_th,
    image: p.image,
    link: p.link,
    breadcrumbs: p.breadcrumbs,
    breadcrumbs_th: p.breadcrumbs_th,
    details: p.details,
    details_th: p.details_th,
    tech: p.tech,
    gallery: p.gallery,
    styles: p.styles
  }));

  if (!heroRes.data && (!projectsRes.data || projectsRes.data.length === 0)) {
    return DEFAULT_PORTFOLIO_CONTENT;
  }

  return {
    hero,
    projects: projects.length > 0 ? projects : [],
  };
};

const getPortfolioContentCached = unstable_cache(getPortfolioContentInternal, [CACHE_TAGS.portfolio], {
  revalidate: PORTFOLIO_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.portfolio],
});

export async function getPortfolioContent(): Promise<PortfolioContent> {
  if (!CACHE_ENABLED) {
    return DEFAULT_PORTFOLIO_CONTENT;
  }

  return getPortfolioContentCached();
}

export async function getPortfolioContentUncached(): Promise<PortfolioContent> {
  return getPortfolioContentInternal();
}
