"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "@/interfaces/user";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get user logged from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // User default for testing
      setUser({
        id: 1,
        name: "Usuário",
        email: "default@example.com",
        cpf: "000.000.000-00",
        role: "Organizer",
        token: "default-token",
        avatar: "https://i.pravatar.cc/150?u=lincon",
      })
    }
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/cadastro");
  };

  const handleEventsManager = () => {
    router.push("/gerenciar-eventos");
  }

  const handleCategoriesManager = () => {
    router.push("/categorias");
  }

  return (
    <header className="bg-primary text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6">
        <h1 className="text-xl font-bold flex items-center gap-x-2">
          <Image src="/images/Logo-sem-fundo.png" alt="TicketZone Logo" width={60} height={60} />
          <span>TicketZone</span>
        </h1>

        <div className="relative">
          <Input
            type="text"
            placeholder="Pesquisar eventos..."
            className="w-[250px] md:w-[400px] pl-10 rounded-lg"
          />
        </div>

        {user ? (
          <>
            <nav className="hidden md:flex space-x-6">
              <Button variant="ghost">Eventos</Button>
              {user.role === "Organizer" && (
                <>
                  <Button variant="ghost" onClick={handleEventsManager}>Meus Eventos</Button>
                  <Button variant="ghost" onClick={handleCategoriesManager}>Categorias</Button>
                </>
              )}
            </nav>

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
                <DropdownMenuItem>Meu Perfil</DropdownMenuItem>
                <DropdownMenuItem>Meus Pedidos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  localStorage.removeItem("user");
                  setUser(null);
                }}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
