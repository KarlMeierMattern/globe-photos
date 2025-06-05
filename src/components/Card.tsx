import type { Label } from "@/utils/types";

export default function Card({ modalLabel }: { modalLabel: Label | null }) {
  return (
    <>
      {modalLabel && (
        <div className="absolute top-8 left-8 bg-white p-4 rounded shadow pointer-events-auto z-50">
          <h2 className="text-lg font-bold mb-2">{modalLabel.text}</h2>
          <p>Lat: {modalLabel.lat}</p>
          <p>Lng: {modalLabel.lng}</p>
        </div>
      )}
    </>
  );
}
