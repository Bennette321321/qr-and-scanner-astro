import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import type { ScanResult, StudentPayload } from "../types";

interface QRScannerProps {
  onScan?: (result: ScanResult) => void;
}

const extractId = (raw: string): string | null => {
  try {
    const obj = JSON.parse(raw) as Partial<StudentPayload>;
    if (obj && obj.t === "student" && obj.id) return String(obj.id);
  } catch {
    console.error("There's something wrong I dunno why xd");
  }
  return raw.trim() || null;
};

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const lastRef = useRef<string>("");
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    const scanner = new QrScanner(
      videoRef.current!,
      (result: QrScanner.ScanResult) => {
        if (result.data === lastRef.current) return;
        lastRef.current = result.data;

        const id = extractId(result.data);
        if (!id) return;

        onScan?.({ id, raw: result.data });
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        preferredCamera: "environment",
      },
    );
    scannerRef.current = scanner;
    return () => {
      scanner.destroy();
    };
  }, []);

  const start = async (): Promise<void> => {
    try {
      await scannerRef.current?.start();
      setRunning(true);
    } catch {
      console.error("Error on start scanning");
    }
  };

  const stop = (): void => {
    scannerRef.current?.stop();
    setRunning(false);
    lastRef.current = "";
  };

  return (
    <div>
      <video ref={videoRef} playsInline />

      <div>
        {!running ? (
          <button
            type="button"
            className="border px-3 py-1 rounded-xl"
            onClick={start}
          >
            Start
          </button>
        ) : (
          <button
            type="button"
            className="border px-3 py-1 rounded-xl"
            onClick={stop}
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
