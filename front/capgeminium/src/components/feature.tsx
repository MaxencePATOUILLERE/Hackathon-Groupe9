import { Calendar, Radio, Trophy, Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
    {
        icon: Calendar,
        title: "Réservation intelligente",
        description:
            "Réservez votre table en quelques clics. Consultez la disponibilité en temps réel et ne perdez plus de temps à attendre.",
        gradient: "from-primary/20 via-accent/15 to-warning/10",
        iconBg: "bg-gradient-to-br from-primary via-accent to-warning",
        borderColor: "hover:border-primary/60",
        shadowColor: "hover:shadow-primary/20",
    },
    {
        icon: Radio,
        title: "Suivi en direct",
        description:
            "Suivez toutes les parties en cours sur le campus. Scores en temps réel, statistiques détaillées et replays des meilleurs moments.",
        gradient: "from-secondary/20 via-cyan/15 to-purple/10",
        iconBg: "bg-gradient-to-br from-secondary via-cyan to-purple",
        borderColor: "hover:border-secondary/60",
        shadowColor: "hover:shadow-secondary/20",
    },

    {
        icon: Settings,
        title: "Gestion simplifiée",
        description:
            "Interface d'administration complète pour gérer l'état des tables, la maintenance et les réservations.",
        gradient: "from-purple/20 via-secondary/15 to-cyan/10",
        iconBg: "bg-gradient-to-br from-purple via-secondary to-cyan",
        borderColor: "hover:border-purple/60",
        shadowColor: "hover:shadow-purple/20",
    },
]

export function Features() {
    return (
        <section id="features" className="py-20 lg:py-32 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple/10 via-secondary/5 to-background" />

            <div className="container mx-auto px-4 lg:px-8 relative">
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
                    <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                        Tout ce dont vous avez besoin
                    </h2>
                    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                        Une plateforme complète pour moderniser l'expérience babyfoot à Ynov Toulouse
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className={`border-2 border-border/50 ${feature.borderColor} transition-all duration-300 group hover:shadow-2xl ${feature.shadowColor} bg-card/50 backdrop-blur-sm overflow-hidden relative`}
                        >
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                            />

                            <CardContent className="p-8 lg:p-10 relative">
                                <div
                                    className={`flex items-center justify-center w-16 h-16 rounded-2xl ${feature.iconBg} group-hover:scale-110 transition-transform duration-300 mb-6 shadow-xl text-white`}
                                >
                                    <feature.icon className="w-8 h-8" />
                                </div>

                                <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
