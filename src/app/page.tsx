"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [src, setSrc] = useState<string>();
  const [hourBuffer, setHourBuffer] = useState<ArrayBuffer>();
  const [quarterBuffer, setQuarterBuffer] = useState<ArrayBuffer>();
  const [minuteBuffer, setMinuteBuffer] = useState<ArrayBuffer>();

  useEffect(() => {
    fetch("/minute-repeater-online/hour.aac").then((res) =>
      res.arrayBuffer().then(setHourBuffer)
    );
    fetch("/minute-repeater-online/quarter.aac").then((res) =>
      res.arrayBuffer().then(setQuarterBuffer)
    );
    fetch("/minute-repeater-online/minute.aac").then((res) =>
      res.arrayBuffer().then(setMinuteBuffer)
    );
  }, []);

  const playAudio = async () => {
    if (!hourBuffer || !quarterBuffer || !minuteBuffer) return;

    if (src) {
      URL.revokeObjectURL(src);
    }

    const date = new Date();

    let hour = date.getHours() % 12;
    if (hour === 0) hour = 12;

    const quarter = Math.floor(date.getMinutes() / 15);

    const minute = date.getMinutes() % 15;

    const u8ArrayLength =
      hourBuffer.byteLength * hour +
      quarterBuffer.byteLength * quarter +
      minuteBuffer.byteLength * minute;

    const combinedBuffer = new Uint8Array(u8ArrayLength);

    let pos = 0;
    for (let i = 0; i < hour; i++) {
      combinedBuffer.set(new Uint8Array(hourBuffer), pos);
      pos += hourBuffer.byteLength;
    }
    for (let i = 0; i < quarter; i++) {
      combinedBuffer.set(new Uint8Array(quarterBuffer), pos);
      pos += quarterBuffer.byteLength;
    }
    for (let i = 0; i < minute; i++) {
      combinedBuffer.set(new Uint8Array(minuteBuffer), pos);
      pos += minuteBuffer.byteLength;
    }

    const blob = new Blob([combinedBuffer], {
      type: "audio/aac",
    });

    const url = URL.createObjectURL(blob);

    setSrc(url);

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current?.play();
    }
  };

  return (
    <div className="grid items-center justify-items-center min-h-screen p-20 ">
      <audio ref={audioRef} />
      <div
        onClick={playAudio}
        className="rounded-full border border-solid border-transparent flex items-center justify-center bg-foreground text-background text-sm h-10 px-4"
      >
        {hourBuffer && quarterBuffer && minuteBuffer ? "Play now" : "Loading.."}
      </div>
      <iframe
        src="https://ghbtns.com/github-btn.html?user=Cygra&repo=minute-repeater-online&type=star&count=true&size=large"
        width="170"
        height="30"
        title="GitHub"
        className={"fixed top-2 left-2 z-50"}
      />
    </div>
  );
}
