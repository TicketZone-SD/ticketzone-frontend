"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { formatDate } from "@/utils/utils";
import { useEffect, useState } from "react";
import { EventDetailsModalProps } from "@/interfaces/event";
import { User } from "@/interfaces/user";
import { getTicketTypesByEvent } from "@/services/nestjs/ticketTypeService";
import { TicketQuantities, TicketType } from "@/interfaces/ticketType";
import { CartItem } from "@/interfaces/order";

export default function EventDetailsModal({
  open,
  setOpen,
  selectedEvent,
  handleAddToCart,
}: EventDetailsModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketQuantities, setTicketQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (open && selectedEvent) {
      fetchTicketTypes();
      setTicketQuantities({});
    }
  }, [open, selectedEvent]);

  const fetchTicketTypes = async () => {
    try {
      if (selectedEvent) {
        const tickets = await getTicketTypesByEvent(selectedEvent.id);
        setTicketTypes(tickets);

        const initialQuantities: TicketQuantities = tickets.reduce((acc: TicketQuantities, ticket: TicketType) => {
          acc[ticket.id] = 0; // Agora começa com 0 para evitar inclusão automática
          return acc;
        }, {});
        setTicketQuantities(initialQuantities);
      } else {
        throw new Error("Evento não selecionado.");
      }
    } catch (error) {
      console.error("Erro ao buscar tipos de ingressos", error);
    }
  };

  const handleQuantityChange = (ticketId: number, increment: boolean) => {
    setTicketQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + (increment ? 1 : -1)), // Permite zerar
    }));
  };

  const handleAddTicketsToCart = () => {
    if (!selectedEvent) return;

    const itemsToAdd: CartItem[] = ticketTypes
      .filter((ticket) => ticketQuantities[ticket.id] && ticketQuantities[ticket.id] > 0) // Agora ignora os que estão em 0
      .map((ticket) => ({
        event_id: selectedEvent.id,
        event_name: selectedEvent.name,
        ticket_type_id: ticket.id,
        ticket_name: ticket.name,
        price: ticket.price,
        quantity: ticketQuantities[ticket.id],
        total_price: ticket.price * ticketQuantities[ticket.id],
      }));

    if (itemsToAdd.length === 0) {
      return; // Evita adicionar um carrinho vazio
    }

    handleAddToCart(itemsToAdd);
    setOpen(false);
  };

  return (
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
            <p><strong>Data:</strong> {formatDate(selectedEvent.date)}</p>
            <p><strong>Capacidade:</strong> {selectedEvent.capacity} pessoas</p>

            {/* Exibir tipos de ingressos */}
            <div>
              <p className="font-semibold">Tipos de Ingressos:</p>
              {ticketTypes.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {ticketTypes.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3 border rounded-md border-gray-300"
                    >
                      <p className="font-medium">{ticket.name}</p>
                      <p className="text-sm text-gray-600">{ticket.description}</p>
                      <p className="font-bold">R$ {ticket.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Capacidade: {ticket.capacity}</p>

                      {/* Seletor de Quantidade */}
                      {user && (
                        <div className="flex items-center gap-4 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(ticket.id, false)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-lg font-bold">
                            {ticketQuantities[ticket.id] || 0} {/* Exibe 0 se não for setado */}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(ticket.id, true)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nenhum ingresso disponível.</p>
              )}
            </div>

            {/* Botão Adicionar ao Carrinho */}
            {user && (
              <Button
                onClick={handleAddTicketsToCart}
                className="w-full mt-4"
                disabled={ticketTypes.length === 0}
              >
                Adicionar ao Carrinho
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
