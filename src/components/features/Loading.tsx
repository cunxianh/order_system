import { useGlobalLoading } from "../../context/LoadingContext";

export default function GlobalLoading() {
    const isLoading = useGlobalLoading();
    if (!isLoading) return null;

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full border-8 border-pink-300 border-t-transparent animate-spin mx-auto" />
        <p className="text-pink-200 mt-6 text-lg">拼命載入中～</p>
      </div>
    </div>
  );
}