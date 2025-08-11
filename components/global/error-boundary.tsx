"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="bg-white border-b border-default py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-main mb-2">Error al cargar el contenido</h3>
              <p className="text-muted mb-4">
                Hubo un problema al cargar esta sección. Por favor, intenta recargar la página.
              </p>
              <Button onClick={() => window.location.reload()} variant="outline" className="btn-outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Recargar página
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
