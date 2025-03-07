"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { getOrdersByUser } from "@/services/nestjs/orderService";
import { OrderByUser } from "@/interfaces/order";

interface Pedido {
  id: number;
  evento: string;
  descricao: string;
  data: string;
  local: string;
  status: string;
  ingressos: number;
  total: number;
  tipoIngresso: string;
  descricaoIngresso: string;
}

export default function MeusPedidos() {
  const { toast } = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetchPedidos(parsedUser.id);
    } else {
      setLoading(false);
      setError("Usuário não autenticado.");
    }
  }, []);

  const fetchPedidos = async (userId: number) => {
    try {
      const pedidosData = await getOrdersByUser(userId);

      // Ajustando a estrutura dos pedidos para exibição correta
      const pedidosFormatados: Pedido[] = pedidosData.map((pedido: OrderByUser) => ({
        id: pedido.id,
        evento: pedido.event?.name || "Evento desconhecido",
        descricao: pedido.event?.description || "Descrição desconhecida",
        data: new Date(pedido.event?.date).toLocaleString("pt-BR"),
        local: pedido.event?.local || "Local desconhecido",
        status: pedido.status,
        ingressos: pedido.quantity,
        total: pedido.total_price,
        tipoIngresso: pedido.ticketType?.name || "Tipo desconhecido",
        descricaoIngresso: pedido.ticketType?.description || "Descrição desconhecida",
      }));

      setPedidos(pedidosFormatados);
    } catch {
      setError("Erro ao carregar os pedidos.");
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus pedidos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePedidoDetails = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setPedidoSelecionado(null);
  };

  const filteredAndSortedPedidos = pedidos
    .filter((pedido) => pedido.evento.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.evento.localeCompare(b.evento));

  return (
    <PrivateRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>

        {loading ? (
          <p className="text-center">Carregando pedidos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <Input
                type="text"
                placeholder="Pesquisar pedidos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[250px] md:w-[400px] pl-10 rounded-lg"
              />

              {filteredAndSortedPedidos.length === 0 ? (
                <p className="text-center">Nenhum pedido encontrado.</p>
              ) : (
                <div className="space-y-4">
                  {filteredAndSortedPedidos.map((pedido) => (
                    <div key={pedido.id} className="border p-6 rounded-md flex justify-between items-center space-x-6">
                      <div>
                        <p className="font-semibold">{pedido.evento}</p>
                        <p className="text-sm text-gray-500">{pedido.data}</p>
                      </div>
                      <div className="text-sm text-gray-500">{pedido.status}</div>
                      <div className="flex items-center space-x-4">
                        <p>{pedido.ingressos} ingresso(s) - {pedido.tipoIngresso}</p>
                        <p>R$ {pedido.total.toFixed(2)}</p>
                        <Button onClick={() => handlePedidoDetails(pedido)}>Ver Detalhes</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Modal de Detalhes */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido</DialogTitle>
            </DialogHeader>
            {pedidoSelecionado && (
              <div className="space-y-4">
                <p className="font-semibold">Evento: {pedidoSelecionado.evento}</p>
                <p><strong>Descrição:</strong> {pedidoSelecionado.descricao}</p>
                <p><strong>Data:</strong> {pedidoSelecionado.data}</p>
                <p><strong>Local:</strong> {pedidoSelecionado.local}</p>
                <p><strong>Tipo de Ingresso:</strong> {pedidoSelecionado.tipoIngresso}</p>
                <p><strong>Descrição do Ingresso:</strong> {pedidoSelecionado.descricaoIngresso}</p>
                <p><strong>Status:</strong> {pedidoSelecionado.status}</p>
                <p><strong>Quantidade de Ingressos:</strong> {pedidoSelecionado.ingressos}</p>
                <p><strong>Total:</strong> R$ {pedidoSelecionado.total.toFixed(2)}</p>
              </div>
            )}
            <Button onClick={handleCloseModal} className="mt-4">
              Fechar
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  );
}
