import { Suspense } from "react";
import { HomeBannerServer } from "@/components/home/home-banner-server";
import { HomeBannerSkeleton } from "@/components/home/home-banner-skeleton";
import { HomeCategoriesServer } from "@/components/home/home-categories-server";
import { HomeCategoriesSkeleton } from "@/components/home/home-categories-skeleton";
import { useGetHomePage } from "@/hooks/use-api-server";
import { getSeoImageUrl } from "@/lib/strapi";
import type { Metadata } from "next";

// Prevent caching to avoid SSR issues
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const getHomePage = useGetHomePage();
    const homePageData = await getHomePage();
    const banner = homePageData?.data?.PrincipalBanner;
    
    if (!banner) {
      return {
        title: "Marketplace - Cámaras de Seguridad",
        description: "Encuentra las mejores cámaras de seguridad para tu hogar o negocio",
      };
    }

    return {
      title: `Marketplace - ${banner.title}`,
      description: banner.description,
      openGraph: {
        title: `Marketplace - ${banner.title}`,
        description: banner.description,
        images: banner.media ? [getSeoImageUrl(banner.media)] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `Marketplace - ${banner.title}`,
        description: banner.description,
        images: banner.media ? [getSeoImageUrl(banner.media)] : [],
      },
    };
  } catch (error) {
    return {
      title: "Marketplace - Cámaras de Seguridad",
      description: "Encuentra las mejores cámaras de seguridad para tu hogar o negocio",
    };
  }
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<HomeBannerSkeleton />}>
        <HomeBannerServer />
      </Suspense>
      
      <Suspense fallback={<HomeCategoriesSkeleton />}>
        <HomeCategoriesServer />
      </Suspense>
      
      <section className="max-w-5xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center text-muted">
          <p>Próximamente: Más secciones dinámicas gestionadas desde Strapi CMS.</p>
        </div>
      </section>
    </main>
  );
}
