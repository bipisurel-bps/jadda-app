export interface Prayer {
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  label?: string;
}

export interface PrayerCategory {
  id: number;
  category_name: string;
  prayers: Prayer[];
}

export interface PrayerData {
  categories: PrayerCategory[];
}

export type Gender = 'male' | 'female';

export interface HeirInput {
  husband: boolean;
  wife: number; // 0-4
  son: number;
  daughter: number;
  father: boolean;
  mother: boolean;
  grandfather: boolean;
  grandmother: boolean;
  fullBrother: number;
  fullSister: number;
  paternalHalfBrother: number;
  paternalHalfSister: number;
  maternalHalfBrother: number;
  maternalHalfSister: number;
  grandsonFromSon: number;
  granddaughterFromSon: number;
  paternalUncle: number;
  uncleSon: number;
}

export interface HeirResult {
  name: string;
  count: number;
  basis: string;
  shareFraction: string;
  percentage: number;
  amount: number;
  blocked: boolean;
  blockReason?: string;
  role: 'furudh' | 'asabah' | 'blocked';
  perPersonAmount?: number;
}

export interface InheritanceResult {
  heirs: HeirResult[];
  totalEstate: number;
  aulOccurred: boolean;
  aulExplanation?: string;
  raddOccurred: boolean;
  raddExplanation?: string;
  blockedHeirs: HeirResult[];
}
