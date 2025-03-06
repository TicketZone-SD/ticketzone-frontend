"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/interfaces/user";

interface Pedido {
  id: number;
  evento: string;
  data: string;
  status: string;
  ingressos: number;
  total: number;
  avatar: string;  // Adiciona um campo avatar específico para cada pedido
}

export default function MeusPedidos() {
  const [user, setUser] = useState<User | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para a pesquisa
  const [open, setOpen] = useState(false); // Estado do modal
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null); // Pedido selecionado para mostrar no modal

  useEffect(() => {
    // Simulação de obtenção do usuário
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({
        id: 1,
        name: "Usuário Teste",
        email: "test@example.com",
        cpf: "000.000.000-00",
        role: "Organizer",
        token: "token",
        avatar: "https://i.pravatar.cc/150?u=lincon",
      });
    }

    // Simulação de pedidos com avatares específicos para cada pedido
    setPedidos([
      { id: 1, evento: "LUAN CITY FESTIVAL", data: "25/03/2025 20:00", status: "Pago", ingressos: 2, total: 100, avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0MvX4Rw4ZbVuYxwSHVYMZZBHOQ6ijccPFYg&s" },
      { id: 2, evento: "Final da LTA Sul", data: "30/03/2025 19:00", status: "Aguardando", ingressos: 1, total: 50, avatar: "https://elasticbeanstalk-us-east-1-909474674380.s3.us-east-1.amazonaws.com/lta_sul_logo_certo_f5613bf154.png" },     
      { id: 3, evento: "Justin Bieber in Brazil", data: "05/04/2025 18:00", status: "Cancelado", ingressos: 3, total: 150, avatar: "https://ofuxico.com.br/wp-content/uploads/2021/11/justinbieberturne2022.jpg" },
      { id: 4, evento: "Lemos Party", data: "10/05/2025 18:00", status: "Pago", ingressos: 1, total: 25, avatar: "https://lemos-party2025.vercel.app/img/logolemos.png" },
    ]);
  }, []);

  const handlePedidoDetails = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setPedidoSelecionado(null); // Limpar pedido selecionado ao fechar
  };

  const filteredAndSortedPedidos = pedidos
    .filter(pedido =>
      pedido.evento.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.evento.localeCompare(b.evento));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>

      <div className="space-y-4 mb-6">
        <div>
          <Input
            type="text"
            placeholder="Pesquisar pedidos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[250px] md:w-[400px] pl-10 rounded-lg"
          />
        </div>

        <div>
          {filteredAndSortedPedidos.length === 0 ? (
            <p className="text-center">Você ainda não fez nenhum pedido ou não há correspondência com a pesquisa.</p>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedPedidos.map((pedido) => (
                <div key={pedido.id} className="border p-6 rounded-md flex justify-between items-center space-x-6">
                  {/* Avatar específico para cada pedido */}
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar>
                      <AvatarImage src={pedido.avatar} />
                      <AvatarFallback>{pedido.evento.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{pedido.evento}</p>
                      <p className="text-sm text-gray-500">{pedido.data}</p>
                    </div>
                  </div>
                  {/* Status do pedido */}
                  <div className="text-sm text-gray-500 flex-1 text-center">
                    {pedido.status}
                  </div>
                  {/* Informações financeiras e ação */}
                  <div className="flex items-center space-x-4 flex-1 justify-end">
                    <p>{pedido.ingressos} ingresso(s)</p>
                    <p>R$ {pedido.total.toFixed(2)}</p>
                    <Button onClick={() => handlePedidoDetails(pedido)}>
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para detalhes do pedido */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
          </DialogHeader>
          {pedidoSelecionado && (
            <div className="space-y-4">
              <p className="font-semibold">Evento: {pedidoSelecionado.evento}</p>
              <p><strong>Data:</strong> {pedidoSelecionado.data}</p>
              <p><strong>Status:</strong> {pedidoSelecionado.status}</p>
              <p><strong>Quantidade de Ingressos:</strong> {pedidoSelecionado.ingressos}</p>
              <p><strong>Total:</strong> R$ {pedidoSelecionado.total.toFixed(2)}</p>

              {/* Exemplo de ação */}
              <Button variant="outline" onClick={() => alert("Baixar ingresso ou mostrar QR Code")}>
                Ver Ingresso (QR Code)
              </Button>
            </div>
          )}
          <Button onClick={handleCloseModal} className="mt-4">
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
