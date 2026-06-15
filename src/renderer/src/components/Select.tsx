export type Option = {
  value: number;
  label: string;
}

interface SelectProps {
  value: Option | undefined,
  onChange: (newValue: Option) => void,
  options: Array<Option>,
  label: string,
  className?: string
}

export default function Select({
  value, onChange, options, label, className
}: SelectProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <select
        className="w-full rounded-md border border-gray-600 bg-[#1b1b1f] p-2 text-white outline-none focus:border-blue-500"
        value={value?.value ?? 'default'}
        onChange={(e) => onChange(options.find(option => option.value === Number(e.target.value)) ?? { value: -1, label: '-1' })}
      >
        <option value="default" disabled>Selecione uma coluna</option>
        {options.map((option, index) => (
          <option key={`${option}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}