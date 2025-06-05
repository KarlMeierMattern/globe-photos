import { Plus } from "lucide-react";

export default function FormIcon({
  setModalIcon,
}: {
  setModalIcon: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <button
      className="absolute top-8 right-8 z-50 p-2 bg-white rounded-full cursor-pointer"
      onClick={() => setModalIcon(true)}
    >
      <Plus />
    </button>
  );
}
