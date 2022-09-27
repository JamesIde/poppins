export class LoggedInUserDto {
  id: number;
  name: string;
  email: string;
  accessToken: string;
  tokenVersion?: number;
}
