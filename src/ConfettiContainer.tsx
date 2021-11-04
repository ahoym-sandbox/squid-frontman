import ReactConfetti from 'react-confetti';
import { useConfettiContext } from './contexts/useConfetti';

export const ConfettiContainer = () => {
  const { showConfetti } = useConfettiContext();

  if (!showConfetti) return null;

  return (
    <div className="Confetti">
      <ReactConfetti width={2000} height={2000} />
    </div>
  );
};
