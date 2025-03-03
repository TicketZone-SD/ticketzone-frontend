"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockEvents = [
  {
    id: 1,
    name: "Festival de Música",
    description: "Um evento incrível com várias bandas ao vivo!",
    local: "Recife, PE",
    date: "2025-03-15",
    capacity: 500,
    price: 120.0,
  },
  {
    id: 2,
    name: "Tech Conference",
    description: "A maior conferência de tecnologia do Brasil.",
    local: "São Paulo, SP",
    date: "2025-04-20",
    capacity: 1000,
    price: 300.0,
  },
  {
    id: 3,
    name: "Teatro Clássico",
    description: "Uma peça teatral emocionante no centro da cidade.",
    local: "Rio de Janeiro, RJ",
    date: "2025-05-10",
    capacity: 300,
    price: 80.0,
  },
];

export default function EventCarousel() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {mockEvents.map((event) => (
            <CarouselItem key={event.id} className="p-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{event.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    📍 {event.local} | 📅 {event.date}
                  </p>
                  <p className="text-lg font-bold mt-2">R$ {event.price.toFixed(2)}</p>
                  <Button className="mt-4 w-full">Ver Detalhes</Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
