"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
      router.push("/");
    }
  }, [router]);

  if (isAuth === null) {
    return null;
  }

  return <>{children}</>;
}
