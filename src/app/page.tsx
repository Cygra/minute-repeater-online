"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [src, setSrc] = useState<string>();
  const [hourBuffer, setHourBuffer] = useState<ArrayBuffer>();
  const [quarterBuffer, setQuarterBuffer] = useState<ArrayBuffer>();
  const [minuteBuffer, setMinuteBuffer] = useState<ArrayBuffer>();

  const [secondDeg, setSecondDeg] = useState(0);
  const [minuteDeg, setMinuteDeg] = useState(0);
  const [hourDeg, setHourDeg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setSecondDeg(getSecondDeg(date));
      setMinuteDeg(getMinuteDeg(date));
      setHourDeg(getHourDeg(date));
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getSecondDeg = (d: Date) => {
    const second = d.getSeconds();
    const millisec = d.getMilliseconds();
    return Math.floor(((second + millisec / 1000) * 6) % 360);
  };

  const getMinuteDeg = (d: Date) => {
    const second = d.getSeconds();
    const minute = d.getMinutes();
    return Math.floor(((minute + second / 60) * 6) % 360);
  };

  const getHourDeg = (d: Date) => {
    const second = d.getSeconds();
    const minute = d.getMinutes();
    const hour = d.getHours() % 12;
    return Math.floor(((hour + minute / 60 + second / 3600) * 30) % 360);
  };

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
      audioRef.current.play();
    }
  };

  return (
    <div className="grid items-center justify-items-center min-h-screen p-20 ">
      <audio ref={audioRef} />
      <div
        className={`
          rounded-full w-[50vw] h-[50vw] bg-foreground text-background
          max-w-96 max-h-96 relative
        `}
      >
        {new Array(12).fill(1).map((_, ind) => (
          <div
            className={`w-1 h-[50vw] max-h-96 absolute top-0 left-[50%] translate-x-[-50%]`}
            key={ind}
            style={{ transform: `rotate(${ind * 30}deg)` }}
          >
            <div
              className={`absolute top-0 bottom-[96%] left-0 right-0 bg-background`}
            />
          </div>
        ))}
        {new Array(60).fill(1).map((_, ind) => (
          <div
            className={`w-0.5 h-[50vw] max-h-96 absolute top-0 left-[50%] translate-x-[-50%]`}
            key={ind}
            style={{ transform: `rotate(${ind * 6}deg)` }}
          >
            <div
              className={`absolute top-0 bottom-[98%] left-0 right-0 bg-background`}
            />
          </div>
        ))}
        <div
          className={`w-1 h-[50vw] max-h-96 absolute top-0 left-[50%] translate-x-[-50%]`}
          style={{ transform: `rotate(${hourDeg}deg)` }}
        >
          <div
            className={`absolute top-8 bottom-[48%] left-0 right-0 bg-background`}
          />
        </div>
        <div
          className={`w-1 h-[50vw] max-h-96 absolute top-0 left-[50%] translate-x-[-50%]`}
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        >
          <div
            className={`absolute top-4 bottom-[45%] left-0 right-0 bg-background`}
          />
        </div>
        <div
          className={`w-0.5 h-[50vw] max-h-96 absolute top-0 left-[50%] translate-x-[-50%]`}
          style={{ transform: `rotate(${secondDeg}deg)` }}
        >
          <div
            className={`absolute top-2 bottom-[45%] left-0 right-0 bg-background`}
          />
        </div>
      </div>
      <div
        onClick={playAudio}
        className={`
          rounded-full border border-solid border-transparent flex items-center 
          justify-center bg-foreground text-background text-sm h-10 px-4
        `}
      >
        {hourBuffer && quarterBuffer && minuteBuffer
          ? "Play the sound"
          : "Loading.."}
      </div>
      <div className={"fixed top-2 left-2 right-2 z-50 flex items-center"}>
        <div className={"flex-1 underline decoration-wavy"}>
          Minute Repeater Online
        </div>
        <iframe
          src="https://ghbtns.com/github-btn.html?user=Cygra&repo=minute-repeater-online&type=star&count=true&size=middle"
          width="80"
          height="20"
          title="GitHub"
        />
      </div>
    </div>
  );
}
