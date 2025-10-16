"use client";

import { useState } from 'react';
import { Table2, Users, CheckCircle, Clock } from 'lucide-react';

interface Babyfoot {
  id: string;
  nom: string;
  etat: 'disponible' | 'occupé' | 'maintenance';
  localisation: string;
  tempsUtilisationTotal: number;
  nombreParties: number;
}

export default function AdminDashboard() {
  const [babyfoots] = useState<Babyfoot[]>([
    { id: '1', nom: 'Babyfoot A', etat: 'disponible', localisation: 'Salle 1', tempsUtilisationTotal: 120, nombreParties: 45 },
    { id: '2', nom: 'Babyfoot B', etat: 'occupé', localisation: 'Salle 2', tempsUtilisationTotal: 200, nombreParties: 67 },
    { id: '3', nom: 'Babyfoot C', etat: 'maintenance', localisation: 'Salle 3', tempsUtilisationTotal: 80, nombreParties: 23 },
  ]);

  const stats = {
    totalBabyfoots: babyfoots.length,
    disponibles: babyfoots.filter(b => b.etat === 'disponible').length,
    occupes: babyfoots.filter(b => b.etat === 'occupé').length,
    maintenance: babyfoots.filter(b => b.etat === 'maintenance').length,
    totalUsers: 15,
    totalParties: babyfoots.reduce((acc, b) => acc + b.nombreParties, 0),
  };

  const getEtatColor = (etat: string) => {
    switch (etat) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'occupé': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEtatIcon = (etat: string) => {
    switch (etat) {
      case 'disponible': return <CheckCircle className="w-4 h-4" />;
      case 'occupé': return <Clock className="w-4 h-4" />;
      case 'maintenance': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Vue d'ensemble</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Babyfoots</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalBabyfoots}</p>
            </div>
            <Table2 className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Disponibles</p>
              <p className="text-3xl font-bold text-green-600">{stats.disponibles}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Utilisateurs</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
            <Users className="w-12 h-12 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Parties Totales</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalParties}</p>
            </div>
            <Clock className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Babyfoots Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">État des Babyfoots</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {babyfoots.map(babyfoot => (
            <div key={babyfoot.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{babyfoot.nom}</h4>
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getEtatColor(babyfoot.etat)}`}>
                  {getEtatIcon(babyfoot.etat)}
                  {babyfoot.etat}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{babyfoot.localisation}</p>
              <div className="text-sm text-gray-500">
                <p>{babyfoot.nombreParties} parties</p>
                <p>{Math.floor(babyfoot.tempsUtilisationTotal / 60)}h {babyfoot.tempsUtilisationTotal % 60}min d'utilisation</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}