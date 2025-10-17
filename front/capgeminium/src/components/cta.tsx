import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTA() {
    return (
        <section className="py-20 lg:py-32">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-12 lg:p-20 shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-50" />


                    <div className="relative max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-6 animate-float">
                            <Sparkles className="w-8 h-8 text-primary-foreground" />
                        </div>

                        <h2 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 text-balance leading-tight">
                            Prêt à dominer le classement ?
                        </h2>
                        <p className="text-lg lg:text-xl text-primary-foreground/90 mb-10 text-pretty leading-relaxed max-w-2xl mx-auto">
                            Rejoignez la communauté Ynov Babyfoot dès aujourd'hui et commencez votre ascension vers le sommet.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="text-base px-10 h-14 group shadow-xl hover:shadow-2xl transition-all font-semibold"
                            >
                                Créer mon compte
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-base px-10 h-14 bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 backdrop-blur-sm transition-all font-semibold"
                            >
                                En savoir plus
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
