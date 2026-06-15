export type Option = {
  value: number;
  label: string;
}

interface MultiSelectProps {
  value: Option[];
  onChange: (newValues: Option[]) => void;
  options: Array<Option>;
  label: string;
  className?: string;
}

export default function MultiSelect({
  value, onChange, options, label, className
}: MultiSelectProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <select
        multiple
        size={1}
        className="w-full rounded-md border border-gray-600 bg-[#1b1b1f] p-2 text-white outline-none focus:border-blue-500"
        value={value.map(v => String(v.value))}
        onChange={(e) => {
          const selectedValues = Array.from(e.target.selectedOptions, option => Number(option.value));
          const selectedOptions = options.filter(option => selectedValues.includes(option.value));
          onChange(selectedOptions);
        }}
      >
        {options.map((option, index) => {
          const isSelected = value.some(v => v.value === option.value);

          return (
            <option
              key={`${option.value}-${index}`}
              value={option.value}
              className={`p-2 bg-[#1b1b1f] cursor-pointer checked:bg-blue-500 checked:text-white ${isSelected ? 'bg-blue-600/30 text-blue-400 font-bold' : ''}`}
            >
              {isSelected ? `${option.label}` : `${option.label}`}
            </option>
          );
        })}
      </select>
    </div>
  );
}