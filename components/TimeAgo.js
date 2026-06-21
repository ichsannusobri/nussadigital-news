'use client';

import { useState, useEffect } from 'react';

export default function TimeAgo({ date }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    if (!date) return;
    
    function updateTime() {
      const now = new Date();
      const past = new Date(date);
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) {
        setTimeStr('Just now');
      } else if (diffMins < 60) {
        setTimeStr(`${diffMins}m ago`);
      } else {
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) {
          setTimeStr(`${diffHours}h ago`);
        } else {
          const diffDays = Math.floor(diffHours / 24);
          setTimeStr(`${diffDays}d ago`);
        }
      }
    }

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [date]);

  return <span className="alj-time">{timeStr ? timeStr + ':' : ''}</span>;
}
