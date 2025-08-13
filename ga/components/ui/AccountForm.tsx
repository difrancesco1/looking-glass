"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/app/account/account.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import type { LoginRequest, RegisterRequest } from "@/api/user/types";

interface AccountFormProps {
  type: "login" | "register";
}

interface FormData {
  email: string;
  username?: string;
  password: string;
}

export default function AccountForm({ type }: AccountFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { loginAsync, registerAsync, isLoggingIn, isRegistering } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const isLogin = type === "login";
  const isSubmitting = isLogin ? isLoggingIn : isRegistering;

  const emailValidation = {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email address",
    },
  };

  const usernameValidation = {
    required: "Username is required",
    minLength: {
      value: 3,
      message: "Username must be at least 3 characters long",
    },
  };

  const passwordValidation = {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters long",
    },
  };

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    try {
      if (isLogin) {
        // Login flow
        const loginData: LoginRequest = {
          login: data.email, // Using email as login field
          password: data.password,
        };

        await loginAsync(loginData);

        // Redirect on successful login using Next.js router (no page refresh)
        const redirectUrl = new URLSearchParams(window.location.search).get(
          "redirect",
        );
        router.push(redirectUrl || "/");
      } else {
        // Register flow
        if (!data.username) {
          throw new Error("Username is required for registration");
        }

        const registerData: RegisterRequest = {
          username: data.username,
          email: data.email,
          password: data.password,
        };

        await registerAsync(registerData);

        // After successful registration, redirect to home
        router.push("/");
      }
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageLeft}>
        <div className={styles.pageLeftText}>
          <Link href="/">
            <span>Looking Glass</span>
          </Link>
        </div>
      </div>
      <div className={styles.pageRight}>
        <div className={styles.registerContainer}>
          <div className={styles.registerHeader}>
            <h1>{isLogin ? "Sign in to your account" : "Create an account"}</h1>
            <p>
              {isLogin
                ? "Enter your credentials to sign in"
                : "Enter your credentials to create an account"}
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {serverError && <p className="text-red-500">{serverError}</p>}
            <Input
              {...register("email", emailValidation)}
              type="email"
              placeholder="Email"
              disabled={isSubmitting}
            />
            {!isLogin && (
              <Input
                {...register("username", usernameValidation)}
                type="text"
                placeholder="Username"
                disabled={isSubmitting}
              />
            )}
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}

            <Input
              {...register("password", passwordValidation)}
              type="password"
              placeholder="Password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Loading..."
                : isLogin
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>
          <span className={styles.divider}>
            <Link href={isLogin ? "/account/register" : "/account/login"}>
              {isLogin ? "Don't have an account?" : "Have an account?"}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
