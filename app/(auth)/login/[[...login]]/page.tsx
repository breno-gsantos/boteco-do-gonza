import LoginForm from "@/components/auth/login-form";
import { SignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await currentUser();

  if (user) {
    redirect('/admin');
  }

  return (
    <div>
      <LoginForm />
    </div>
  )
}