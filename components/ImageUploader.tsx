
import React, { useRef } from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  onFileSelect: (file: File) => void;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, icon, onFileSelect, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div 
      className="relative w-full aspect-square bg-white rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
      onClick={handleAreaClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        id={id}
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {previewUrl ? (
        <img src={previewUrl} alt={label} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
      ) : (
        <>
          {icon}
          <span className="mt-2 font-semibold text-gray-600">{label}</span>
          <span className="text-sm text-gray-500">Click or drag & drop</span>
        </>
      )}
    </div>
  );
};
