"use client";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/utils/utils";
import { useRouter } from "next/navigation";

// Mock: Categorias baseadas no ID
const categoryMap: { [key: number]: string } = {
  1: "Música",
  2: "Tecnologia",
  3: "Teatro",
  4: "Esportes",
};

// Mock: Eventos do organizador logado
const mockEvents = [
  { id: 1, name: "Festival de Música", description: "Um show incrível", local: "Recife", date: "2025-03-15", capacity: 500, price: 120, organizer: 2, category_id: 1 },
  { id: 2, name: "Tech Conference", description: "Evento de tecnologia", local: "São Paulo", date: "2025-04-20", capacity: 1000, price: 300, organizer: 2, category_id: 2 },
  { id: 3, name: "Peça Teatral", description: "Teatro clássico", local: "Rio de Janeiro", date: "2025-05-10", capacity: 300, price: 80, organizer: 2, category_id: 3 },
];

export default function ManageEvents() {
  const [events, setEvents] = useState(mockEvents); // Usa os eventos mockados
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<EventFormData | null>(null);
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  interface EventFormData {
    id: number;
    name: string;
    description: string;
    local: string;
    date: string;
    capacity: number;
    price: number;
    category_id: number;
    organizer: number;
  }

  const initialFormData: EventFormData = {
    id: events.length + 1,
    name: "",
    description: "",
    local: "",
    date: "",
    capacity: 0,
    price: 0,
    category_id: 1,
    organizer: 2,
  };

  const [formData, setFormData] = useState<EventFormData>(initialFormData);

  const handleTicketTypes = () => {
    router.push("/tipos-ingresso");
  }

  const handleCreate = () => {
    setIsCreating(true);
    setFormData(initialFormData);
    setOpen(true);
  };

  // Abrir modal para edição
  const handleEdit = (event: EventFormData) => {
    setSelectedEvent(event);
    setFormData({
      ...event,
      date: new Date(event.date).toISOString().split("T")[0], // Corrige a data
    });
    setOpen(true);
  };

  // Atualizar form ao editar
  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? parseFloat(value) || 0 : value
    });
  };

  // Salvar evento atualizado
  const handleSave = () => {
    const updatedEvents = events.map((ev) => (ev.id === formData.id ? formData : ev));
    setEvents(updatedEvents);
    setOpen(false);
  };

  // Remover evento
  const handleDelete = (id: number) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Eventos</h1>
        <div className="flex space-x-2">
          <Button onClick={handleCreate}>Criar Evento</Button>
          <Button onClick={handleTicketTypes}>Tipos de Ingresso</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Capacidade</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.description || "Sem descrição"}</TableCell>
              <TableCell>{event.local}</TableCell>
              <TableCell>{formatDate(event.date)}</TableCell>
              <TableCell>{event.capacity}</TableCell>
              <TableCell>R$ {Number(event.price).toFixed(2)}</TableCell>
              <TableCell>{categoryMap[event.category_id] || "Outros"}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDelete(event.id)}>
                  Remover
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de Criação/Edição */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isCreating ? "Criar Evento" : "Editar Evento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label>Local</Label>
              <Input type="text" name="local" value={formData.local} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label>Capacidade</Label>
              <Input type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label>Preço</Label>
              <Input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} />
            </div>

            <Button onClick={handleSave} className="w-full mt-4">
              {isCreating ? "Criar Evento" : "Salvar Alterações"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
