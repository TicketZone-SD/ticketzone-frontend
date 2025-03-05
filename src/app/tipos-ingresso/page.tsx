"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Mock: Tipos de ingresso por evento
const mockTicketTypes = [
  { id: 1, event_id: 1, name: "Pista", description: "Acesso à pista", price: 100, capacity: 500, sold: 200 },
  { id: 2, event_id: 1, name: "VIP", description: "Área VIP com open bar", price: 250, capacity: 100, sold: 30 },
  { id: 3, event_id: 2, name: "Geral", description: "Acesso geral ao evento", price: 50, capacity: 1000, sold: 400 },
];

// Mock: Eventos do organizador logado
const mockEvents = [
  { id: 1, name: "Festival de Música" },
  { id: 2, name: "Tech Conference" },
  { id: 3, name: "Peça Teatral" },
];

export default function TicketTypesPage() {
  const [ticketTypes, setTicketTypes] = useState(mockTicketTypes);
  const [selectedTicket, setSelectedTicket] = useState<{
    id?: number;
    event_id: number;
    name?: string;
    description?: string;
    price?: number;
    capacity?: number;
    sold?: number;
  } | null>(null);
  const [open, setOpen] = useState(false);

  // Abrir modal para edição/criação
  const handleEdit = (ticket: typeof selectedTicket) => {
      setSelectedTicket({
        id: ticket?.id ?? 0,
        event_id: ticket?.event_id ?? 0,
        name: ticket?.name ?? "",
        description: ticket?.description ?? "",
        price: ticket?.price ?? 0,
        capacity: ticket?.capacity ?? 0,
        sold: ticket?.sold ?? 0, // Garantindo que `sold` sempre tenha um valor numérico
      });
      setOpen(true);
    };

  // Atualizar form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelectedTicket({
      ...selectedTicket!,
      [e.target.name]: e.target.value,
      event_id: selectedTicket?.event_id || 0,
    });
  };

  // Salvar alterações
  const handleSave = () => {
    if (selectedTicket && selectedTicket.id !== undefined) {
      // Atualizar ingresso existente
      setTicketTypes(ticketTypes.map((t) =>
        t.id === selectedTicket.id
          ? { ...selectedTicket, sold: selectedTicket.sold ?? 0 } // Garantindo `sold` sempre presente
          : t
      ));
    } else {
      // Criar novo ingresso
      const newTicket = {
        id: ticketTypes.length > 0 ? Math.max(...ticketTypes.map(t => t.id)) + 1 : 1, // Garante um ID único
        event_id: selectedTicket?.event_id ?? 0,
        name: selectedTicket?.name ?? "Novo Ingresso",
        description: selectedTicket?.description ?? "",
        price: selectedTicket?.price ?? 0,
        capacity: selectedTicket?.capacity ?? 0,
        sold: 0, // Novo ingresso começa com 0 vendidos
      };

      setTicketTypes([...ticketTypes, newTicket]);
    }
    setOpen(false);
  };

  // Remover ingresso
  const handleDelete = (id: number) => {
    setTicketTypes(ticketTypes.filter((t) => t.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Tipos de Ingressos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.map((event) => (
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
                          Vendidos: {ticket.sold}/{ticket.capacity}
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
              <Button className="mt-4 w-full" onClick={() => handleEdit({ event_id: event.id })}>
                Adicionar Ingresso
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Edição/Criação */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTicket?.id ? "Editar Ingresso" : "Novo Ingresso"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Nome</Label>
            <Input type="text" name="name" value={selectedTicket?.name || ""} onChange={handleChange} />

            <Label>Descrição</Label>
            <Textarea name="description" value={selectedTicket?.description || ""} onChange={handleChange} />

            <Label>Preço</Label>
            <Input type="number" name="price" value={selectedTicket?.price || ""} onChange={handleChange} />

            <Label>Capacidade</Label>
            <Input type="number" name="capacity" value={selectedTicket?.capacity || ""} onChange={handleChange} />

            <Label>Ingressos Vendidos</Label>
            <Input type="number" name="sold" value={selectedTicket?.sold?.toString() || "0"} onChange={handleChange} />

            <Button onClick={handleSave} className="w-full">
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
