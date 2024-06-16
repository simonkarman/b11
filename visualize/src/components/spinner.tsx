export const Spinner = (props: { size?: 'sm' | 'md' | 'lg' }) => {
  const size = props.size || 'md';
  const sizeMap = {
    sm: 'h-6 w-6 border-[6px]',
    md: 'h-12 w-12 border-[8px]',
    lg: 'h-24 w-24 border-[16px]',
  };
  return (
    <div className={`${sizeMap[size]} animate-spin rounded-full border-t-gray-500 border-gray-300`} />
  );
}
