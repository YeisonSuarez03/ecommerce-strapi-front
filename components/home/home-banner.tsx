import { PrincipalBanner } from "@/types/principal-banner";
import { getBestMainImageUrl } from "@/lib/strapi";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HomeBannerProps {
  banner: PrincipalBanner;
}

export function HomeBanner({ banner }: HomeBannerProps) {
  const bannerImage = getBestMainImageUrl(banner.media);

    return (
    <section className="relative w-full min-h-[600px] overflow-hidden">
      {/* Background Image */}
      {banner.media && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage}
            alt={banner.title}
            fill
            className="object-cover blur-sm"
            priority
          />
        </div>
      )}
      
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 min-h-[600px] flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {banner.title}
          </h1>
          <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto">
            {banner.description}
          </p>
          <Link href={banner.buttonLink}>
            <Button className="rounded inline-flex items-center px-8 py-3 bg-white text-black font-semibold shadow-lg hover:bg-primary hover:text-white transition-all duration-200 transform hover:scale-105">
              Ver productos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 