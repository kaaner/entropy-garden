'use client';

import { getSpeciesIcon, type SpeciesType } from '@/lib/icons/iconRegistry';
import { useMemo } from 'react';

export interface SpeciesIconProps {
  species: SpeciesType;
  ownerId?: 0 | 1;
  size?: number;
  className?: string;
}

/**
 * SpeciesIcon Component
 * Renders species icons with owner-based color tinting
 */
export function SpeciesIcon({
  species,
  ownerId,
  size = 32,
  className = '',
}: SpeciesIconProps) {
  const icon = useMemo(() => getSpeciesIcon(species), [species]);

  // Color filter based on owner
  const colorClass = useMemo(() => {
    if (ownerId === undefined) return '';
    return ownerId === 0
      ? 'icon-player-0' // Green/primary
      : 'icon-player-1'; // Red/secondary
  }, [ownerId]);

  return (
    <div
      className={`species-icon ${colorClass} ${className}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label={icon.label}
      role="img"
    >
      {/* Use simple img tag with PNG for reliability */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={icon.png}
        alt={icon.label}
        width={size}
        height={size}
        className="species-icon-image"
        style={{ objectFit: 'contain' }}
      />

      {/* Invisible fallback text for accessibility */}
      <span className="sr-only">{icon.label}</span>
    </div>
  );
}

/**
 * Simplified icon for small sizes (optional)
 */
export function SpeciesIconSmall({
  species,
  ownerId,
  className = '',
}: Omit<SpeciesIconProps, 'size'>) {
  return (
    <SpeciesIcon
      species={species}
      ownerId={ownerId}
      size={24}
      className={`${className} species-icon-small`}
    />
  );
}

/**
 * Large icon for dialogs/previews (optional)
 */
export function SpeciesIconLarge({
  species,
  ownerId,
  className = '',
}: Omit<SpeciesIconProps, 'size'>) {
  return (
    <SpeciesIcon
      species={species}
      ownerId={ownerId}
      size={48}
      className={`${className} species-icon-large`}
    />
  );
}
