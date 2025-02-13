import { useEffect, useState } from "react";

export const usePlay = (audioEle: HTMLAudioElement | null) => {
  const [totalCount, setTotalCount] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [onComplete, setOnComplete] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (!audioEle) return;
    const handleEnded = () => {
      setPlayCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount < totalCount) {
          audioEle.play();
        } else if (newCount === totalCount) {
          onComplete?.();
        }
        return newCount;
      });
    };

    audioEle.addEventListener("ended", handleEnded);

    return () => {
      audioEle.removeEventListener("ended", handleEnded);
    };
  }, [totalCount]);

  const play = (times: number, onComplete?: () => void) => {
    setPlayCount(0);
    setTotalCount(times);
    setOnComplete(() => onComplete);
    audioEle?.play();
  };

  return { play };
};
