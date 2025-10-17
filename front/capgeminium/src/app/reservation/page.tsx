"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, CheckCircle2, XCircle } from "lucide-react"

type Table = {
    id: number
    name: string
    available: boolean
}

const initialTables: Table[] = [
    { id: 1, name: "Babyfoot 1", available: true },
    { id: 2, name: "Babyfoot 2", available: false },
    { id: 3, name: "Babyfoot 3", available: true },
]

export default function ReservationPage() {
    const [tables, setTables] = useState<Table[]>(initialTables)
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)
    const [username, setUsername] = useState("")
    const [time, setTime] = useState("")

    // Fonction appelée quand on confirme la réservation
    const handleReservation = () => {
        if (!selectedTable) return

        setTables(prev =>
            prev.map(t =>
                t.id === selectedTable.id ? { ...t, available: false } : t
            )
        )

        // Reset du formulaire
        setSelectedTable(null)
        setUsername("")
        setTime("")
        alert(`✅ Réservation confirmée pour ${selectedTable.name} à ${time}`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Titre principal */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        Réservation de babyfoot
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Choisissez votre table et réservez votre créneau en quelques secondes.
                    </p>
                </div>

                {/* Grille des 3 tables */}
                <div className="grid md:grid-cols-3 gap-6">
                    {tables.map(table => (
                        <Card
                            key={table.id}
                            className={`border-2 ${
                                table.available ? "border-green-400" : "border-red-400"
                            } bg-card/70 backdrop-blur-md transition-all hover:shadow-lg`}
                        >
                            <CardContent className="p-6 text-center">
                                <div className="flex justify-center mb-4">
                                    {table.available ? (
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    ) : (
                                        <XCircle className="w-10 h-10 text-red-500" />
                                    )}
                                </div>

                                <h3 className="text-2xl font-bold mb-2 text-foreground">
                                    {table.name}
                                </h3>
                                <p
                                    className={`text-sm font-medium ${
                                        table.available ? "text-green-600" : "text-red-600"
                                    } mb-4`}
                                >
                                    {table.available ? "Disponible" : "Occupée"}
                                </p>

                                <Button
                                    disabled={!table.available}
                                    onClick={() => setSelectedTable(table)}
                                    className="w-full"
                                >
                                    Réserver
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Formulaire de réservation (affiché quand une table est sélectionnée) */}
                {selectedTable && (
                    <div className="mt-12 bg-card border border-border rounded-2xl shadow-xl p-8 max-w-md mx-auto">
                        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-primary" />
                            Réserver {selectedTable.name}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="username">Votre nom</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Ex: Antoine Dupont"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="time">Heure souhaitée</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    className="flex-1"
                                    disabled={!username || !time}
                                    onClick={handleReservation}
                                >
                                    Confirmer
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setSelectedTable(null)}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
