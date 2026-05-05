import { useEffect, useState } from "react";

const getTimeLeft = (targetDate: any) => {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { total: diff, days, hours, minutes, seconds };
};

const CountdownToDate = ({
  targetDate,
  onFinish,
}: {
  targetDate: any;
  onFinish: any;
}) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    if (timeLeft.total <= 0) {
      onFinish?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, timeLeft.total, onFinish]);

  return (
    <div style={{ display: "flex", gap: "12px", fontSize: "1.5rem", justifyContent: 'center' }}>
      <TimeBox label="Días" value={timeLeft.days} />
      <TimeBox label="Horas" value={timeLeft.hours} />
      <TimeBox label="Min" value={timeLeft.minutes} />
      <TimeBox label="Seg" value={timeLeft.seconds} />
    </div>
  );
};

const TimeBox = ({ label, value }: { label: any; value: any }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontWeight: "bold" }}>
      {value.toString().padStart(2, "0")}
    </div>
    <div style={{ fontSize: "0.75rem", color: "#4B5563" }}>{label}</div>
  </div>
);

export default CountdownToDate;
