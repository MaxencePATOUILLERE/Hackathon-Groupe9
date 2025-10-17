import { Users, Trophy, Zap, Target } from "lucide-react"

const stats = [
    {
        icon: Users,
        value: "500+",
        label: "Joueurs actifs",
        color: "text-primary",
        bgColor: "bg-gradient-to-br from-primary/20 to-accent/20",
        glowColor: "group-hover:shadow-primary/40",
    },
    {
        icon: Trophy,
        value: "24",
        label: "Tournois organisés",
        color: "text-warning",
        bgColor: "bg-gradient-to-br from-warning/20 to-accent/20",
        glowColor: "group-hover:shadow-warning/40",
    },
    {
        icon: Zap,
        value: "1,200+",
        label: "Parties jouées",
        color: "text-secondary",
        bgColor: "bg-gradient-to-br from-secondary/20 to-cyan/20",
        glowColor: "group-hover:shadow-secondary/40",
    },
    {
        icon: Target,
        value: "8",
        label: "Tables disponibles",
        color: "text-success",
        bgColor: "bg-gradient-to-br from-success/20 to-cyan/20",
        glowColor: "group-hover:shadow-success/40",
        // </CHANGE>
    },
]

export function Stats() {
    return (
        <section className="py-20 lg:py-24 border-y border-border/50 bg-gradient-to-b from-muted/50 via-muted/30 to-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-purple/5 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-secondary/10 via-cyan/5 to-transparent" />
            {/* </CHANGE> */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

            <div className="container mx-auto px-4 lg:px-8 relative">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div
                                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.bgColor} mb-5 group-hover:scale-110 transition-all duration-300 shadow-lg ${stat.glowColor}`}
                            >
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            </div>
                            {/* </CHANGE> */}
                            <div
                                className={`text-4xl lg:text-5xl font-bold text-foreground mb-3 group-hover:bg-gradient-to-r ${stat.color === "text-primary" ? "group-hover:from-primary group-hover:to-accent" : stat.color === "text-warning" ? "group-hover:from-warning group-hover:to-accent" : stat.color === "text-secondary" ? "group-hover:from-secondary group-hover:to-cyan" : "group-hover:from-success group-hover:to-cyan"} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}
                            >
                                {stat.value}
                            </div>
                            {/* </CHANGE> */}
                            <div className="text-sm lg:text-base font-medium text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
