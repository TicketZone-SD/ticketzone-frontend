export interface User {
  id?: number;
  username: string;
  email: string;
  cpf: string;
  name: string;
  password?: string;
  role: string;
  avatar?: string;
  accessToken?: string;
  refreshToken?: string;
}
