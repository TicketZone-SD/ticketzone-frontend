"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { useToast } from "@/hooks/use-toast";
import { getUserById, updateUser, deleteUser } from "@/services/django/userService";
import { User } from "@/interfaces/user";
import { formatCPF } from "@/utils/utils";

export default function UserProfile() {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [maskedCPF, setMaskedCPF] = useState("");
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        try {
          const fetchedUser = await getUserById(parsedUser.accessToken, parsedUser.id);
          setUser(fetchedUser);
          setMaskedCPF(formatCPF(fetchedUser.cpf));
        } catch {
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do usuário.",
            variant: "destructive",
          });
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [toast]);

  const handleEdit = () => {
    if (user) {
      setEditingUser({ ...user });
      setMaskedCPF(formatCPF(user.cpf));
      setOpen(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      const cleanedValue = value.replace(/\D/g, "").slice(0, 11);
      setEditingUser((prevData) => ({
        ...prevData!,
        cpf: cleanedValue,
      }));

      setMaskedCPF(formatCPF(cleanedValue));
    } else {
      setEditingUser((prevData) => ({
        ...prevData!,
        [name]: value,
      }));
    }
  };

  const handleRoleChange = (value: string) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, role: value });
    }
  };

  const handleSave = async () => {
    if (!editingUser || !user) {
      console.log("❌ Nenhum usuário para atualizar.");
      return;
    }

    console.log("🟢 handleSave chamado. Enviando requisição...");
    console.log("Dados enviados para atualização:", editingUser);

    try {
      if (!user.accessToken) {
        toast({
          title: "Erro",
          description: "Token de acesso não encontrado.",
          variant: "destructive",
        });
        return;
      }

      const updatedUser = await updateUser(user.accessToken, {
        ...editingUser,
        cpf: editingUser.cpf.replace(/\D/g, ""),
      });

      console.log("✅ Usuário atualizado com sucesso:", updatedUser);

      const newUser = {
        ...user,
        ...updatedUser,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso.",
      });

      setOpen(false);
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    }
  };


  const handleDelete = async () => {
    if (!user) return;

    try {
      if (user.accessToken) {
        await deleteUser(user.accessToken);
      } else {
        toast({
          title: "Erro",
          description: "Token de acesso não encontrado.",
          variant: "destructive",
        });
      }
      localStorage.removeItem("user");
      toast({
        title: "Conta excluída",
        description: "Sua conta foi removida com sucesso.",
      });

      router.push("/");
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conta.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <p className="text-center">Carregando...</p>;
  }

  return (
    <PrivateRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
        {user ? (
          <>
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
                <p className="border p-2 rounded-md">{maskedCPF}</p>
              </div>
              <div>
                <Label>Tipo de Usuário</Label>
                <p className="border p-2 rounded-md">{user.role === "user" ? "Cliente" : "Organizador"}</p>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <Button onClick={handleEdit}>Editar Perfil</Button>
              <Button variant="destructive" onClick={handleDelete}>Deletar Conta</Button>
            </div>

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
                    <Input type="text" name="cpf" value={maskedCPF} onChange={handleChange} placeholder="Digite seu CPF" />
                  </div>
                  <div>
                    <Label>Tipo de usuário</Label>
                    <Select value={editingUser?.role || "user"} onValueChange={handleRoleChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de usuário">{editingUser?.role}</SelectValue>
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
          </>
        ) : (
          <p className="text-center text-red-500">Erro ao carregar usuário.</p>
        )}
      </div>
    </PrivateRoute>
  );
}
