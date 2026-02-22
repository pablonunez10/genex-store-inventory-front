interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export default function Select({ label, error, className = '', children, ...props }: SelectProps) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text text-gray-700 font-semibold text-sm">
            {label}
          </span>
        </label>
      )}
      <select
        {...props}
        className={`input-modern cursor-pointer ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''} ${className}`}
      >
        {children}
      </select>
      {error && (
        <label className="label">
          <span className="label-text-alt text-red-500 font-medium animate-fadeIn">
            {error}
          </span>
        </label>
      )}
    </div>
  );
}
