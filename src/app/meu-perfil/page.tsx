"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import PrivateRoute from "@/components/auth/PrivateRoute";

const mockUser = {
  id: 1,
  name: "Marcelo Lemos",
  username: "Lemores",
  email: "marcelo.hslf@gmail.com",
  cpf: "123.456.789-00",
  role: "user",
};

export default function UserProfile() {
  const [user, setUser] = useState(mockUser);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof user | null>(null);

  const handleEdit = () => {
    setEditingUser({ ...user });
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    }
  };

  const handleRoleChange = (value: string) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, role: value });
    }
  };

  const handleSave = () => {
    if (editingUser) {
      setUser(editingUser);
    }
    setOpen(false);
  };

  return (
    <PrivateRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
        <div className="space-y-4">
          <div>
            <Label>Nome</Label>
            <p className="border p-2 rounded-md">{user.name}</p>
          </div>
          <div>
            <Label>Nome de Usuário</Label>
            <p className="border p-2 rounded-md">{user.username}</p>
          </div>
          <div>
            <Label>Email</Label>
            <p className="border p-2 rounded-md">{user.email}</p>
          </div>
          <div>
            <Label>CPF</Label>
            <p className="border p-2 rounded-md">{user.cpf}</p>
          </div>
          <div>
            <Label>Tipo de Usuário</Label>
            <p className="border p-2 rounded-md">{user.role === "user" ? "Cliente" : "Organizador"}</p>
          </div>
        </div>
        <Button onClick={handleEdit} className="mt-4">Editar Perfil</Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input type="text" name="name" value={editingUser?.name || ""} onChange={handleChange} />
              </div>
              <div>
                <Label>Nome de Usuário</Label>
                <Input type="text" name="username" value={editingUser?.username || ""} onChange={handleChange} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" name="email" value={editingUser?.email || ""} onChange={handleChange} />
              </div>
              <div>
                <Label>CPF</Label>
                <Input type="text" name="cpf" value={editingUser?.cpf || ""} onChange={handleChange} />
              </div>
              <div>
                <Label>Tipo de usuário</Label>
                <Select value={editingUser?.role || "user"} onValueChange={handleRoleChange}>
                  <SelectTrigger className="bg-gray-300 border border-black">
                    <SelectValue placeholder="Selecione o tipo de usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Cliente</SelectItem>
                    <SelectItem value="organizer">Organizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="w-full mt-4">Salvar Alterações</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  );
}
