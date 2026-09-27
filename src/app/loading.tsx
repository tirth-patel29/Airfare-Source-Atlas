export default function Loading() {
  return (
    <div className="page-container animate-pulse py-10" aria-label="Loading registry">
      <div className="h-8 w-56 rounded bg-[#e5e5e7]" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-[#e5e5e7]" />
      <div className="mt-8 h-14 rounded-xl bg-[#e5e5e7]" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-14 rounded-lg bg-[#e5e5e7]" />
        ))}
      </div>
    </div>
  );
}