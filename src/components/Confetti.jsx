import { useEffect, useState } from 'react';

export const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate confetti particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 0.5,
      animationDuration: 2 + Math.random() * 2,
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'][
        Math.floor(Math.random() * 6)
      ],
      size: 8 + Math.random() * 8,
    }));
    setParticles(newParticles);

    // Remove confetti after animation
    const timeout = setTimeout(() => {
      setParticles([]);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-piece"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}
    </div>
  );
};
