import { useGetHomePage } from "@/hooks/use-api-server";
import { use } from "react";
import { HomeBanner } from "./home-banner";
import { PrincipalBanner } from "@/types/principal-banner";

export function HomeBannerServer() {
  const getHomePage = useGetHomePage();
  const homePageData = use(getHomePage());

  // Extract the PrincipalBanner from the response
  const banner: PrincipalBanner = homePageData?.data?.PrincipalBanner || {
    id: 1,
    title: "Bienvenido al Marketplace",
    description: "Encuentra las mejores cámaras de seguridad y productos para tu hogar o negocio.",
    buttonLink: "/products",
  };

  return <HomeBanner banner={banner} />;
} 