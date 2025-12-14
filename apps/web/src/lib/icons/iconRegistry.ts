/**
 * Icon Registry
 * Central mapping for species icons
 */

export type SpeciesType = 'ROOT' | 'SPREAD' | 'MUTATION' | 'N2' | 'M2';

export interface IconAsset {
  png: string;
  label: string;
}

const ICON_REGISTRY: Record<SpeciesType, IconAsset> = {
  ROOT: {
    png: '/images/root.png',
    label: 'Root Species',
  },
  SPREAD: {
    png: '/images/spread.png',
    label: 'Spread Species',
  },
  MUTATION: {
    png: '/images/mutation.png',
    label: 'Mutation Species',
  },
  N2: {
    png: '/images/n2.png',
    label: 'Nutrition Type 2',
  },
  M2: {
    png: '/images/m2.png',
    label: 'Metabolism Type 2',
  },
};

/**
 * Get icon asset paths for a species
 */
export function getSpeciesIcon(species: SpeciesType): IconAsset {
  return ICON_REGISTRY[species];
}

/**
 * Get all available species types
 */
export function getAllSpeciesTypes(): SpeciesType[] {
  return Object.keys(ICON_REGISTRY) as SpeciesType[];
}

/**
 * Check if a species type is valid
 */
export function isValidSpecies(species: string): species is SpeciesType {
  return species in ICON_REGISTRY;
}
