export default function StepProgress({
  current,
  total = 4,
}: {
  current: number;
  total?: number;
}) {
  return (
    <div className="flex gap-2 mb-4">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-10 rounded-full ${
            i < current ? "bg-[#1DA97A]" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}