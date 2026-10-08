import type { CSSProperties } from 'react';
import { assetUrl } from '../../assets';

export function MaskIcon({ id, size = 24, className = '' }: { id: string; size?: number; className?: string }) {
  return <span aria-hidden="true" className={className} style={{ display: 'block', width: size, height: size, background: 'currentColor', maskImage: `url("${assetUrl(id)}")`, maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat' } as CSSProperties} />;
}
