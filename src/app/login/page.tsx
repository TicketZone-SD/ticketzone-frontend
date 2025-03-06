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
import { ChevronLeft, Loader2 } from "lucide-react";
import { User } from "@/interfaces/user";
import { login } from "@/services/django/userService";

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
        if (!formData.password || formData.password.length < 5) {
          newErrors.password = "Senha deve ter pelo menos 5 caracteres.";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasErrors = Object.keys(formData).some((key) => !validate(key));
    if (hasErrors) return;

    setIsLoading(true);

    try {
      const userData = await login(formData.username, formData.password);

      if (userData && userData.user && userData.access) {
      // Criando o objeto do usuário para armazenar no state/localStorage
        const user: User = {
          id: userData.user.id,
          username: userData.user.username,
          email: userData.user.email,
          cpf: userData.user.cpf,
          name: userData.user.name,
          role: userData.user.role,
          avatar: userData.user.avatar || "https://i.pravatar.cc/150?u=lincon",
          accessToken: userData.access,
          refreshToken: userData.refresh,
        };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", userData.access);
        localStorage.setItem("refreshToken", userData.refresh);

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
    } catch {
      toast({
        title: "Erro",
        description: "Usuário ou senha incorretos.",
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
                className={`bg-gray-300 border ${errors.username ? "border-red-600" : "border-black"}`}
                disabled={isLoading}
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
                className={`bg-gray-300 border ${errors.password ? "border-red-600" : "border-black"}`}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
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
                  Logando...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="flex items-center justify-center text-sm">
              <span className="text-gray-600">Não possui cadastro?</span>
              <Button variant="link" className="text-sm" onClick={handleRegister} disabled={isLoading}>
                Cadastre-se
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
