import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ eventId }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const startScanner = () => {
    setResult(null);
    setError(null);

    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode("qr-reader");
    }

    html5QrCodeRef.current
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          setScanning(false);
          html5QrCodeRef.current?.stop().catch(() => {});
          document.getElementById("qr-reader").innerHTML = "";

          console.log("Scanned code:", decodedText);
          setResult("Verifying ticket...");

          const response = await fetch(
            "http://localhost:3000/api/validate-ticket",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ticketCode: decodedText, eventId }),
            }
          );

          const data = await response.json();

          if (response.ok) {
            setResult(`✅ Ticket valid for: ${data.userName}`);
          } else {
            setError(`❌ Invalid ticket: ${data.error}`);
          }
        },
        (err) => {
          console.warn("Scan error", err);
        }
      )
      .then(() => setScanning(true))
      .catch((err) => {
        console.error("Start failed", err);
        setError("Camera not accessible or already in use.");
      });
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current && scanning) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          setScanning(false);
          document.getElementById("qr-reader").innerHTML = "";
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err.message);
        });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">
        QR Code Scanner
      </h2>

      {!scanning && (
        <button
          onClick={startScanner}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mb-4"
        >
          Start Scanning
        </button>
      )}

      {scanning && (
        <button
          onClick={stopScanner}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md mb-4"
        >
          Stop Scanning
        </button>
      )}

      <div id="qr-reader" className="w-full max-w-md mx-auto"></div>

      {result && <p className="mt-4 text-green-600 font-semibold">{result}</p>}
      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
