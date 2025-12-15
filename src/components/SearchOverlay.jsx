export default function SearchOverlay({ onClose, children }) {
  return (
    <>
      {/* 배경 */}
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />

      {/* 슬라이드 헤더 */}
      <div
        className="fixed top-0 left-0 w-full bg-white z-60
                   transition-transform duration-300 ease-out
                   translate-y-0"
      >
        {children}
      </div>
    </>
  );
}
