export default function SampleSkeleton() {
  return (
    <div className="p-4">
      <div className="p-2 mb-5 border-1 border-main-300">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>

      {[1, 2, 3, 4].map((section) => (
        <div key={section} className="grid grid-cols-10 gap-2 mb-6">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse mb-1"></div>

              <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
