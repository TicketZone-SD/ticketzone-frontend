"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "@/interfaces/user";
import { CartItem } from "@/interfaces/order";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Obtém itens do carrinho do localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const cartItems = JSON.parse(storedCart);
      const totalQuantity = cartItems.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
      setCartCount(totalQuantity);
    }
  }, []);

  const handleInitial = () => router.push("/");
  const handleHome = () => router.push("/home");
  const handleLogin = () => router.push("/login");
  const handleRegister = () => router.push("/cadastro");
  const handleEvents = () => router.push("/eventos");
  const handleEventsManager = () => router.push("/gerenciar-eventos");
  const handleCategoriesManager = () => router.push("/categorias");
  const handleMyProfile = () => router.push("/meu-perfil");
  const handleMyOrders = () => router.push("/meus-pedidos");
  const handleCart = () => router.push("/carrinho");

  return (
    <header className="bg-primary text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6">
        <h1 className="text-xl font-bold flex items-center gap-x-2">
          <a onClick={user ? handleHome : handleInitial} className="cursor-pointer flex items-center gap-x-2">
            <Image src="/images/Logo-sem-fundo.png" alt="TicketZone Logo" width={60} height={60} />
            <span>TicketZone</span>
          </a>
        </h1>

        {user ? (
          <>
            <nav className="hidden md:flex space-x-6">
              <Button variant="ghost" onClick={handleEvents}>Eventos</Button>
              {user.role === "Organizer" && (
                <>
                  <Button variant="ghost" onClick={handleEventsManager}>Meus Eventos</Button>
                  <Button variant="ghost" onClick={handleCategoriesManager}>Categorias</Button>
                </>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Ícone do Carrinho */}
              <div className="relative cursor-pointer" onClick={handleCart}>
                <ShoppingCart className="w-6 h-6 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleMyProfile}>Meu Perfil</DropdownMenuItem>
                  {user.role === "Client" && (
                    <DropdownMenuItem onClick={handleMyOrders}>Meus Pedidos</DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => {
                    localStorage.removeItem("user");
                    setUser(null);
                    handleInitial();
                  }}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <div className="flex space-x-4">
            <Button variant="ghost" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="secondary" onClick={handleRegister}>
              Criar Conta
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
