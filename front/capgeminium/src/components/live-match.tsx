import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp } from "lucide-react"

const liveMatches = [
    {
        table: "Table 1",
        team1: { players: ["Thomas", "Marie"], score: 8 },
        team2: { players: ["Lucas", "Sophie"], score: 6 },
        duration: "12:34",
        trending: true,
        accentColor: "primary",
        gradientFrom: "from-primary/10",
        gradientTo: "to-accent/10",
    },
    {
        table: "Table 3",
        team1: { players: ["Alexandre", "Emma"], score: 5 },
        team2: { players: ["Hugo", "Léa"], score: 5 },
        duration: "08:15",
        trending: false,
        accentColor: "secondary",
        gradientFrom: "from-secondary/10",
        gradientTo: "to-purple/10",
    },
    {
        table: "Table 5",
        team1: { players: ["Maxime", "Chloé"], score: 9 },
        team2: { players: ["Antoine", "Julie"], score: 4 },
        duration: "15:42",
        trending: true,
        accentColor: "success",
        gradientFrom: "from-success/10",
        gradientTo: "to-cyan/10",
    },
]

export function LiveMatches() {
    return (
        <section id="live" className="py-20 lg:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/10 via-purple/5 to-transparent" />

            <div className="container mx-auto px-4 lg:px-8 relative">
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-success/20 via-cyan/15 to-secondary/20 border-2 border-success/30 mb-8 backdrop-blur-sm shadow-lg shadow-success/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success animate-glow"></span>
            </span>
                        <span className="text-sm font-semibold text-foreground">En direct</span>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
                        Parties en cours
                    </h2>
                    <p className="text-lg lg:text-xl text-muted-foreground text-pretty leading-relaxed">
                        Suivez l'action en temps réel sur toutes les tables du campus
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {liveMatches.map((match, index) => (
                        <Card
                            key={index}
                            className={`border-2 border-border/50 hover:border-${match.accentColor}/60 transition-all duration-300 group hover:shadow-2xl hover:shadow-${match.accentColor}/20 bg-card/80 backdrop-blur-sm relative overflow-hidden`}
                        >
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${match.gradientFrom} ${match.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                            />

                            <CardHeader className="pb-3 relative">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base lg:text-lg font-bold flex items-center gap-2">
                                        {match.table}
                                        {match.trending && <TrendingUp className={`w-4 h-4 text-${match.accentColor} animate-pulse`} />}
                                    </CardTitle>
                                    <Badge
                                        variant="secondary"
                                        className={`bg-${match.accentColor}/15 text-${match.accentColor} border-2 border-${match.accentColor}/30 font-semibold shadow-sm`}
                                    >
                                        <Clock className="w-3 h-3 mr-1" />
                                        {match.duration}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="space-y-3">
                                    <div
                                        className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-${match.accentColor}/20 to-${match.accentColor}/10 border-2 border-${match.accentColor}/30 group-hover:border-${match.accentColor}/50 transition-colors shadow-sm`}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-foreground text-base">{match.team1.players[0]}</span>
                                            <span className="font-semibold text-foreground text-base">{match.team1.players[1]}</span>
                                        </div>
                                        <span className={`text-3xl font-bold text-${match.accentColor}`}>{match.team1.score}</span>
                                    </div>
                                    <div className="flex items-center justify-center py-1">
                    <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                      VS
                    </span>
                                    </div>
                                    <div
                                        className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/80 to-muted/50 border-2 border-border/50 group-hover:border-${match.accentColor}/30 transition-colors shadow-sm`}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-foreground text-base">{match.team2.players[0]}</span>
                                            <span className="font-semibold text-foreground text-base">{match.team2.players[1]}</span>
                                        </div>
                                        <span className="text-3xl font-bold text-muted-foreground">{match.team2.score}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
