import { useEffect, useState } from 'react';


export const useCurrentTime = (comSegundos: boolean = true): string => {
  const [horaAtual, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const atualizarHora = () => {
      const agora = new Date();

      const horas = agora.getHours().toString().padStart(2, '0');
      const minutos = agora.getMinutes().toString().padStart(2, '0');
      
      let horaFormatada = `${horas}:${minutos}`;
      
      if (comSegundos) {
        const segundos = agora.getSeconds().toString().padStart(2, '0');
        horaFormatada += `:${segundos}`;
      }

      setCurrentTime(horaFormatada);
    };

    atualizarHora();

    const intervalo = setInterval(atualizarHora, 1000);

    return () => clearInterval(intervalo);
  }, [comSegundos]);

  return horaAtual;
};


export const getcurrentTime = (): string => {
  const agora = new Date();
  return agora.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};