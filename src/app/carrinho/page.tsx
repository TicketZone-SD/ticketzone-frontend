"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/services/nestjs/orderService";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { CartItem, Order } from "@/interfaces/order";

export default function CartPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = quantity;
    newCart[index].total_price = newCart[index].price * quantity;
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const finalizePurchase = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    try {
      await Promise.all(
        cart.map(async (item) => {
          const order: Order = {
            id: 0,
            user_id: user.id,
            event_id: item.event_id,
            ticket_type_id: item.ticket_type_id,
            quantity: item.quantity,
            total_price: item.total_price,
            status: "Pendente",
          };
          await createOrder(order);
        })
      );

      toast({
        title: "Sucesso!",
        description: "Compra realizada com sucesso!",
      });

      localStorage.removeItem("cart");
      setCart([]);
      router.push("/meus-pedidos");
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao finalizar a compra.",
        variant: "destructive",
      });
    }
  };

  return (
    <PrivateRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Carrinho de Compras</h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Tipo de Ingresso</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.event_name}</TableCell>
                    <TableCell>{item.ticket_name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                        className="w-16"
                      />
                    </TableCell>
                    <TableCell>R$ {item.price.toFixed(2)}</TableCell>
                    <TableCell>R$ {item.total_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => removeItem(index)}>
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end mt-6">
              <Button onClick={finalizePurchase} className="w-full md:w-auto">
                Finalizar Compra
              </Button>
            </div>
          </>
        )}
      </div>
    </PrivateRoute>
  );
}
