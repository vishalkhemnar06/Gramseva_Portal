// client/src/components/common/FileInputField.jsx
import React from 'react';

const FileInputField = ({
  id,
  label,
  name,
  multiple = false,
  onChange,
  required = false,
  disabled = false,
  accept = "image/*",
  error,
  className = '',
}) => {
  const baseStyle = "border rounded focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent";
  const errorStyle = error ? "border-red-500 focus-within:ring-red-500" : "border-gray-300";

  return (
    <div className={`${className}`}>
      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor={id || name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`flex items-center ${baseStyle} ${errorStyle}`}>
        <label htmlFor={id || name} className="bg-gray-100 px-3 py-2 text-gray-600 text-sm cursor-pointer hover:bg-gray-200 rounded-l whitespace-nowrap">
          Choose {multiple ? 'Files' : 'File'}
        </label>
        <span className="py-2 px-3 text-gray-500 text-sm truncate flex-grow">
          No {multiple ? 'files' : 'file'} chosen
        </span>
        <input
          className="absolute w-[1px] h-[1px] opacity-0 overflow-hidden z-[-1]" // Hide default input visually
          id={id || name}
          name={name}
          type="file"
          accept={accept}
          onChange={onChange}
          required={required}
          disabled={disabled}
          multiple={multiple}
        />
      </div>
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default FileInputField;