interface SelectProps {
  value: any,
  onChange: (newValue: any) => void,
  options: Array<any>,
  label: string
}

export default function Select({
  value, onChange, options, label
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <select
        className="w-full rounded-md border border-gray-600 bg-[#1b1b1f] p-2 text-white outline-none focus:border-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>Selecione uma coluna</option>
        {options.map((option, index) => (
          <option key={`${option}-${index}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}