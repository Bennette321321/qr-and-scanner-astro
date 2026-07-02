import { useState } from "react";
import type { ScanResult } from "../types";
import QRGenerator from "./QRGenerator";
import QRScanner from "./QRScanner";

export default function StudentQR() {
  const [status, setStatus] = useState<string>("No scan yet.");

  const handleScan = ({ id }: ScanResult): void => {
    setStatus(`Student: ${id}`);
  };

  return (
    <div>
      <div>
        <h2>Generate</h2>
        <QRGenerator />
      </div>
      <div>
        <h2>Scan</h2>
        <QRScanner onScan={handleScan} />
        <p>{status}</p>
      </div>
    </div>
  );
}
