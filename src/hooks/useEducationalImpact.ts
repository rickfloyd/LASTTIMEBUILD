import { useState, useEffect } from 'react';

interface ImpactNotification {
  id: number;
  message: string;
  type: 'scholarship' | 'course' | 'program' | 'tool';
  timestamp: Date;
}

export const useEducationalImpact = () => {
  const [notifications, setNotifications] = useState<ImpactNotification[]>([]);

  useEffect(() => {
    const impactUpdates = [
      { message: "New scholarship awarded to Maria S. in Chicago", type: 'scholarship' as const },
      { message: "Free course 'Options Basics' reached 1,000 students", type: 'course' as const },
      { message: "Youth program launched in Phoenix, AZ", type: 'program' as const },
      { message: "Open source indicator library updated", type: 'tool' as const },
      { message: "Financial literacy workshop completed in Detroit", type: 'program' as const },
      { message: "Scholarship awarded to James L. in Houston", type: 'scholarship' as const },
      { message: "Free webinar 'Risk Management' had 500 attendees", type: 'course' as const },
      { message: "Trading simulator tool downloaded 2,000 times", type: 'tool' as const },
    ];

    const interval = setInterval(() => {
      const randomUpdate = impactUpdates[Math.floor(Math.random() * impactUpdates.length)];
      const newNotification: ImpactNotification = {
        id: Date.now(),
        message: randomUpdate.message,
        type: randomUpdate.type,
        timestamp: new Date()
      };

      setNotifications(prev => {
        const updated = [newNotification, ...prev];
        return updated.slice(0, 10); // Keep only last 10 notifications
      });
    }, 15000); // New notification every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getTotalStats = () => {
    return {
      studentsHelped: 12847 + Math.floor(Date.now() / 1000000) % 100,
      coursesCreated: 156,
      scholarshipsAwarded: 342 + Math.floor(Date.now() / 10000000) % 10,
      freeToolsReleased: 28 + Math.floor(Date.now() / 100000000) % 5
    };
  };

  return {
    notifications,
    getTotalStats
  };
};