const Spinner = ({ size = 'md', color = 'indigo', className = '' }) => {
  const sizeClasses = {
    xs: 'h-3 w-3 border-2',
    sm: 'h-4 w-4 border-2',
    md: 'h-7 w-7 border-2',
    lg: 'h-10 w-10 border-2',
    xl: 'h-14 w-14 border-3',
  };

  const colorClasses = {
    indigo: 'border-indigo-900 border-t-indigo-500',
    purple: 'border-purple-900 border-t-purple-500',
    cyan: 'border-cyan-900 border-t-cyan-500',
    white: 'border-white/20 border-t-white',
    slate: 'border-slate-800 border-t-slate-400',
    // Legacy support
    blue: 'border-indigo-900 border-t-indigo-500',
    gray: 'border-slate-800 border-t-slate-400',
    green: 'border-indigo-900 border-t-indigo-500',
    red: 'border-red-900 border-t-red-500',
  };

  return (
    <div
      className={`animate-spin rounded-full ${colorClasses[color] || colorClasses.indigo} ${sizeClasses[size]} ${className}`}
    />
  );
};

export default Spinner;
