"use client";

import { useRef } from "react";
import { usePlay } from "./usePlay";

export default function Home() {
  const hourRef = useRef<HTMLAudioElement>(null);
  const quarterRef = useRef<HTMLAudioElement>(null);
  const minuteRef = useRef<HTMLAudioElement>(null);

  const { play: playHour } = usePlay(hourRef.current);
  const { play: playQuarter } = usePlay(quarterRef.current);
  const { play: playMinute } = usePlay(minuteRef.current);

  const playAudio = () => {
    const date = new Date();
    let hour = date.getHours();
    if (hour === 0) hour = 12;
    const quarter = Math.floor(date.getMinutes() / 15);
    const minute = date.getMinutes() % 15;

    playHour(hour, () => {
      playQuarter(quarter, () => {
        playMinute(minute);
      });
    });
  };

  return (
    <div className="grid items-center justify-items-center min-h-screen p-20 ">
      <audio ref={hourRef} src={"/hour.aac"} preload="metadata" />
      <audio ref={quarterRef} src={"/quarter.aac"} preload="metadata" />
      <audio ref={minuteRef} src={"/minute.aac"} preload="metadata" />
      <div
        onClick={playAudio}
        className="rounded-full border border-solid border-transparent flex items-center justify-center bg-foreground text-background text-sm h-10 px-4"
      >
        Play now
      </div>
    </div>
  );
}
