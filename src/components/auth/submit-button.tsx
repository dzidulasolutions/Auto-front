import { IconlyArrowRight, IconlyLoader } from "@/components/ui/icons";

export default function SubmitButton({ label, loading }: { label: string; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full h-11 flex justify-between pl-4 pr-1 items-center bg-white mt-3 text-black font-ui text-sm font-medium disabled:opacity-60"
    >
      {label}
      <span className="w-10 h-9 bg-black text-white flex justify-center items-center">
        {loading ? (
          <IconlyLoader color="currentColor" size={20} />
        ) : (
          <IconlyArrowRight color="currentColor" size={24} />
        )}
      </span>
    </button>
  );
}