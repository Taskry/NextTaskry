const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen text-2xl font-bold text-main-400">
      <div
        className="
          animate-spin
          rounded-full
          h-10
          w-10
          border-4
          border-main-200
          border-t-main-400
          mr-2
        "
      ></div>
      Loading...
    </div>
  );
};

export default LoadingSpinner;