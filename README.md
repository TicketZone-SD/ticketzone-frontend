# 🎟 TicketZone - Frontend (Next.js)

Este repositório contém o frontend do sistema **TicketZone**, desenvolvido com **Next.js**, **TypeScript** e **Tailwind CSS**.

---

## 🚀 **Tecnologias Utilizadas**
- **Next.js 15 (React 18)**
- **TypeScript**
- **Tailwind CSS**
- **ESLint + Prettier**
- **Axios (para chamadas de API)**

---

## 📌 **1️⃣ Pré-requisitos**
Antes de começar, instale as seguintes ferramentas:

### 🔹 **Instalar Node.js 22**
Baixe e instale a versão **22 LTS** do Node.js:  
🔗 [Download Node.js 22 LTS](https://nodejs.org/en/download)

Para verificar se está tudo certo, rode:
```bash
node -v   # Deve exibir v22.x.x
npm -v    # Deve exibir a versão do npm
```

Se quiser gerenciar versões do Node.js, instale o **nvm**:
```bash
nvm install 22
nvm use 22
```

---

## 📌 **2️⃣ Clonar o Repositório**
```bash
git clone https://github.com/TicketZone-SD/ticketzone-frontend.git
cd ticketzone-frontend
```

---

## 📌 **3️⃣ Instalar Dependências**
Execute o seguinte comando para instalar todas as dependências do projeto:

```bash
npm install
```

Caso esteja usando **Yarn**:
```bash
yarn install
```

---

## 📌 **4️⃣ Configurar Variáveis de Ambiente**
Crie um arquivo **`.env.local`** na raiz do projeto e adicione as seguintes variáveis:

```ini
NEXT_PUBLIC_API_DJANGO=http://localhost:8000
NEXT_PUBLIC_API_NEST=http://localhost:3003
```

📌 **Explicação**:
- `NEXT_PUBLIC_API_DJANGO` → Define a URL da API do Django (autenticação e usuários).
- `NEXT_PUBLIC_API_NEST` → Define a URL da API do NestJS (eventos e pedidos).

---

## 📌 **5️⃣ Extensões Recomendadas para o VS Code**
Para melhorar a experiência no desenvolvimento, instale estas extensões:

🔹 **[Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)**  
🔹 **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)**  
🔹 **[GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)**  
🔹 **[Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)**  
🔹 **[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)**  
🔹 **[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)**  
🔹 **[Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)**  
🔹 **[Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)**  

📌 **Dica**: O projeto já inclui um arquivo **`.vscode/extensions.json`**, então o VS Code recomendará essas extensões automaticamente ao abrir o projeto.  

---

## 📌 **6️⃣ Rodar o Servidor de Desenvolvimento**
Após configurar tudo, execute o seguinte comando para iniciar o frontend:

```bash
npm run dev
```

Se estiver usando **Yarn**:
```bash
yarn dev
```

📌 O servidor será iniciado em:  
🔗 **http://localhost:3000**

Se precisar rodar em outra porta:
```bash
npm run dev -- -p 4000
```

---

## 📌 **7️⃣ Estrutura do Projeto**
A estrutura principal do frontend:

```
ticketzone-frontend/
├── public/                 # Arquivos estáticos (favicon, imagens)
├── src/
│   ├── app/                # Estrutura baseada em App Router (Next.js 13+)
│   │   ├── layout.tsx      # Layout padrão do site
│   │   ├── page.tsx        # Página principal
│   ├── styles/             # Estilos globais
│   ├── services/           # Configuração de Axios e chamadas API
│   ├── components/         # Componentes reutilizáveis
├── .vscode/                # Configurações recomendadas do VS Code
├── .gitignore              # Ignora arquivos desnecessários no Git
├── .env.local.example      # Exemplo de variáveis de ambiente
├── next.config.ts          # Configuração do Next.js
├── tailwind.config.ts      # Configuração do Tailwind CSS
├── tsconfig.json           # Configuração do TypeScript
├── package.json            # Dependências e scripts
├── README.md               # Documentação do projeto
```

---

## 📌 **8️⃣ Problemas com o Projeto**

Caso tenha problemas com pacotes:
```bash
rm -rf node_modules package-lock.json
npm install
```

---
