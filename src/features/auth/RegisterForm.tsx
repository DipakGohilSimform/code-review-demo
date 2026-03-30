import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components";
import { useRegisterValidation } from "@/hooks";
import type { RegisterFormFields } from "@/hooks";

const inputClassName =
  "w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { validateOneField, touchField, validateAllFields, getFieldError } = useRegisterValidation();

  const [fields, setFields] = useState<RegisterFormFields>({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    const key = name as keyof RegisterFormFields;
    setFields(prev => ({ ...prev, [key]: value }));
    validateOneField(key, value);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>): void {
    touchField(e.target.name as keyof RegisterFormFields);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const valid = validateAllFields(fields);
    if (valid) {
      navigate("/auth/login");
    }
  }

  const nameError = getFieldError("name");
  const emailError = getFieldError("email");
  const passwordError = getFieldError("password");

  return (
    <div className="rounded-lg border bg-card p-8 shadow-lg">
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-sm text-muted-foreground">Fill in the details below to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={fields.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={nameError ? "name-error" : undefined}
            aria-invalid={!!nameError}
            className={inputClassName}
          />
          {nameError && (
            <p id="name-error" role="alert" className="text-sm text-destructive">
              {nameError}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={emailError ? "email-error" : undefined}
            aria-invalid={!!emailError}
            className={inputClassName}
          />
          {emailError && (
            <p id="email-error" role="alert" className="text-sm text-destructive">
              {emailError}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={fields.password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={passwordError ? "password-error" : "password-hint"}
            aria-invalid={!!passwordError}
            className={inputClassName}
          />
          {passwordError ? (
            <p id="password-error" role="alert" className="text-sm text-destructive">
              {passwordError}
            </p>
          ) : (
            <p id="password-hint" className="text-xs text-muted-foreground">
              Min 8 characters, include a number and a special character.
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};
