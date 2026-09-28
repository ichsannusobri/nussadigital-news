'use client';

import { useState, useEffect } from 'react';

export default function TimeAgo({ date }) {
  const absolute = (() => {
    const d = date ? new Date(date) : null;
    return d && !Number.isNaN(d.getTime())
      ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '';
  })();
  // Server-rendered absolute date; switches to relative time on the client for recent items.
  const [timeStr, setTimeStr] = useState(absolute);

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
          setTimeStr(diffDays < 7 ? `${diffDays}d ago` : absolute);
        }
      }
    }

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [date, absolute]);

  return <time className="alj-time" dateTime={date || undefined} suppressHydrationWarning>{timeStr}</time>;
}
