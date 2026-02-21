"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  endTime: Date;
  onExpired?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function CountdownTimer({ endTime, onExpired }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        onExpired?.();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpired]);

  if (timeLeft.isExpired) {
    return <div className="text-sm font-semibold text-red-600">Offer Expired</div>;
  }

  return (
    <div className="flex gap-2 text-sm">
      <div className="text-center">
        <div className="bg-primary text-white rounded px-2 py-1 font-bold text-lg">
          {String(timeLeft.days).padStart(2, "0")}
        </div>
        <div className="text-xs text-muted-foreground mt-1">Days</div>
      </div>
      <div className="text-center">
        <div className="bg-primary text-white rounded px-2 py-1 font-bold text-lg">
          {String(timeLeft.hours).padStart(2, "0")}
        </div>
        <div className="text-xs text-muted-foreground mt-1">Hours</div>
      </div>
      <div className="text-center">
        <div className="bg-primary text-white rounded px-2 py-1 font-bold text-lg">
          {String(timeLeft.minutes).padStart(2, "0")}
        </div>
        <div className="text-xs text-muted-foreground mt-1">Mins</div>
      </div>
      <div className="text-center">
        <div className="bg-primary text-white rounded px-2 py-1 font-bold text-lg">
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
        <div className="text-xs text-muted-foreground mt-1">Secs</div>
      </div>
    </div>
  );
}
