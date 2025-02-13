"use client";
import { useState } from "react";
import Image from "next/image"; // Importa o componente Image do Next.js

export default function Cadastro() {
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
      newErrors.name = "Nome deve ter pelo menos 3 caracteres.";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Dados enviados:", formData);
      alert("Cadastro realizado com sucesso!");
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
    <div className="flex items-center justify-center min-h-screen p-8 bg-blue-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-4"
      >
        <Image
          src="/images/TICKETZONE (3).png"
          alt="Logo"
          width={128} // Define a largura da imagem
          height={128} // Define a altura da imagem
          className="mx-auto"
        />

        <h3 className="text-1xl font-bold text-black text-center">Bem vindo a TicketZone! Faça aqui o seu cadastro para acessar a plataforma</h3>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Nome</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Senha</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">CPF</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
          {errors.cpf && <p className="text-red-600 text-sm">{errors.cpf}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Tipo</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          >
            <option value="user">Cliente</option>
            <option value="admin">Organizador</option>
          </select>
          {errors.role && <p className="text-red-600 text-sm">{errors.role}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
