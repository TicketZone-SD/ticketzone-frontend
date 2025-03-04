import EventCarousel from "@/components/EventCarousel";

export default function Initial() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Explore Eventos</h1>
      <EventCarousel />
    </div>
  );
}
