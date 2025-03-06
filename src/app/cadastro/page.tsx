"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Loader2 } from "lucide-react";
import { createUser } from "@/services/django/userService";
import { formatCPF } from "@/utils/utils";

export default function Cadastro() {
  const { toast } = useToast();
  const router = useRouter();
  const [maskedCPF, setMaskedCPF] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    router.push("/login");
  }

  const handleInitial = () => {
    router.push("/");
  }

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    cpf: "",
    role: "Client",
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    cpf: "",
    role: "",
  });

  const validate = (field: string) => {
    const newErrors = { ...errors };
    let isValid = true;

    switch (field) {
      case "name":
        if (!formData.name || formData.name.length < 3) {
          newErrors.name = "Nome deve conter pelo menos 3 caracteres.";
          isValid = false;
        } else {
          newErrors.name = "";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
          newErrors.email = "Digite um email válido.";
          isValid = false;
        } else {
          newErrors.email = "";
        }
        break;

      case "password":
        if (!formData.password || formData.password.length < 5) {
          newErrors.password = "Senha deve ter pelo menos 5 caracteres.";
          isValid = false;
        } else {
          newErrors.password = "";
        }
        break;

      case "cpf":
        const cpfRegex = /^\d{11}$/;
        if (formData.cpf.length < 11) {
          newErrors.cpf = "CPF deve ter exatamente 11 dígitos numéricos.";
          isValid = false;
        } else if (!cpfRegex.test(formData.cpf)) {
          newErrors.cpf = "CPF deve conter apenas números.";
          isValid = false;
        } else {
          newErrors.cpf = "";
        }
        break;

      case "role":
        if (!formData.role) {
          newErrors.role = "Selecione uma role.";
          isValid = false;
        } else {
          newErrors.role = "";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      const cleanedValue = value.replace(/\D/g, "").slice(0, 11);
      setFormData((prevData) => ({
        ...prevData,
        cpf: cleanedValue,
      }));

      setMaskedCPF(formatCPF(cleanedValue));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    validate(name);
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
    validate("role");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (!validate(key)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    setIsLoading(true);

    try {
      await createUser(formData);

      toast({
        title: "Sucesso!",
        description: "Cadastro realizado com sucesso. Você pode fazer login agora.",
      });

      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        cpf: "",
        role: "Client",
      });

      setErrors({
        name: "",
        username: "",
        email: "",
        password: "",
        cpf: "",
        role: "",
      });

      handleLogin();
    } catch (error) {
      console.error("Erro ao criar usuário", error);

      toast({
        title: "Erro",
        description: "Não foi possível concluir o cadastro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-slate-600">
      <Toaster />

      {isLoading && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          aria-hidden="true"
        >
          <Loader2 className="w-12 h-12 animate-spin text-white" />
        </div>
      )}

      <div className="absolute top-4 left-4">
        <Button variant="ghostDefault" size="icon" onClick={handleInitial} disabled={isLoading}>
          <ChevronLeft />
        </Button>
      </div>

      <Card className={`w-full max-w-md shadow-lg text-white border border-black ${isLoading ? "opacity-50" : ""}`}>
        <CardHeader className="text-center bg-primary p-6 rounded-t-lg">
          <CardTitle className="text-xl font-bold flex items-center justify-center gap-x-2">
            <Image src="/images/Logo-sem-fundo.png" alt="TicketZone Logo" width={40} height={40} />
            <span>TicketZone</span>
          </CardTitle>
          <p className="text-gray-300">Faça seu cadastro em nossa plataforma</p>
        </CardHeader>

        <CardContent className="bg-white text-black p-6 rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                className={`bg-gray-300 border ${errors.name ? "border-red-600" : "border-black"}`}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <Label>Nome de usuário (Login)</Label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Digite seu nome de usuário"
                className={`bg-gray-300 border ${errors.cpf ? "border-red-600" : "border-black"}`}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-red-600 text-sm">{errors.username}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu e-mail"
                className={`bg-gray-300 border ${errors.email ? "border-red-600" : "border-black"}`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <Label>Senha</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                className={`bg-gray-300 border ${errors.password ? "border-red-600" : "border-black"}`}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
            </div>

            <div>
              <Label>CPF</Label>
              <Input
                type="text"
                name="cpf"
                value={maskedCPF}
                onChange={handleChange}
                placeholder="Digite seu CPF"
                className={`bg-gray-300 border ${errors.cpf ? "border-red-600" : "border-black"}`}
                disabled={isLoading}
              />
              {errors.cpf && (
                <p className="text-red-600 text-sm">{errors.cpf}</p>
              )}
            </div>

            <div>
              <Label>Tipo de usuário</Label>
              <Select value={formData.role} onValueChange={handleRoleChange} disabled={isLoading}>
                <SelectTrigger
                  className={`bg-gray-300 border ${
                    errors.role ? "border-red-600" : "border-black"
                  }`}
                >
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Cliente</SelectItem>
                  <SelectItem value="Organizer">Organizador</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-600 text-sm">{errors.role}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="ghostDefault"
              className="w-full py-4 px-6 text-base font-medium rounded-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Cadastrando...
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>

            <div className="flex items-center justify-center text-sm">
              <span className="text-gray-600">Já possui uma conta?</span>
              <Button variant="link" className="text-sm" onClick={handleLogin}>
                Faça login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
