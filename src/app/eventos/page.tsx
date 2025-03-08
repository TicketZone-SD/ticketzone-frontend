/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/utils";
import { Event } from "@/interfaces/event";
import { getEvents } from "@/services/nestjs/eventService";
import EventDetailsModal from "@/components/ui/EventDetailsModal";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { CartItem } from "@/interfaces/order";

export default function EventsPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean | string>(false);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError("Erro ao buscar eventos. Tente novamente mais tarde.");
        toast({
          title: "Erro",
          description: (err as any)?.response?.data?.message || "Não foi possível carregar os eventos.",
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
    setOpen(true);
  };

  const handleAddToCart = (itemsToAdd: CartItem[]) => {
    if (!itemsToAdd.length) return;

    setCart((prevCart) => {
      const updatedCart = [...prevCart];

      itemsToAdd.forEach((newItem) => {
        const existingItemIndex = updatedCart.findIndex(
          (item) =>
            item.event_id === newItem.event_id &&
            item.ticket_type_id === newItem.ticket_type_id
        );

        if (existingItemIndex !== -1) {
          // Se o ingresso já existe no carrinho, soma a quantidade
          updatedCart[existingItemIndex].quantity += newItem.quantity;
          updatedCart[existingItemIndex].total_price += newItem.total_price;
        } else {
          // Se não existe, adiciona
          updatedCart.push(newItem);
        }
      });

      return updatedCart;
    });

    toast({
      title: "Adicionado ao carrinho!",
      description: `Ingressos adicionados com sucesso.`,
    });

    setOpen(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-red-600 text-lg font-semibold">Erro ao carregar os eventos.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <PrivateRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Eventos Disponíveis</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="shadow-lg hover:shadow-xl transition">
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  📍 {event.local} | 📅 {formatDate(event.date)}
                </p>
                <p className="text-lg font-bold mt-2">R$ {event.price.toFixed(2)}</p>
                <Button className="mt-4 w-full" onClick={() => handleEventDetails(event)}>
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal de Detalhes do Evento */}
        <EventDetailsModal
          open={open}
          setOpen={setOpen}
          selectedEvent={selectedEvent}
          handleAddToCart={handleAddToCart}
        />
      </div>
    </PrivateRoute>
  );
}
