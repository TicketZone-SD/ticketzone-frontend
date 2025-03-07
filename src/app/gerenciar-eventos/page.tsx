"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/utils/utils";
import { useRouter } from "next/navigation";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { Event } from "@/interfaces/event";
import { getEventByOrganizer, createEvent, updateEvent, deleteEvent } from "@/services/nestjs/eventService";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categoryMap: { [key: number]: string } = {
  1: "Música",
  2: "Tecnologia",
  3: "Teatro",
  4: "Esportes",
};

export default function ManageEvents() {
  const { toast } = useToast();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await getEventByOrganizer(user.id);
        setEvents(data);
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

    if (user.id) fetchEvents();
  }, [user.id, toast]);

  const handleTicketTypes = () => {
    router.push("/tipos-ingresso");
  };

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedEvent({
      id: 0,
      name: "",
      description: "",
      local: "",
      date: "",
      capacity: 0,
      price: 0,
      category_id: 1,
      organizer: user.id,
    });
    setOpen(true);
  };

  const handleEdit = (event: Event) => {
    setIsCreating(false);
    setSelectedEvent({
      ...event,
      date: new Date(event.date).toISOString().split("T")[0],
    });
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selectedEvent) return;
    const { name, value } = e.target;

    setSelectedEvent((prev) => {
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


  const handleCategoryChange = (value: string) => {
    setSelectedEvent((prev) => prev && { ...prev, category_id: Number(value) });
  };

  const handleSave = async () => {
    if (!selectedEvent) return;

    try {
      const eventData = {
        ...selectedEvent,
        role: user.role === "Organizer" ? "organizer" : "client",
      };

      if (isCreating) {
        const newEvent = await createEvent(eventData);
        setEvents((prev) => [...prev, newEvent]);
      } else {
        const updatedEvent = await updateEvent(eventData);
        setEvents((prev) => prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
      }
      toast({ title: "Sucesso!", description: `Evento ${isCreating ? "criado" : "atualizado"} com sucesso.` });
      setOpen(false);
    } catch {
      toast({ title: "Erro", description: "Não foi possível salvar o evento.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
      toast({ title: "Sucesso!", description: "Evento removido com sucesso." });
    } catch {
      toast({ title: "Erro", description: "Não foi possível remover o evento.", variant: "destructive" });
    }
  };

  return (
    <PrivateRoute>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meus Eventos</h1>
          <div className="flex space-x-2">
            <Button onClick={handleCreate}>Criar Evento</Button>
            <Button onClick={handleTicketTypes}>Tipos de Ingresso</Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-600 text-center font-semibold">Erro ao carregar os eventos.</p>
        ) : (
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
                  <TableCell>{categoryMap[event.category_id ?? 0] || "Outros"}</TableCell>
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
        )}

        {/* Modal de Criação/Edição */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isCreating ? "Criar Evento" : "Editar Evento"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input type="text" name="name" value={selectedEvent?.name || ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea name="description" value={selectedEvent?.description || ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label>Local</Label>
                <Input type="text" name="local" value={selectedEvent?.local || ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" name="date" value={selectedEvent?.date || ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label>Capacidade</Label>
                <Input type="number" name="capacity" value={selectedEvent?.capacity || 0} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label>Preço</Label>
                <Input type="text" name="price" value={selectedEvent?.price ? formatPrice(selectedEvent.price) : ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={String(selectedEvent?.category_id)} onValueChange={handleCategoryChange}>
                <SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryMap).map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>

              <Button onClick={handleSave} className="w-full mt-4">
                {isCreating ? "Criar Evento" : "Salvar Alterações"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  );
}
