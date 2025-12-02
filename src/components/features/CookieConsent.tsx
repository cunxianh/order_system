import { useCookie } from "../../context/CookieCotext";

export default function CookieConsent() {
  const { accepted, acceptCookies } = useCookie();

  if (accepted) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 flex flex-col md:flex-row justify-between items-center gap-4 z-50">
      <span>本網站使用 Cookie 以提升體驗 🍪</span>

      <button
        onClick={acceptCookies}
        className="bg-amber-400 text-black px-4 py-2 rounded hover:bg-amber-500 transition"
      >
        接受
      </button>
    </div>
  );
}