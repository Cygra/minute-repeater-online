"use client";

import { useRef } from "react";

export default function Home() {
  const hourRef = useRef<HTMLAudioElement>(null);
  const quarterRef = useRef<HTMLAudioElement>(null);
  const minuteRef = useRef<HTMLAudioElement>(null);

  const listRef = useRef<string[]>(["hour", "hour"]);

  const playAudio = () => {
    const date = new Date();

    let hour = date.getHours();
    if (hour === 0) hour = 12;

    const quarter = Math.floor(date.getMinutes() / 15);

    const minute = date.getMinutes() % 15;

    const list = [];

    for (let i = 0; i < hour - 1; i++) {
      list.push("hour");
    }
    for (let i = 0; i < quarter; i++) {
      list.push("quarter");
    }
    for (let i = 0; i < minute; i++) {
      list.push("minute");
    }

    listRef.current = list;
    hourRef.current?.play();
  };

  const onAudioEnd = () => {
    const [first, ...other] = listRef.current;
    if (first) {
      switch (first) {
        case "hour":
          hourRef.current?.play();
          break;
        case "quarter":
          quarterRef.current?.play();
          break;
        case "minute":
          minuteRef.current?.play();
          break;
        default:
          break;
      }

      listRef.current = other;
    }
  };

  return (
    <div className="grid items-center justify-items-center min-h-screen p-20 ">
      <audio
        ref={hourRef}
        src={"/minute-repeater-online/hour.aac"}
        preload="metadata"
        onEnded={onAudioEnd}
      />
      <audio
        ref={quarterRef}
        src={"/minute-repeater-online/quarter.aac"}
        preload="metadata"
        onEnded={onAudioEnd}
      />
      <audio
        ref={minuteRef}
        src={"/minute-repeater-online/minute.aac"}
        preload="metadata"
        onEnded={onAudioEnd}
      />
      <div
        onClick={playAudio}
        className="rounded-full border border-solid border-transparent flex items-center justify-center bg-foreground text-background text-sm h-10 px-4"
      >
        Play now
      </div>
    </div>
  );
}
