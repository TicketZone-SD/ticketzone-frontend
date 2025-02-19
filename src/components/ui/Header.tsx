"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Header() {
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);

  useEffect(() => {
    // Get user logged from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // User default for testing
      setUser({
        name: "Usuário",
        avatar: "https://i.pravatar.cc/150?u=lincon",
      })
    }
  }, []);

  return (
    <header className="bg-black text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6">
        <h1 className="text-xl font-bold">🎟 Ticket Zone</h1>

        <div className="relative">
          <Input
            type="text"
            placeholder="Pesquisar eventos..."
            className="w-[250px] md:w-[400px] pl-10 rounded-lg"
          />
        </div>

        <nav className="hidden md:flex space-x-6">
          <Button variant="ghost">Eventos</Button>
          <Button variant="ghost">Estados</Button>
          <Button variant="ghost">Ajuda</Button>
        </nav>

        {user ? (
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
        ) : (
          <Button variant="outline">Entrar</Button>
        )}
      </div>
    </header>
  );
}
