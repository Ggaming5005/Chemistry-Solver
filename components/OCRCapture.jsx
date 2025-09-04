"use client";
import { useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";

export default function OCRCapture({ onText, lang = "en" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [highQuality, setHighQuality] = useState(false);

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (e) {
      alert(
        lang === "ka"
          ? "კამერაზე წვდომა ვერ მოხერხდა"
          : "Unable to access camera"
      );
    }
  }

  function stopCamera() {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  }

  async function captureAndRecognize() {
    if (!videoRef.current || !canvasRef.current) return;
    setProcessing(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = preprocessToDataUrl(canvas, highQuality ? 2.5 : 2);
      const res = await Tesseract.recognize(dataUrl, "eng", {
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-=()[]{}.,→⇌>< ",
        preserve_interword_spaces: "1",
        user_defined_dpi: "300",
        psm: 6,
      });
      const text = res?.data?.text?.trim();
      if (text) onText(text);
      else
        alert(lang === "ka" ? "ტექსტი ვერ ამოვიკითხეთ" : "No text recognized");
    } catch (e) {
      alert(lang === "ka" ? "შეცდომა OCR-ში" : "OCR error");
    } finally {
      setProcessing(false);
    }
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      await img.decode();
      const canvas = canvasRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataUrl = preprocessToDataUrl(canvas, highQuality ? 2.5 : 2);
      const res = await Tesseract.recognize(dataUrl, "eng", {
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-=()[]{}.,→⇌>< ",
        preserve_interword_spaces: "1",
        user_defined_dpi: "300",
        psm: 6,
      });
      const text = res?.data?.text?.trim();
      if (text) onText(text);
      else
        alert(lang === "ka" ? "ტექსტი ვერ ამოვიკითხეთ" : "No text recognized");
    } catch (err) {
      alert(lang === "ka" ? "შეცდომა OCR-ში" : "OCR error");
    } finally {
      setProcessing(false);
      e.target.value = "";
    }
  }

  function preprocessToDataUrl(sourceCanvas, scale = 2) {
    const w = Math.max(1, Math.floor(sourceCanvas.width * scale));
    const h = Math.max(1, Math.floor(sourceCanvas.height * scale));
    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    const octx = out.getContext("2d");
    octx.drawImage(sourceCanvas, 0, 0, w, h);
    const imgData = octx.getImageData(0, 0, w, h);
    const d = imgData.data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) {
      const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      sum += g;
    }
    const avg = sum / (d.length / 4);
    const threshold = Math.max(100, Math.min(180, avg + 10));
    for (let i = 0; i < d.length; i += 4) {
      const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      const v = g > threshold ? 255 : 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    octx.putImageData(imgData, 0, 0);
    return out.toDataURL("image/png");
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={highQuality}
            onChange={(e) => setHighQuality(e.target.checked)}
          />
          {lang === "ka" ? "მაღალი სიზუსტე (ნელა)" : "High accuracy (slower)"}
        </label>
        {!streaming ? (
          <button
            type="button"
            onClick={startCamera}
            className="px-3 py-1.5 rounded-md border text-sm bg-gray-50 hover:bg-gray-100"
          >
            {lang === "ka" ? "კამერის გაშვება" : "Start camera"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={captureAndRecognize}
              disabled={processing}
              className="px-3 py-1.5 rounded-md border text-sm bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
            >
              {processing
                ? lang === "ka"
                  ? "ამოცნობა..."
                  : "Recognizing..."
                : lang === "ka"
                ? "სურათის აღება"
                : "Capture"}
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-3 py-1.5 rounded-md border text-sm bg-gray-50 hover:bg-gray-100"
            >
              {lang === "ka" ? "გაჩერება" : "Stop"}
            </button>
          </>
        )}
        <label className="px-3 py-1.5 rounded-md border text-sm bg-gray-50 hover:bg-gray-100 cursor-pointer">
          {lang === "ka" ? "სურათის ატვირთვა" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      </div>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-md border"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
