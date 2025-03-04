import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EventCarousel from "@/components/EventCarousel";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Bem-vindo!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Você está logado com sucesso.</p>
        </CardContent>
      </Card>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-6">Explore Eventos</h1>
        <EventCarousel />
      </div>
    </div>
  );
}
