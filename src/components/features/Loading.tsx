import { useGlobalLoading } from "../../context/LoadingContext";

export default function GlobalLoading() {
  const isLoading = useGlobalLoading();
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm transition-opacity">
      <div className="relative flex flex-col items-center">
        {/* 外層光暈與旋轉圈 */}
        <div className="relative">
          {/* 靜態背景圈 (增加層次) */}
          <div className="w-20 h-20 rounded-full border-4 border-pink-200/20" />

          {/* 動態旋轉圈 (帶有發光效果) */}
          <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-pink-400 border-t-transparent animate-spin shadow-[0_0_15px_rgba(244,114,182,0.5)]" />

          
        </div>

        {/* 文字區塊：加入呼吸效果與字距 */}
        <div className="mt-6 text-center">
          <p className="text-pink-100 text-lg font-medium tracking-widest animate-pulse">
            存取資料中
          </p>
          <p className="mt-6 text-pink-200 font-bold text-xl tracking-wider">
            LOADING
            <span className="animate-[pulse_1s_infinite]">...</span>
          </p>
        </div>
      </div>
    </div>
  );
}