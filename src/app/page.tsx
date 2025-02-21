"use client";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function Cadastro() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
    role: "user",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
    role: "",
  });

  const validate = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "", cpf: "", role: "" };

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Nome deve conter pelo menos 3 caracteres.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Digite um email válido.";
      isValid = false;
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres.";
      isValid = false;
    }

    const cpfRegex = /^\d{11}$/;
    if (!formData.cpf || !cpfRegex.test(formData.cpf)) {
      newErrors.cpf = "CPF deve ter 11 dígitos numéricos.";
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = "Selecione uma role.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Data submitted:", formData);

      toast({
        title: "Success!",
        description: "Registration completed successfully.",
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        cpf: "",
        role: "user",
      });

      setErrors({
        name: "",
        email: "",
        password: "",
        cpf: "",
        role: "",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-gray-100">
      <Toaster />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <Image src="/images/TICKETZONE (3).png" alt="Logo" width={128} height={128} className="mx-auto" />
          <CardTitle>Cadastre-se no TicketZone</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Digite seu nome" />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="seunome@email.com" />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>

            <div>
              <Label>Senha</Label>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Digite sua senha" />
              {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            </div>

            <div>
              <Label>CPF</Label>
              <Input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="Apenas números" />
              {errors.cpf && <p className="text-red-600 text-sm">{errors.cpf}</p>}
            </div>

            <div>
              <Label>Tipo de usuário</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Cliente</SelectItem>
                  <SelectItem value="organizer">Organizador</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-600 text-sm">{errors.role}</p>}
            </div>

            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
