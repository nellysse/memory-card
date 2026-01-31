import { useEffect, useState } from 'react';

export const Timer = ({ isRunning, onTimeUpdate, resetTrigger }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(0);
  }, [resetTrigger]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        const newTime = prev + 1;
        onTimeUpdate?.(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="stat-item">
      <span className="stat-label">Time</span>
      <span className="stat-value timer">{formatTime(time)}</span>
    </div>
  );
};
