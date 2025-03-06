"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

function formatDateToBR(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

interface Event {
  id: number;
  name: string;
  description: string;
  local: string;
  date: string;
  capacity: number;
  price: number;
}

export default function EventCarousel() {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleAddToCart = (event: Event) => {
    alert(`Evento "${event.name}" adicionado ao carrinho!`);
  };

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
                    📍 {event.local} | 📅 {formatDateToBR(event.date)}
                  </p>
                  <p className="text-lg font-bold mt-2">R$ {event.price.toFixed(2)}</p>
                  <Button className="mt-4 w-full" onClick={() => handleEventDetails(event)}>
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Modal de Detalhes do Evento */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Evento</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <p className="font-semibold">Evento: {selectedEvent.name}</p>
              <p><strong>Descrição:</strong> {selectedEvent.description}</p>
              <p><strong>Local:</strong> {selectedEvent.local}</p>
              <p><strong>Data:</strong> {formatDateToBR(selectedEvent.date)}</p>
              <p><strong>Capacidade:</strong> {selectedEvent.capacity} pessoas</p>
              <p><strong>Preço:</strong> R$ {selectedEvent.price.toFixed(2)}</p>
              <Button onClick={() => handleAddToCart(selectedEvent)}  className="w-full">
                Adicionar ao Carrinho
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
