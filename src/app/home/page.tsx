"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EventCarousel from "@/components/EventCarousel";
import PrivateRoute from "@/components/auth/PrivateRoute";

export default function Home() {
  return (
    <PrivateRoute>
      <div className="flex flex-col items-center bg-gray-100 min-h-screen">
        <div className="flex flex-col items-center flex-grow w-full px-4 pt-10">
          <Card className="w-[400px] shadow-lg">
            <CardHeader>
              <CardTitle>Bem-vindo!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Aqui você se conecta aos melhores eventos!</p>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center justify-start w-full p-4 mt-10 flex-grow">
            <h1 className="text-2xl font-bold mb-6">Principais Eventos</h1>
            <EventCarousel />
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
