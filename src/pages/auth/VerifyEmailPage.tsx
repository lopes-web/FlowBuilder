import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function VerifyEmailPage() {
  const navigate = useNavigate()

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We've sent you a verification link. Please check your email and click the link to verify your account.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/auth/login")}
          className="mx-auto"
        >
          Return to login
        </Button>
      </div>
    </div>
  )
} 