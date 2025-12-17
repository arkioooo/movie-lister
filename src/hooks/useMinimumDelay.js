import { useRef } from 'react';

export default function useMinimumDelay(minMs = 600) {
  const startRef = useRef(0);

  function start() {
    startRef.current = Date.now();
  }

  async function end() {
    const elapsed = Date.now() - startRef.current;
    const remaining = minMs - elapsed;
    if (remaining > 0) {
      await new Promise((r) => setTimeout(r, remaining));
    }
  }

  return { start, end };
}
