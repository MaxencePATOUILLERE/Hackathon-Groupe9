"use client";

import { useEffect, useMemo, useState } from "react";
import { Table2, Users, CheckCircle, Clock } from "lucide-react";

type APITable = {
    table_id: string;            // "T01"
    name?: string;               // l’API renvoie "name"
    location?: string | null;    // si tu l’ajoutes plus tard
    status: "available" | "in_use" | "maintenance";
    condition_state?: string | null;
};

type APIGame = {
    id: string;
    table: string;               // "T01"
    duration_seconds?: number | null;
};

type APIPlayer = {
    id?: string;
    player_id?: string;
    name: string;
};

type BabyfootVM = {
    id: string;
    name: string;                       // <-- unifié sur "name"
    etat: "disponible" | "occupé" | "maintenance";
    localisation: string;
    tempsUtilisationTotal: number;      // minutes cumulées (approx)
    nombreParties: number;
    condition?: string | null;
};

const BASE =
    process.env.NEXT_PUBLIC_API_BASE ??
    process.env.API_BASE ??
    "http://127.0.0.1:8000/api";

async function fetchList<T>(path: string): Promise<T[]> {
    try {
        const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
        if (!res.ok) return [];
        const data = await res.json();
        // DEBUG
        console.log(`GET ${path}`, Array.isArray(data) ? data.length : data);
        if (Array.isArray(data)) return data as T[];
        if (data?.results && Array.isArray(data.results)) return data.results as T[];
        return [];
    } catch (e) {
        console.warn("fetchList error:", path, e);
        return [];
    }
}

function mapStatusToFr(status: APITable["status"]): BabyfootVM["etat"] {
    switch (status) {
        case "available":
            return "disponible";
        case "in_use":
            return "occupé";
        default:
            return "maintenance";
    }
}

export default function AdminDashboard() {
    const [tables, setTables] = useState<APITable[]>([]);
    const [games, setGames] = useState<APIGame[]>([]);
    const [players, setPlayers] = useState<APIPlayer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const [t, g, p] = await Promise.all([
                fetchList<APITable>("/foosball-tables/"),
                fetchList<APIGame>("/games/"),
                fetchList<APIPlayer>("/players/"),
            ]);
            setTables(t);
            setGames(g);
            setPlayers(p);
            setLoading(false);
        })();
    }, []);

    // Vue modèle pour l’affichage
    const babyfoots: BabyfootVM[] = useMemo(() => {
        if (!tables || tables.length === 0) return [];

        // indexer les games par table
        const byTable = new Map<string, APIGame[]>();
        for (const g of games ?? []) {
            if (!byTable.has(g.table)) byTable.set(g.table, []);
            byTable.get(g.table)!.push(g);
        }

        return tables.map((t) => {
            const gForTable = byTable.get(t.table_id) ?? [];
            const nombreParties = gForTable.length;
            const seconds = gForTable.reduce((acc, g) => acc + (g.duration_seconds ?? 0), 0);
            const minutes = Math.floor(seconds / 60);

            const tableNumber = t.table_id.replace(/^T0*/, "");
            const fallback = `Table ${tableNumber}`;

            return {
                id: t.table_id,
                name: t.name ?? fallback,                              // <-- unifié
                etat: mapStatusToFr(t.status),
                localisation: t.location ?? t.name ?? fallback,
                tempsUtilisationTotal: minutes,
                nombreParties,
                condition: t.condition_state ?? null,
            };
        });
    }, [tables, games]);

    const stats = useMemo(() => {
        const totalBabyfoots = babyfoots.length;
        const disponibles = babyfoots.filter((b) => b.etat === "disponible").length;
        const occupes = babyfoots.filter((b) => b.etat === "occupé").length;
        const maintenance = babyfoots.filter((b) => b.etat === "maintenance").length;
        const totalUsers = players.length;
        const totalParties = babyfoots.reduce((acc, b) => acc + b.nombreParties, 0);
        return { totalBabyfoots, disponibles, occupes, maintenance, totalUsers, totalParties };
    }, [babyfoots, players]);

    const getEtatColor = (etat: BabyfootVM["etat"]) => {
        switch (etat) {
            case "disponible":
                return "bg-green-100 text-green-800";
            case "occupé":
                return "bg-red-100 text-red-800";
            case "maintenance":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getEtatIcon = (etat: BabyfootVM["etat"]) => {
        switch (etat) {
            case "disponible":
                return <CheckCircle className="w-4 h-4" />;
            case "occupé":
            case "maintenance":
                return <Clock className="w-4 h-4" />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Vue d&apos;ensemble</h2>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Babyfoots</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {loading ? "—" : stats.totalBabyfoots}
                            </p>
                        </div>
                        <Table2 className="w-12 h-12 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Disponibles</p>
                            <p className="text-3xl font-bold text-green-600">
                                {loading ? "—" : stats.disponibles}
                            </p>
                        </div>
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Utilisateurs</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {loading ? "—" : stats.totalUsers}
                            </p>
                        </div>
                        <Users className="w-12 h-12 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Parties Totales</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {loading ? "—" : stats.totalParties}
                            </p>
                        </div>
                        <Clock className="w-12 h-12 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Babyfoots Overview */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">État des Babyfoots</h3>
                {loading ? (
                    <p className="text-gray-500">Chargement…</p>
                ) : babyfoots.length === 0 ? (
                    <p className="text-gray-500">Aucune table trouvée.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {babyfoots.map((b) => (
                            <div key={b.id} className="border rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-gray-800">{b.name}</h4>
                                    <span
                                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getEtatColor(
                                            b.etat
                                        )}`}
                                    >
                    {getEtatIcon(b.etat)}
                                        {b.etat}
                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{b.localisation}</p>
                                <div className="text-sm text-gray-500">
                                    <p>{b.nombreParties} parties</p>
                                    <p>
                                        {Math.floor(b.tempsUtilisationTotal / 60)}h{" "}
                                        {b.tempsUtilisationTotal % 60}min d&apos;utilisation
                                    </p>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span className="inline-flex items-center gap-2">
                    <span
                        className={`h-2 w-2 rounded-full ${
                            b.etat === "disponible"
                                ? "bg-green-500"
                                : b.etat === "occupé"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                        }`}
                    />
                    <span className="truncate max-w-[10rem]" title={b.name}>
                      {b.name}
                    </span>
                  </span>
                                    {b.condition ? (
                                        <span
                                            className="px-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-200"
                                            title={b.condition}
                                        >
                      {b.condition}
                    </span>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}