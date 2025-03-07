"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { Category } from "@/interfaces/category";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/nestjs/categoryService";
import { useToast } from "@/hooks/use-toast";

export default function ManageCategories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // 🔹 Busca categorias ao carregar a página
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError(true);
        toast({ title: "Erro", description: "Não foi possível carregar as categorias.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedCategory({ id: 0, name: "", description: "" });
    setOpen(true);
  };

  const handleEdit = (category: Category) => {
    setIsCreating(false);
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selectedCategory) return;
    setSelectedCategory((prev) => ({ ...prev!, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!selectedCategory) return;

    try {
      if (isCreating) {
        const newCategory = await createCategory(selectedCategory);
        setCategories((prev) => [...prev, newCategory]);
      } else {
        const updatedCategory = await updateCategory(selectedCategory);
        setCategories((prev) => prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)));
      }
      toast({ title: "Sucesso!", description: `Categoria ${isCreating ? "criada" : "atualizada"} com sucesso.` });
      setOpen(false);
    } catch {
      toast({ title: "Erro", description: "Não foi possível salvar a categoria.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      toast({ title: "Sucesso!", description: "Categoria removida com sucesso." });
    } catch {
      toast({ title: "Erro", description: "Não foi possível remover a categoria.", variant: "destructive" });
    }
  };

  return (
    <PrivateRoute>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-6">Gerenciar Categorias</h1>
          <Button onClick={handleCreate} className="mb-4">Criar Categoria</Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-600 text-center font-semibold">Erro ao carregar as categorias.</p>
        ) : (
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
        )}

        {/* Modal de Criação/Edição */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isCreating ? "Criar Categoria" : "Editar Categoria"}</DialogTitle>
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
                {isCreating ? "Criar Categoria" : "Salvar Alterações"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  );
}
