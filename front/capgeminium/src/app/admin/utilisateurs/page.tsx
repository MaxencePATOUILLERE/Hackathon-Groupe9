"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

type APIPlayer = {
    id: string;                 // ex: "P0001"
    name: string;               // ex: "Casey Philippe"
    age: number;                // ex: 21
    email: string;              // ex: "casey@exemple.com"
    role: "utilisateur" | "administrateur";
    date_inscription: string;   // "YYYY-MM-DD"
};

const BASE =
    process.env.NEXT_PUBLIC_API_BASE ??
    process.env.API_BASE ??
    "http://127.0.0.1:8000/api";

// ------- helpers HTTP -------
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
async function del(path: string) {
    const r = await fetch(`${BASE}${path}`, { method: "DELETE" });
    if (!r.ok && r.status !== 204) throw new Error(`${r.status} ${r.statusText}`);
}

// ---------------------------------------------------------
export default function UtilisateursPage() {
    const [players, setPlayers] = useState<APIPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState<APIPlayer>({
        id: "",
        name: "",
        age: 18,
        email: "",
        role: "utilisateur",
        date_inscription: new Date().toISOString().slice(0, 10),
    });

    // charge la liste
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErrorMsg(null);
                const data = await getJSON<APIPlayer[]>("/players/");
                setPlayers(data);
            } catch (e: any) {
                setErrorMsg(e?.message ?? "Erreur de chargement");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ouvre/alimente la modale
    const openModal = (p?: APIPlayer) => {
        if (p) {
            setEditingId(p.id);
            setForm(p);
        } else {
            // suggère un prochain ID si possible
            const nums = players
                .map((x) => parseInt(x.id.replace(/^P/, ""), 10))
                .filter((n) => !Number.isNaN(n));
            const next = (nums.length ? Math.max(...nums) : 0) + 1;
            const nextId = `P${String(next).padStart(4, "0")}`;

            setEditingId(null);
            setForm({
                id: nextId,
                name: "",
                age: 18,
                email: "",
                role: "utilisateur",
                date_inscription: new Date().toISOString().slice(0, 10),
            });
        }
        setShowModal(true);
    };

    // submit (create/update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        try {
            if (editingId) {
                const updated = await patchJSON<APIPlayer>(`/players/${encodeURIComponent(editingId)}/`, {
                    // on envoie tous les champs pour rester simple
                    ...form,
                });
                setPlayers((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
            } else {
                const created = await postJSON<APIPlayer>("/players/", form);
                setPlayers((prev) => [created, ...prev]);
            }
            setShowModal(false);
            setEditingId(null);
        } catch (e: any) {
            setErrorMsg(e?.message ?? "Erreur lors de l’enregistrement");
        }
    };

    // delete
    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cet utilisateur ?")) return;
        setErrorMsg(null);
        try {
            await del(`/players/${encodeURIComponent(id)}/`);
            setPlayers((prev) => prev.filter((p) => p.id !== id));
        } catch (e: any) {
            setErrorMsg(e?.message ?? "Suppression impossible");
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((s) => ({
            ...s,
            [name]: name === "age" ? Number(value) : value,
        }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Âge</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscription</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {loading ? (
                        <tr><td className="px-6 py-6 text-gray-500" colSpan={7}>Chargement…</td></tr>
                    ) : players.length === 0 ? (
                        <tr><td className="px-6 py-6 text-gray-500" colSpan={7}>Aucun utilisateur.</td></tr>
                    ) : (
                        players.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-600">{u.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                                <td className="px-6 py-4 text-gray-600">{u.age}</td>
                                <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.role === "administrateur"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                    }`}>
                      {u.role}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{u.date_inscription}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(u)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.id)}
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
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">
                                {editingId ? "Modifier" : "Ajouter"} un Utilisateur
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ID *
                                    </label>
                                    <input
                                        type="text"
                                        name="id"
                                        value={form.id}
                                        onChange={onChange}
                                        required
                                        disabled={!!editingId}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        placeholder="Ex: P0001"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom complet *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={onChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Casey Philippe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Âge *
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={form.age}
                                        onChange={onChange}
                                        min={1}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date d’inscription *
                                    </label>
                                    <input
                                        type="date"
                                        name="date_inscription"
                                        value={form.date_inscription}
                                        onChange={onChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={onChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: casey@exemple.com"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rôle *
                                    </label>
                                    <select
                                        name="role"
                                        value={form.role}
                                        onChange={onChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="utilisateur">Utilisateur</option>
                                        <option value="administrateur">Administrateur</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end mt-6">
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