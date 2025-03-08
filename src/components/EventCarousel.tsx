"use client";

import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/utils";
import { getEvents } from "@/services/nestjs/eventService";
import EventDetailsModal from "./ui/EventDetailsModal";
import { CartItem, Event } from "@/interfaces/event";

export default function EventCarousel() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await getEvents();
        setEvents(data.slice(0, 3)); // Pegando apenas os 3 primeiros eventos
      } catch {
        setError(true);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os eventos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setQuantity(1);
    setOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedEvent) return;

    const newItem: CartItem = { ...selectedEvent, quantity };

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...prevCart, newItem];
    });

    toast({
      title: "Adicionado ao carrinho!",
      description: `Você adicionou ${quantity} ingresso(s) para "${selectedEvent.name}".`,
    });

    setOpen(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-semibold">Erro ao carregar eventos.</p>
      ) : (
        <Carousel className="w-full">
          <CarouselContent>
            {events.map((event) => (
              <CarouselItem key={event.id} className="p-4">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{event.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      📍 {event.local} | 📅 {formatDate(event.date)}
                    </p>
                    <p className="text-sm text-gray-500">🎟️ Capacidade: {event.capacity} pessoas</p>
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
      )}

      {/* Modal de Detalhes do Evento */}
      <EventDetailsModal
        open={open}
        setOpen={setOpen}
        selectedEvent={selectedEvent}
        handleAddToCart={handleAddToCart}
        quantity={quantity}
        setQuantity={setQuantity}
      />
    </div>
  );
}
