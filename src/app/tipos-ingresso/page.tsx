"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { useToast } from "@/hooks/use-toast";
import { TicketType, TicketTypeSold, TicketTypeSoldTotal } from "@/interfaces/ticketType";
import { Event } from "@/interfaces/event";
import {
  getTicketTypes,
  createTicketType,
  updateTicketType,
  deleteTicketType,
} from "@/services/nestjs/ticketTypeService";
import { getEvents, getSoldByEvent, getTicketSoldByEvent } from "@/services/nestjs/eventService";
import { formatPrice } from "@/utils/utils";

export default function TicketTypesPage() {
  const { toast } = useToast();
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [ticketsSold, setTicketsSold] = useState<{ [key: number]: TicketTypeSold[] }>({});
  const [ticketsTotal, setTicketsTotal] = useState<{ [key: number]: TicketTypeSoldTotal }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const [tickets, events] = await Promise.all([getTicketTypes(), getEvents()]);
        setTicketTypes(tickets);
        setEvents(events);

        // Buscar ingressos vendidos para cada evento
        const ticketsSoldData: { [key: number]: TicketTypeSold[] } = {};
        const ticketsTotalData: { [key: number]: TicketTypeSoldTotal } = {};
        await Promise.all(
          events.map(async (event: Event) => {
            try {
              const [soldTickets, soldTotal] = await Promise.all([getTicketSoldByEvent(event.id), getSoldByEvent(event.id)]);
              ticketsSoldData[event.id] = soldTickets;
              ticketsTotalData[event.id] = soldTotal;
            } catch (err) {
              console.error(`Erro ao buscar ingressos vendidos para o evento ${event.id}`, err);
            }
          })
        );

        setTicketsTotal(ticketsTotalData);
        setTicketsSold(ticketsSoldData);
      } catch {
        setError(true);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os ingressos ou eventos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleEdit = (ticket?: TicketType) => {
    setSelectedTicket(
      ticket || {
        id: 0,
        event_id: 0,
        name: "",
        description: "",
        price: 0,
        capacity: 0,
      }
    );
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selectedTicket) return;
    const { name, value } = e.target;

    setSelectedTicket((prev) => {
      if (!prev) return null;

      let updatedValue: string | number = value;

      if (name === "price") {
        const rawPrice = value.replace(/\D/g, "");
        updatedValue = rawPrice ? parseFloat(rawPrice) / 100 : 0;
      } else if (name === "capacity") {
        updatedValue = Math.max(1, parseInt(value) || 1);
      }

      return { ...prev, [name]: updatedValue };
    });
  };

  const handleSave = async () => {
    if (!selectedTicket) return;

    try {
      if (selectedTicket.id) {
        await updateTicketType(selectedTicket);
        setTicketTypes((prev) =>
          prev.map((t) => (t.id === selectedTicket.id ? selectedTicket : t))
        );
      } else {
        const newTicket = await createTicketType(selectedTicket);
        setTicketTypes((prev) => [...prev, newTicket]);
      }
      toast({
        title: "Sucesso!",
        description: `Ingresso ${selectedTicket.id ? "atualizado" : "criado"} com sucesso.`,
      });
      setOpen(false);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o ingresso.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTicketType(id);
      setTicketTypes((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: "Sucesso!",
        description: "Ingresso removido com sucesso.",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível remover o ingresso.",
        variant: "destructive",
      });
    }
  };

  console.log("TicketTypes", ticketTypes);
  console.log("TicketSOld", ticketsSold);

  return (
    <PrivateRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciar Tipos de Ingressos</h1>

        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : error ? (
          <p className="text-red-600 text-center">Erro ao carregar os ingressos.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="shadow-lg">
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {ticketTypes
                      .filter((ticket) => ticket.event_id === event.id)
                      .map((ticket) => (
                        <li key={ticket.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{ticket.name}</p>
                            <p className="text-sm text-gray-600">{ticket.description}</p>
                            <p className="text-sm font-bold">
                              Vendidos: <span className="text-gray-600">{ticketsSold[event.id]?.find((t) => t.ticketType.name === ticket.name)?.ticketType.sold || 0}/{ticket.capacity}</span>
                            </p>
                            <p className="text-sm font-bold">R$ {ticket.price.toFixed(2)}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(ticket)}>
                              Editar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(ticket.id!)}>
                              Remover
                            </Button>
                          </div>
                        </li>
                      ))}
                  </ul>

                  {/* Exibe os ingressos vendidos para o evento */}
                  <div className="mt-4">
                    <h2 className="text-sm font-bold">Ingressos Vendidos:</h2>
                    {ticketsSold[event.id]?.length > 0 ? (
                      <ul className="text-sm text-gray-600">
                        <li key={"total-sold"}>
                          🎟️ Total - {ticketsTotal[event.id]?.soldTickets || 0}/{event.capacity}
                        </li>
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhum ingresso vendido.</p>
                    )}
                  </div>

                  <Button className="mt-4 w-full" onClick={() => handleEdit({ id: 0, event_id: event.id, name: "", description: "", price: 0, capacity: 0 })}>
                    Adicionar Ingresso
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de Edição/Criação */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTicket?.id ? "Editar Ingresso" : "Novo Ingresso"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input type="text" name="name" value={selectedTicket?.name || ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea name="description" value={selectedTicket?.description || ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label>Preço</Label>
                <Input type="text" name="price" value={selectedTicket?.price ? formatPrice(selectedTicket.price) : ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label>Capacidade</Label>
                <Input type="number" name="capacity" value={selectedTicket?.capacity || ""} onChange={handleChange} />
              </div>

              <Button onClick={handleSave} className="w-full">
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  );
}
