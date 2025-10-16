"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';

interface Babyfoot {
  id: string;
  nom: string;
  etat: 'disponible' | 'occupé' | 'maintenance';
  localisation: string;
  tempsUtilisationTotal: number;
  nombreParties: number;
}

export default function BabyfootsPage() {
  const [babyfoots, setBabyfoots] = useState<Babyfoot[]>([
    { id: '1', nom: 'Babyfoot A', etat: 'disponible', localisation: 'Salle 1', tempsUtilisationTotal: 120, nombreParties: 45 },
    { id: '2', nom: 'Babyfoot B', etat: 'occupé', localisation: 'Salle 2', tempsUtilisationTotal: 200, nombreParties: 67 },
    { id: '3', nom: 'Babyfoot C', etat: 'maintenance', localisation: 'Salle 3', tempsUtilisationTotal: 80, nombreParties: 23 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Babyfoot | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    etat: 'disponible' as 'disponible' | 'occupé' | 'maintenance',
    localisation: '',
  });

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
      case 'maintenance': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const openModal = (item?: Babyfoot) => {
    setEditingItem(item || null);
    
    if (item) {
      setFormData({
        nom: item.nom,
        etat: item.etat,
        localisation: item.localisation,
      });
    } else {
      setFormData({
        nom: '',
        etat: 'disponible',
        localisation: '',
      });
    }
    
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setBabyfoots(babyfoots.map(b => 
        b.id === editingItem.id 
          ? { ...b, nom: formData.nom, etat: formData.etat, localisation: formData.localisation }
          : b
      ));
    } else {
      const newBabyfoot: Babyfoot = {
        id: (babyfoots.length + 1).toString(),
        nom: formData.nom,
        etat: formData.etat,
        localisation: formData.localisation,
        tempsUtilisationTotal: 0,
        nombreParties: 0,
      };
      setBabyfoots([...babyfoots, newBabyfoot]);
    }
    
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce babyfoot ?')) {
      setBabyfoots(babyfoots.filter(b => b.id !== id));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">État</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parties</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {babyfoots.map(babyfoot => (
              <tr key={babyfoot.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{babyfoot.nom}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getEtatColor(babyfoot.etat)}`}>
                    {getEtatIcon(babyfoot.etat)}
                    {babyfoot.etat}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{babyfoot.localisation}</td>
                <td className="px-6 py-4 text-gray-600">{babyfoot.nombreParties}</td>
                <td className="px-6 py-4 text-gray-600">{Math.floor(babyfoot.tempsUtilisationTotal / 60)}h {babyfoot.tempsUtilisationTotal % 60}min</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(babyfoot)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(babyfoot.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingItem ? 'Modifier' : 'Ajouter'} un Babyfoot
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du Babyfoot *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Babyfoot A"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  État *
                </label>
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

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <input
                  type="text"
                  name="localisation"
                  value={formData.localisation}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Salle 1"
                />
              </div>

              <div className="flex gap-2 justify-end">
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
                  {editingItem ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}