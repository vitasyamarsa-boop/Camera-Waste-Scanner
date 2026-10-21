export type WasteCategory =
  | 'organik'
  | 'plastik'
  | 'kertas'
  | 'logam'
  | 'kaca'
  | 'b3'
  | 'residu';

export type BinColor = 'Hijau' | 'Kuning' | 'Biru' | 'Merah' | 'Abu-abu';

export interface WasteClassification {
  itemName: string;
  category: WasteCategory;
  categoryLabel: string;
  binColor: BinColor;
  binLabel: string;
  material: string;
  confidence: number;
  decompositionTime: string;
  recyclable: boolean;
  disposalSteps: string[];
  upcyclingIdeas: string[];
  environmentalImpact: string;
  bankSampahValue: string;
  ecoTips: string;
}

export interface ScannedItem extends WasteClassification {
  id: string;
  timestamp: number;
  imageUrl?: string;
}

export interface WasteGuideEntry {
  id: string;
  name: string;
  category: WasteCategory;
  categoryLabel: string;
  binColor: BinColor;
  decompositionTime: string;
  recyclable: boolean;
  quickStep: string;
  iconName: string;
  tips: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  categoryHint: string;
}
