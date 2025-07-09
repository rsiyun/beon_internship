import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth-service";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: false
  })

  const loginMutation = useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: (response) => {
      if (response.status_code === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("expires_at", response.data.expires_at);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setError("");
        navigate("/", { replace: true });
      }
    },
    onError: (error) => {
      setError(error.message);
    }
  })

  const onSubmit = (data) => {
    loginMutation.mutate(data)
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login For Admin</CardTitle>
            <CardDescription>
              Please enter your credentials to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
              {error && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input {...register("email", {
                    required: "this field is required",
                    
                    })} id="email" type="email" placeholder="email@example.com"/>
                  {
                    errors.email && (
                      <p className="text-red-500 text-sm m-0">{errors.email.message}</p>
                    )
                  }
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input {...register("password", {
                    required: "this field is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long"
                    }
                    })} id="password" type="password"/>
                  {
                    errors.password && (
                      <p className="text-red-500 text-sm m-0">{errors.password.message}</p>
                    )
                  }
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit">
                    Login
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
