"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { User } from "@/interfaces/user";

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const handleRegister = () => {
    router.push("/cadastro");
  }

  const handleInitial = () => {
    router.push("/");
  }

  const handleHome = () => {
    router.push("/home");
  }

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const validate = (field: string) => {
    const newErrors = { ...errors };
    let isValid = true;

    switch (field) {
      case "username":
        if (!formData.username) {
          newErrors.username = "O nome de usuário é obrigatório.";
          isValid = false;
        } else {
          newErrors.username = "";
        }
        break;

      case "password":
        if (!formData.password || formData.password.length < 6) {
          newErrors.password = "Senha deve ter pelo menos 6 caracteres.";
          isValid = false;
        } else {
          newErrors.password = "";
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
    setFormData({ ...formData, [name]: value });
    validate(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (!validate(key)) {
        isValid = false;
      }

      // FAZER REQUEST PARA API DE LOGIN
      // setUser({
      //   name: response.username,
      //   avatar: response.avatar | "https://i.pravatar.cc/150?u=lincon",
      // });
    });

    if (isValid) {
      localStorage.setItem("user", JSON.stringify(user));

      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso.",
      });

      setFormData({
        username: "",
        password: "",
      });

      setErrors({
        username: "",
        password: "",
      });

      handleHome();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-slate-600">
      <Toaster />

      <div className="absolute top-4 left-4">
        <Button variant="ghostDefault" size="icon" onClick={handleInitial}>
          <ChevronLeft />
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-lg text-white border border-black">
        <CardHeader className="text-center bg-primary p-6 rounded-t-lg">
          <CardTitle className="text-xl font-bold flex items-center justify-center gap-x-2">
            <Image src="/images/Logo-sem-fundo.png" alt="TicketZone Logo" width={40} height={40} />
            <span>TicketZone</span>
          </CardTitle>
          <p className="text-gray-300">Faça seu login para acessar a plataforma</p>
        </CardHeader>

        <CardContent className="bg-white text-black p-6 rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nome de usuário</Label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Digite seu nome de usuário"
                className={`bg-gray-300 border ${
                  errors.username ? "border-red-600" : "border-black"
                }`}
              />
              {errors.username && (
                <p className="text-red-600 text-sm">{errors.username}</p>
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
                className={`bg-gray-300 border ${
                  errors.password ? "border-red-600" : "border-black"
                }`}
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="ghostDefault"
              className="w-full py-4 px-6 text-base font-medium rounded-md"
            >
              Login
            </Button>

            <div className="flex items-center justify-center text-sm">
              <span className="text-gray-600">Não possui cadastro?</span>
              <Button variant="link" className="text-sm" onClick={handleRegister}>
                Cadastre-se
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
