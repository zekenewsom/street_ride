export default function Footer() {
  return (
    <footer className="w-full py-4 px-2 bg-white border-t shadow-md flex items-center justify-center font-sans font-medium text-sm text-gray-500">
      <span className="rounded-lg px-3 py-1 bg-gray-50 shadow-sm text-[10px]">&copy; {new Date().getFullYear()} Street Ride by Zeke & Daniella</span>
    </footer>
  );
}