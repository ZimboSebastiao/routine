import { useEffect, useState } from 'react';

export const useGreeting = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour >= 2 && hour < 12) {
        setGreeting('Bom dia');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('Boa tarde');
      } else {
        setGreeting('Boa noite');
      }
    };


    updateGreeting();
    
    // Atualiza a cada minuto 
    const interval = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return greeting;
};