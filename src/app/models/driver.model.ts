export interface Driver {
  id?: number;       // ID optionnel, généré par le backend
  name: string;      // Nom du conducteur
  email: string;     // Email du conducteur
  phone: string;     // Numéro de téléphone
  vehicleId: number; // ID du véhicule attribué au conducteur
}
