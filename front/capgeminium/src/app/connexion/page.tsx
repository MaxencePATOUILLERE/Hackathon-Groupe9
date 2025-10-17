import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy } from "lucide-react"
import Link from "next/link"

export default function ConnexionPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                            <Trophy className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <span className="text-3xl font-bold text-foreground">
              Ynov{" "}
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Babyfoot</span>
            </span>
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Connexion</h1>
                    <p className="text-muted-foreground">Connectez-vous pour accéder à votre compte</p>
                </div>

                <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-semibold text-foreground">
                                Nom d'utilisateur
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Entrez votre nom d'utilisateur"
                                className="h-12 bg-background border-border focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                                Mot de passe
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Entrez votre mot de passe"
                                className="h-12 bg-background border-border focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                <span className="text-muted-foreground">Se souvenir de moi</span>
                            </label>
                            <a href="#" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                                Mot de passe oublié ?
                            </a>
                        </div>

                        <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25">
                            Se connecter
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Pas encore de compte ?{" "}
                            <a href="#" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                                Créer un compte
                            </a>
                        </p>
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    En vous connectant, vous acceptez nos{" "}
                    <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                        conditions d'utilisation
                    </a>
                </p>
            </div>
        </div>
    )
}
