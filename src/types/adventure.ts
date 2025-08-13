// src/types/adventure.ts
export type Difficulty = 'Muy Fácil' | 'Fácil' | 'Moderada' | 'Intermedia' | 'Difícil' | 'Muy Difícil' | 'Legendaria';
export type Category = 
  'Local' |
  'Nacional' |
  'Internacional' |
  'B2B' |
  'Tour';

export interface Adventure {
  id: string;
  title: string;
  firstDate: string;
  secondDate?: string;
  duration: number;
  location: string;
  short_description: string;
  long_description: string;
  image: {
    thumbnail: string;
    large: string;
    full: string;
  };
  difficulty: Difficulty;
  price: number;
  alternativePrice?: number;
  currency: string;
  category: Category;
  capacity: number;
  riders: number;
}
