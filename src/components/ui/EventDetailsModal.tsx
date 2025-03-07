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
import { useEffect } from "react";
import { EventDetailsModalProps } from "@/interfaces/event";

export default function EventDetailsModal({
  open,
  setOpen,
  selectedEvent,
  handleAddToCart,
  quantity,
  setQuantity,
}: EventDetailsModalProps) {

  // Sempre resetar a quantidade quando o modal for aberto
  useEffect(() => {
    if (open) setQuantity(1);
  }, [open, setQuantity]);

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
            <p><strong>Preço:</strong> R$ {selectedEvent.price.toFixed(2)}</p>

            {/* Seletor de Quantidade */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((prev: number) => Math.max(1, prev - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-lg font-bold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((prev: number) => prev + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button onClick={() => handleAddToCart(quantity)} className="w-full">
              Adicionar ao Carrinho
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
