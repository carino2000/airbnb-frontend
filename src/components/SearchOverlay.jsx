//모달 + 슬라이드 애니메이션
export default function SearchOverlay({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[9998]">
      <div className="animate-slideDown pt-[120px]">{children}</div>

      <div
        className="absolute top-0 left-0 w-full h-full"
        onClick={onClose}
      ></div>
    </div>
  );
  
}
