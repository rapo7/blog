import { useState } from "preact/hooks";

export interface ImageListProps {
  images: Array<{
    src: string | null | undefined;
    alt: string | null | undefined;
    mh?: number | null | undefined;
  }>;
}

export default function ImageList({ images }: ImageListProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  // Helper for rendering image+caption
  const renderImage = (image: any, idx: number, extraClass = "") => (
    <div key={idx} className="flex flex-col items-center">
      <img
        src={image?.src ?? ""}
        alt={image?.alt ?? ""}
        className={`w-full h-auto object-contain rounded-md cursor-pointer transition-transform duration-200 ${extraClass}`}
        style={{ maxHeight: 320 }}
        onClick={() => setExpandedIdx(idx)}
      />
      <div className="text-center text-sm text-gray-500 mt-2">
        {image?.alt ?? ""}
      </div>
    </div>
  );

  // Expanded modal
  const renderModal = () => {
    if (expandedIdx === null) return null;
    const image = images[expandedIdx];
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        onClick={() => setExpandedIdx(null)}
      >
        <div
          className="relative"
          onClick={e => e.stopPropagation()}
        >
          <img
            src={image?.src ?? ""}
            alt={image?.alt ?? ""}
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
          />
          <div className="text-center text-white text-lg mt-2">
            {image?.alt ?? ""}
          </div>
          <button
            className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full px-3 py-1"
            onClick={() => setExpandedIdx(null)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </div>
    );
  };

  if (images.length === 1) {
    return (
      <div className="image-list">
        {renderImage(images[0], 0)}
        {renderModal()}
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="image-list grid grid-cols-1 md:grid-cols-2 gap-2">
        {images.map((img, i) => renderImage(img, i))}
        {renderModal()}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="image-list grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="md:col-span-1">{renderImage(images[0], 0)}</div>
        <div className="md:col-span-1">{renderImage(images[1], 1)}</div>
        <div className="md:col-span-2">{renderImage(images[2], 2)}</div>
        {renderModal()}
      </div>
    );
  }

  if (images.length === 4) {
    return (
      <div className="image-list grid grid-cols-1 md:grid-cols-2 gap-2">
        {images.map((img, i) => renderImage(img, i))}
        {renderModal()}
      </div>
    );
  }

  // fallback for >4 images
  return (
    <div className="image-list grid grid-cols-1 md:grid-cols-2 gap-2">
      {images.map((img, i) => renderImage(img, i))}
      {renderModal()}
    </div>
  );
}
