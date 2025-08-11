import { buildStrapiUrl, getStrapiHeaders, getStrapiMediaUrl } from "@/lib/strapi";
import { GlobalHeader } from "@/types/header";
import { RenderLink } from "@/components/ui/render-link";
import Link from "next/link";
import Image from "next/image";

export async function Header() {
  try {
    // Fetch header data from Strapi
    const url = buildStrapiUrl("/global", {
      "populate[Header][populate][logo]": "true",
      "populate[Header][populate][links][filters][isActive][$eq]": "true"
    });
    
    const response = await fetch(url, {
      method: "GET",
      headers: getStrapiHeaders(),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const headerData: GlobalHeader = data.data;

    if (!headerData?.Header) {
      throw new Error("Header data not found");
    }

    const { logo, links } = headerData.Header;

    return (
      <header className="bg-white border-b border-default sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                {logo && (
                  <Image
                    src={getStrapiMediaUrl(logo.formats?.thumbnail?.url || logo.url)}
                    alt={logo.alternativeText || "Logo"}
                    width={40}
                    height={40}
                    className="h-10 w-auto"
                  />
                )}
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {links?.map((link) => (
                <RenderLink
                  key={link.id}
                  link={link}
                  className="text-sm"
                />
              ))}
            </nav>

            {/* Mobile menu button placeholder - can be expanded later */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-muted hover:text-primary"
                aria-label="Open menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    );

  } catch (error) {
    console.error("Error fetching header data:", error);
    
    // Return a minimal header as fallback
    return (
      <header className="bg-white border-b border-default sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-primary">
                Marketplace
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium text-muted hover:text-primary">
                Home
              </Link>
              <Link href="/products" className="text-sm font-medium text-muted hover:text-primary">
                Products
              </Link>
            </nav>
          </div>
        </div>
      </header>
    );
  }
} 