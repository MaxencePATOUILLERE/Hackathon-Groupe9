"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle, Clock, X } from "lucide-react";

// --- Types API ---
type APITable = {
    table_id: string;
    name: string;
    status: "available" | "in_use" | "maintenance";
    condition_state?: string | null;
};

type APIGame = {
    id: string;
    table: string;                 // ex: "T09"
    duration_seconds?: number|null;
};

// --- VM côté UI (on garde tes noms FR) ---
interface Babyfoot {
    id: string;                    // table_id
    nom: string;                   // name
    etat: "disponible" | "occupé" | "maintenance";
    localisation: string;          // UI only (non stocké côté API)
    tempsUtilisationTotal: number; // minutes
    nombreParties: number;
    condition?: string | null;     // condition_state
}

const BASE =
    process.env.NEXT_PUBLIC_API_BASE ??
    process.env.API_BASE ??
    "http://127.0.0.1:8000/api";

// --- Helpers mapping statut ---
function etatToApi(e: Babyfoot["etat"]): APITable["status"] {
    switch (e) {
        case "disponible": return "available";
        case "occupé":     return "in_use";
        default:           return "maintenance";
    }
}
function apiToEtat(s: APITable["status"]): Babyfoot["etat"] {
    switch (s) {
        case "available":  return "disponible";
        case "in_use":     return "occupé";
        default:           return "maintenance";
    }
}

// --- HTTP helpers ---
async function getJSON<T>(path: string): Promise<T> {
    const r = await fetch(`${BASE}${path}`, { cache: "no-store" });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
}
async function postJSON<T>(path: string, body: any): Promise<T> {
    const r = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
}
async function patchJSON<T>(path: string, body: any): Promise<T> {
    const r = await fetch(`${BASE}${path}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
}
async function deleteReq(path: string): Promise<void> {
    const r = await fetch(`${BASE}${path}`, { method: "DELETE" });
    if (!r.ok && r.status !== 204) throw new Error(`${r.status} ${r.statusText}`);
}

// --- Composant ---
export default function BabyfootsPage() {
    const [tablesApi, setTablesApi] = useState<APITable[]>([]);
    const [games, setGames] = useState<APIGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // UI states (modal + form)
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<{
        table_id: string;
        nom: string;
        etat: Babyfoot["etat"];
        localisation: string;
        condition: string;
    }>({ table_id: "", nom: "", etat: "disponible", localisation: "", condition: "" });

    // Load data
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErrorMsg(null);
                const [t, g] = await Promise.all([
                    getJSON<APITable[]>("/foosball-tables/"),
                    getJSON<APIGame[]>("/games/"),
                ]);
                setTablesApi(t);
                setGames(g);
            } catch (e: any) {
                setErrorMsg(e?.message ?? "Erreur de chargement");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Build VM list (avec calcul parties/temps)
    const babyfoots: Babyfoot[] = useMemo(() => {
        const byTable = new Map<string, APIGame[]>();
        for (const g of games) {
            if (!byTable.has(g.table)) byTable.set(g.table, []);
            byTable.get(g.table)!.push(g);
        }
        return tablesApi.map((t) => {
            const gFor = byTable.get(t.table_id) ?? [];
            const minutes = Math.floor(
                gFor.reduce((acc, g) => acc + (g.duration_seconds ?? 0), 0) / 60
            );
            return {
                id: t.table_id,
                nom: t.name,
                etat: apiToEtat(t.status),
                localisation: t.name, // l’API n’a pas “location”, on réutilise le nom pour l’UI
                tempsUtilisationTotal: minutes,
                nombreParties: gFor.length,
                condition: t.condition_state ?? null,
            };
        });
    }, [tablesApi, games]);

    // Helpers UI
    const getEtatColor = (etat: string) => {
        switch (etat) {
            case "disponible": return "bg-green-100 text-green-800";
            case "occupé":     return "bg-red-100 text-red-800";
            case "maintenance":return "bg-yellow-100 text-yellow-800";
            default:           return "bg-gray-100 text-gray-800";
        }
    };
    const getEtatIcon = (etat: string) => {
        switch (etat) {
            case "disponible": return <CheckCircle className="w-4 h-4" />;
            case "occupé":     return <Clock className="w-4 h-4" />;
            case "maintenance":return <AlertCircle className="w-4 h-4" />;
            default:           return null;
        }
    };

    // Modal open
    const openModal = (item?: Babyfoot) => {
        if (item) {
            setEditingId(item.id);
            setFormData({
                table_id: item.id,
                nom: item.nom,
                etat: item.etat,
                localisation: item.localisation ?? "",
                condition: item.condition ?? "",
            });
        } else {
            // auto-id : next Txx
            const ids = tablesApi.map(t => t.table_id).sort();
            const nums = ids.map(id => parseInt(id.replace(/^T/, ""), 10)).filter(n => !isNaN(n));
            const nextNum = (nums.length ? Math.max(...nums) : 0) + 1;
            const nextId = `T${String(nextNum).padStart(2, "0")}`;

            setEditingId(null);
            setFormData({
                table_id: nextId,
                nom: "",
                etat: "disponible",
                localisation: "",
                condition: "",
            });
        }
        setShowModal(true);
    };

    // Create/Update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        try {
            if (editingId) {
                // UPDATE
                const payload: Partial<APITable> = {
                    name: formData.nom,
                    status: etatToApi(formData.etat),
                    condition_state: formData.condition || null,
                };
                const updated = await patchJSON<APITable>(`/foosball-tables/${encodeURIComponent(editingId)}/`, payload);
                setTablesApi(prev => prev.map(t => t.table_id === editingId ? updated : t));
            } else {
                // CREATE
                const payload: APITable = {
                    table_id: formData.table_id,
                    name: formData.nom,
                    status: etatToApi(formData.etat),
                    condition_state: formData.condition || null,
                };
                const created = await postJSON<APITable>("/foosball-tables/", payload);
                setTablesApi(prev => [created, ...prev]);
            }
            setShowModal(false);
            setEditingId(null);
        } catch (e: any) {
            setErrorMsg(e?.message ?? "Erreur lors de l’enregistrement");
        }
    };

    // Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce babyfoot ?")) return;
        setErrorMsg(null);
        try {
            await deleteReq(`/foosball-tables/${encodeURIComponent(id)}/`);
            setTablesApi(prev => prev.filter(t => t.table_id !== id));
        } catch (e: any) {
            setErrorMsg(e?.message ?? "Suppression impossible");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Gestion des Babyfoots</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter
                </button>
            </div>

            {errorMsg && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 text-red-700 px-4 py-2">
                    {errorMsg}
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">État</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parties</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {loading ? (
                        <tr><td className="px-6 py-6 text-gray-500" colSpan={8}>Chargement…</td></tr>
                    ) : babyfoots.length === 0 ? (
                        <tr><td className="px-6 py-6 text-gray-500" colSpan={8}>Aucune table.</td></tr>
                    ) : (
                        babyfoots.map(b => (
                            <tr key={b.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-600">{b.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{b.nom}</td>
                                <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getEtatColor(b.etat)}`}>
                      {getEtatIcon(b.etat)}
                        {b.etat}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{b.localisation}</td>
                                <td className="px-6 py-4 text-gray-600">{b.condition ?? "—"}</td>
                                <td className="px-6 py-4 text-gray-600">{b.nombreParties}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {Math.floor(b.tempsUtilisationTotal / 60)}h {b.tempsUtilisationTotal % 60}min
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(b)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingId ? "Modifier" : "Ajouter"} un Babyfoot</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Identifiant (ex: T31) *</label>
                                <input
                                    type="text"
                                    name="table_id"
                                    value={formData.table_id}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!!editingId}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du Babyfoot *</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Babyfoot de Cafeteria"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">État *</label>
                                <select
                                    name="etat"
                                    value={formData.etat}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="disponible">Disponible</option>
                                    <option value="occupé">Occupé</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Condition (optionnel)
                                </label>
                                <input
                                    type="text"
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="ex: scratched / new / missing screw…"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation (UI)</label>
                                <input
                                    type="text"
                                    name="localisation"
                                    value={formData.localisation}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Salle 1 (non stocké côté API)"
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    {editingId ? "Modifier" : "Ajouter"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}