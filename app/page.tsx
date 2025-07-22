import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-6xl font-bold">Northbound AI</h1>
        <p className="mt-4 text-2xl text-gray-600">Day 1: The Journey Begins.</p>
      </main>
    </div>
  );
}
