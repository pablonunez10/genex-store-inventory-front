interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text text-gray-700 font-semibold text-sm">
            {label}
          </span>
        </label>
      )}
      <textarea
        {...props}
        className={`input-modern min-h-[100px] resize-y ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''} ${className}`}
      />
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
