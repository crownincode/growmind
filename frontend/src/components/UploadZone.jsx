import { useState, useRef } from 'react';

export default function UploadZone({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-green-500 bg-green-50'
            : 'border-green-300 hover:border-green-400 hover:bg-green-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
        />
        
        {selectedFile ? (
          <div className="space-y-4">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg shadow-md object-contain"
            />
            <p className="text-sm text-gray-600 truncate">{selectedFile.name}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-700 font-medium">
                Drag & drop your plant photo here
              </p>
              <p className="text-gray-500 text-sm mt-1">
                or click to select
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Supports: JPG, PNG, WEBP
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
