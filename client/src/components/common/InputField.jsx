// client/src/components/common/InputField.jsx
import React from 'react';

const InputField = ({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  min,
  max,
  maxLength,
  className = '',
}) => {
  const baseStyle = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const errorStyle = error ? "border-red-500 focus:ring-red-500" : "border-gray-300";
  const disabledStyle = disabled ? "bg-gray-100 cursor-not-allowed" : "";

  return (
    <div className={`${className}`}>
      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor={id || name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className={`${baseStyle} ${errorStyle} ${disabledStyle}`}
        id={id || name}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        maxLength={maxLength}
      />
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default InputField;