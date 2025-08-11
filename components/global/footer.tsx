import { buildStrapiUrl, getStrapiHeaders, getStrapiMediaUrl } from "@/lib/strapi";
import { GlobalFooter } from "@/types/header";
import { RenderLink } from "@/components/ui/render-link";
import Link from "next/link";
import Image from "next/image";

export async function Footer() {
  try {
    // Fetch footer data from Strapi
    const url = buildStrapiUrl("/global", {
      "populate[Footer][populate][logo]": "true",
      "populate[Footer][populate][links][filters][isActive][$eq]": "true"
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
    const footerData: GlobalFooter = data.data;

    if (!footerData?.Footer) {
      throw new Error("Footer data not found");
    }

    const { logo, links, text } = footerData.Footer;

    return (
      <footer className="w-full bg-gray-800 border-t border-default mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            {/* Logo */}
            <div className="flex-shrink-0 mb-4 md:mb-0">
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
            <nav className="flex flex-wrap gap-6 justify-center md:justify-end">
              {links?.map((link) => (
                <RenderLink
                  key={link.id}
                  link={link}
                  className="text-sm font-medium"
                  activeClassName="text-primary font-medium"
                  inactiveClassName="text-muted hover:text-primary transition-colors"
                />
              ))}
            </nav>
          </div>

          {/* Footer text */}
          {text && (
            <div className="text-center pt-6 border-t border-default">
              <p className="text-sm text-white/50">{text}</p>
            </div>
          )}
        </div>
      </footer>
    );

  } catch (error) {
    console.error("Error fetching footer data:", error);
    
    // Return a minimal footer as fallback
    return (
      <footer className="w-full bg-gray-800 border-t border-default mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold text-primary">
              Marketplace
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/products" className="hover:underline">Products</Link>
          </div>
          <div className="text-center mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
} 