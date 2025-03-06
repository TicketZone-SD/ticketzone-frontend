"use client";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const mockCategories = [
  { id: 1, name: "Música", description: "Eventos relacionados a shows e apresentações musicais" },
  { id: 2, name: "Tecnologia", description: "Conferências e eventos de inovação e tecnologia" },
  { id: 3, name: "Teatro", description: "Peças teatrais e apresentações artísticas" },
  { id: 4, name: "Esportes", description: "Eventos esportivos, competições e torneios" },
];

export default function ManageCategories() {
  const [categories, setCategories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<{ id?: number; name: string; description: string } | null>(null);
  const [open, setOpen] = useState(false);

  const handleEdit = (category?: typeof selectedCategory) => {
    setSelectedCategory(category ?? { name: "", description: "" });
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelectedCategory({
      ...selectedCategory!,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (selectedCategory?.id) {
      setCategories(categories.map((cat) => (cat.id === selectedCategory?.id ? { ...selectedCategory, id: cat.id } : cat)));
    } else {
      const newCategory = {
        id: categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
        name: selectedCategory?.name ?? "",
        description: selectedCategory?.description ?? "",
      };
      setCategories([...categories, newCategory]);
    }
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciar Categorias</h1>
        <Button onClick={() => handleEdit()} className="mb-4">Criar Categoria</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description || "Sem descrição"}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDelete(category.id)}>
                  Remover
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de Criação/Edição */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory?.id ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input type="text" name="name" value={selectedCategory?.name || ""} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea name="description" value={selectedCategory?.description || ""} onChange={handleChange} />
            </div>

            <Button onClick={handleSave} className="w-full">
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
