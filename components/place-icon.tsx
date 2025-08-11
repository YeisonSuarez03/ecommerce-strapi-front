import { Home, Building2, Store, TreePine } from "lucide-react"

interface PlaceIconProps {
  place: string
  className?: string
}

export function PlaceIcon({ place, className = "h-4 w-4" }: PlaceIconProps) {
  const getIcon = (place: string) => {
    switch (place.toLowerCase()) {
      case "casas":
        return <Home className={className} />
      case "apartamentos":
        return <Building2 className={className} />
      case "negocios":
        return <Store className={className} />
      case "fincas":
        return <TreePine className={className} />
      default:
        return <Home className={className} />
    }
  }

  return getIcon(place)
}
