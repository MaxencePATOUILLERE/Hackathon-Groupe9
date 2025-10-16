export interface Babyfoot {
    id: string;
    nom: string;
    etat: 'disponible' | 'occupé' | 'maintenance';
    localisation: string;
    derniereUtilisation?: Date;
    tempsUtilisationTotal: number; // en minutes
    nombreParties: number;
  }
  
  export interface User {
    id: string;
    nom: string;
    email: string;
    role: 'admin' | 'user';
    dateInscription: Date;
    nombreParties: number;
  }
  
  export interface Stats {
    totalBabyfoots: number;
    babyfootsDisponibles: number;
    babyfootsOccupes: number;
    babyfootsEnMaintenance: number;
    totalUtilisateurs: number;
    partiesAujourdhui: number;
  }