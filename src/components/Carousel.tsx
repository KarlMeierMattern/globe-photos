import type { Picture } from "@/utils/types";
import Image from "next/image";

export default function Carousel({
  modalPictures,
  currentPicIdx,
  setModalPictures,
  handlePrev,
  handleNext,
}: {
  modalPictures: Picture[] | null;
  currentPicIdx: number;
  setModalPictures: (pictures: Picture[] | null) => void;
  handlePrev: (e: React.MouseEvent) => void;
  handleNext: (e: React.MouseEvent) => void;
}) {
  return (
    <>
      {modalPictures && modalPictures.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50"
          onClick={() => setModalPictures(null)}
        >
          <div
            className="bg-white p-4 rounded shadow pointer-events-auto flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={modalPictures[currentPicIdx].data}
              alt={modalPictures[currentPicIdx].name}
              className="max-w-xs max-h-96 mb-2"
              width={100}
              height={100}
            />
            <p>{modalPictures[currentPicIdx].description}</p>
            <div className="flex gap-4 items-center">
              <button
                onClick={handlePrev}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 cursor-pointer"
              >
                Prev
              </button>
              <span>
                {currentPicIdx + 1} / {modalPictures.length}
              </span>
              <button
                onClick={handleNext}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
