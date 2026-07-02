import { useEffect, useRef, useState } from "react";
import QRCodeStyling, { type Options } from "qr-code-styling";
import type { StudentPayload } from "../types";

interface QRGeneratorProps {
  id?: string;
  editable?: boolean;
}

const buildPayload = (id: string): string => {
  const payload: StudentPayload = { t: "student", id: id.trim() };
  return JSON.stringify(payload);
};

export default function QRGenerator({
  id: initialId = "1234567890",
  editable = true,
}: QRGeneratorProps) {
  const [id, setId] = useState<string>(initialId);
  const holderRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const options: Options = {
      width: 240,
      height: 240,
      margin: 8,
      data: buildPayload(initialId),
      qrOptions: { errorCorrectionLevel: "M" }, // "H" to add a logo
      dotsOptions: { type: "rounded", color: "#000" },
      cornersSquareOptions: { type: "extra-rounded", color: "#000" },
      backgroundOptions: { color: "#fff" },
    };
    const qr = new QRCodeStyling(options);
    if (holderRef.current) qr.append(holderRef.current);
    qrRef.current = qr;
    return () => {
      if (holderRef.current) holderRef.current.innerHTML = "";
      qrRef.current = null;
    };
  }, []);

  useEffect(() => {
    qrRef.current?.update({ data: buildPayload(id) });
  }, [id]);

  const download = (): void => {
    const clean = id.trim() || "student";
    qrRef.current?.download({ name: `qr-${clean}`, extension: "png" });
  };

  return (
    <div>
      {editable && (
        <label>
          <span>Student ID</span>
          <input
            className="border px-3 py-1 rounded-xl"
            type="text"
            value={id}
            spellCheck={false}
            autoComplete="off"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setId(e.target.value)
            }
          />
        </label>
      )}

      <div>
        <div ref={holderRef} />
        <p>{id.trim() || "—"}</p>
      </div>

      <button
        type="button"
        className="border px-3 py-1 rounded-xl"
        onClick={download}
      >
        Download png
      </button>
    </div>
  );
}
