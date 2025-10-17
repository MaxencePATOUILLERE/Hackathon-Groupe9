// src/components/live-matches.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp } from "lucide-react"

const BASE =
    process.env.NEXT_PUBLIC_API_BASE ??
    process.env.API_BASE ??
    "http://127.0.0.1:8000/api"

type Game = {
    id: string
    table: string
    game_date?: string
    duration_seconds?: number | null
    score_red: number
    score_blue: number
}

type Performance = {
    id: number
    game: string
    player: string
    team_color: string
    role: string
    created_at?: string
}

type Player = { id?: string; player_id?: string; name: string }

// -------- utils fetch -------------------------------------------------------
async function fetchList<T>(path: string): Promise<T[]> {
    const res = await fetch(`${BASE}${path}`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    if (Array.isArray(data)) return data as T[]
    if (data?.results && Array.isArray(data.results)) return data.results as T[]
    return []
}

function formatDuration(from?: string, explicitSeconds?: number | null) {
    let secs = explicitSeconds ?? null
    if (secs == null && from) {
        const start = new Date(from).getTime()
        const now = Date.now()
        secs = Math.max(0, Math.floor((now - start) / 1000))
    }
    const m = Math.floor((secs ?? 0) / 60)
    const s = (secs ?? 0) % 60
    return `${`${m}`.padStart(2, "0")}:${`${s}`.padStart(2, "0")}`
}

function normalizeColor(c?: string): "Red" | "Blue" {
    const v = (c ?? "").toLowerCase()
    return v === "red" ? "Red" : "Blue"
}
function normalizeRole(r?: string): "attack" | "defense" {
    const v = (r ?? "").toLowerCase()
    return v === "atk" || v === "attack" ? "attack" : "defense"
}
function prettyTableName(raw?: string, fallbackIndex?: number) {
    if (!raw) return `Table ${fallbackIndex ?? ""}`.trim()
    const m = raw.match(/^t0*?(\d+)$/i)
    return m ? `Table ${m[1]}` : raw
}

// -------- couleurs Tailwind safelistées ------------------------------------
const colorSets = {
    primary: {
        icon: "text-primary",
        badgeBg: "bg-primary/15",
        badgeBorder: "border-primary/30",
        badgeText: "text-primary",
        cardHover: "hover:border-primary/60 hover:shadow-primary/20",
        gradFrom: "from-primary/10",
        gradTo: "to-accent/10",
        rowBorder: "border-primary/30 group-hover:border-primary/50",
        rowFrom: "from-primary/20",
        rowTo: "to-primary/10",
        score: "text-primary",
    },
    secondary: {
        icon: "text-secondary",
        badgeBg: "bg-secondary/15",
        badgeBorder: "border-secondary/30",
        badgeText: "text-secondary",
        cardHover: "hover:border-secondary/60 hover:shadow-secondary/20",
        gradFrom: "from-secondary/10",
        gradTo: "to-purple/10",
        rowBorder: "border-secondary/30 group-hover:border-secondary/50",
        rowFrom: "from-secondary/20",
        rowTo: "to-secondary/10",
        score: "text-secondary",
    },
    success: {
        icon: "text-success",
        badgeBg: "bg-success/15",
        badgeBorder: "border-success/30",
        badgeText: "text-success",
        cardHover: "hover:border-success/60 hover:shadow-success/20",
        gradFrom: "from-success/10",
        gradTo: "to-cyan/10",
        rowBorder: "border-success/30 group-hover:border-success/50",
        rowFrom: "from-success/20",
        rowTo: "to-success/10",
        score: "text-success",
    },
} as const
type AccentKey = keyof typeof colorSets
const pickAccent = (i: number): AccentKey =>
    (["primary", "secondary", "success"] as const)[i % 3]

// -------- composant ---------------------------------------------------------
export async function LiveMatches() {
    // A) on prend les 3 derniers matchs **à partir des performances**
    const perfsAll = await fetchList<Performance>("/performances/")
    const perfsSorted = perfsAll
        .slice()
        .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())

    const topGameIds = Array.from(new Set(perfsSorted.map(p => p.game))).slice(0, 3)

    if (!topGameIds.length) {
        return (
            <section id="live" className="py-20 lg:py-32">
                <div className="container mx-auto px-4 lg:px-8">
                    <h2 className="text-2xl font-semibold mb-4">Parties en cours</h2>
                    <p className="text-muted-foreground">Aucune performance disponible.</p>
                </div>
            </section>
        )
    }

    // B) on récupère tous les games et on filtre sur nos 3 ids (évite 3 calls)
    const allGames = await fetchList<Game>("/games/")
    const games = topGameIds.map(id => allGames.find(g => g.id === id)).filter(Boolean) as Game[]

    // C) groupage des perfs par game + normalisation
    const perfByGame = new Map<string, Performance[]>()
    topGameIds.forEach(id => perfByGame.set(id, []))
    perfsSorted.forEach(p => {
        if (perfByGame.has(p.game)) perfByGame.get(p.game)!.push({
            ...p,
            team_color: normalizeColor(p.team_color),
            role: normalizeRole(p.role),
        })
    })

    // D) map joueurId -> nom (robuste)
    const playerIds = Array.from(new Set(perfsSorted.filter(p => topGameIds.includes(p.game)).map(p => p.player)))
    const playersList = playerIds.length ? await fetchList<Player>("/players/") : []
    const nameById = new Map<string, string>()
    playersList.forEach((pl) => {
      const pid = pl.player_id ?? pl.id
      if (pid) nameById.set(pid, pl.name)
    })

    function displayName(playerId?: string) {
      if (!playerId) return "—"
      return nameById.get(playerId) ?? playerId
    }

    // E) cartes
    const cards = games.map((g, idx) => {
        const perfs = perfByGame.get(g.id) ?? []
        const teamRed = perfs.filter(p => p.team_color === "Red").slice(0, 2)
        const teamBlue = perfs.filter(p => p.team_color === "Blue").slice(0, 2)
        const diff = Math.abs((g.score_red ?? 0) - (g.score_blue ?? 0))
        const trending = diff <= 2
        const accent = pickAccent(idx)
        const C = colorSets[accent]

        return {
            table: prettyTableName(g.table, idx + 1),
            team1: { players: teamRed.map(p => displayName(p.player)), score: g.score_red ?? 0 },
            team2: { players: teamBlue.map(p => displayName(p.player)), score: g.score_blue ?? 0 },
            duration: formatDuration(g.game_date, g.duration_seconds),
            trending,
            colors: C,
        }
    })

    return (
        <section id="live" className="py-20 lg:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/10 via-purple/5 to-transparent" />

            <div className="container mx-auto px-4 lg:px-8 relative">
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-success/20 via-cyan/15 to-secondary/20 border-2 border-success/30 mb-8 backdrop-blur-sm shadow-lg shadow-success/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success animate-glow" />
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
                    {cards.map((m, i) => (
                        <Card
                            key={i}
                            className={`border-2 border-border/50 ${m.colors.cardHover} transition-all duration-300 group hover:shadow-2xl bg-card/80 backdrop-blur-sm relative overflow-hidden`}
                        >
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${m.colors.gradFrom} ${m.colors.gradTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                            />
                            <CardHeader className="pb-3 relative">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base lg:text-lg font-bold flex items-center gap-2">
                                        {m.table}
                                        {m.trending && <TrendingUp className={`w-4 h-4 ${m.colors.icon} animate-pulse`} />}
                                    </CardTitle>
                                    <Badge
                                        variant="secondary"
                                        className={`${m.colors.badgeBg} ${m.colors.badgeText} border-2 ${m.colors.badgeBorder} font-semibold shadow-sm`}
                                    >
                                        <Clock className="w-3 h-3 mr-1" />
                                        {m.duration}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="space-y-3">
                                    <div
                                        className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${m.colors.rowFrom} ${m.colors.rowTo} border-2 ${m.colors.rowBorder} transition-colors shadow-sm`}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-foreground text-base">{m.team1.players[0] ?? "—"}</span>
                                            <span className="font-semibold text-foreground text-base">{m.team1.players[1] ?? "—"}</span>
                                        </div>
                                        <span className={`text-3xl font-bold ${m.colors.score}`}>{m.team1.score}</span>
                                    </div>

                                    <div className="flex items-center justify-center py-1">
                    <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                      VS
                    </span>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/80 to-muted/50 border-2 border-border/50 transition-colors shadow-sm">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-foreground text-base">{m.team2.players[0] ?? "—"}</span>
                                            <span className="font-semibold text-foreground text-base">{m.team2.players[1] ?? "—"}</span>
                                        </div>
                                        <span className="text-3xl font-bold text-muted-foreground">{m.team2.score}</span>
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