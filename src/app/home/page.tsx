import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Bem-vindo!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Você está logado com sucesso.</p>
          <Button className="mt-4 w-full">Explorar Eventos</Button>
        </CardContent>
      </Card>
    </div>
  );
}
