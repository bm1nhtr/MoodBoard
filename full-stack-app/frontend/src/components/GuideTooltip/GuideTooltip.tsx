/**
 * Bulle d’aide avec flèche pointant vers une cible (getBoundingClientRect).
 * Une étape par type de cadre (image, texte, FAB), chaque type guidé une seule fois.
 */

import type { FC } from 'react';
import './GuideTooltip.css';

interface GuideTooltipProps {
  targetRect: DOMRect | null;
  message: string;
  buttonLabel: string;
  onClose: () => void;
}

const GuideTooltip: FC<GuideTooltipProps> = ({
  targetRect,
  message,
  buttonLabel,
  onClose,
}) => {
  const hasTarget = targetRect != null;
  const tooltipAbove = hasTarget && targetRect.top > window.innerHeight / 2;
  const style: React.CSSProperties = hasTarget
    ? tooltipAbove
      ? {
          position: 'fixed',
          left: targetRect.left + targetRect.width / 2,
          top: targetRect.top - 12,
          transform: 'translate(-50%, -100%)',
        }
      : {
          position: 'fixed',
          left: targetRect.left + targetRect.width / 2,
          top: targetRect.bottom + 12,
          transform: 'translateX(-50%)',
        }
    : {
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      };

  return (
    <div className="guide-tooltip" style={style}>
      {hasTarget && (
        <div className={`guide-tooltip__arrow guide-tooltip__arrow--${tooltipAbove ? 'down' : 'up'}`} />
      )}
      <div className="guide-tooltip__bubble">
        <p className="guide-tooltip__message">{message}</p>
        <button type="button" className="guide-tooltip__btn" onClick={onClose}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default GuideTooltip;
