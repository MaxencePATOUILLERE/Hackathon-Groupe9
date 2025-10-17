import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

export function Header() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                            <Trophy className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl lg:text-2xl font-bold text-foreground">
              Ynov <span className="text-primary">Babyfoot</span>
            </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a
                            href="#features"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Accueil
                        </a>
                        <a
                            href="#live"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Parties en direct
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/connexion" passHref>
                            <Button variant="ghost" className="hidden md:inline-flex">
                                Connexion
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
