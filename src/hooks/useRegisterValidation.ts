import { useState } from "react";

export interface RegisterFormFields {
  name: string;
  email: string;
  password: string;
}

export interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
}

type TouchedFields = Partial<Record<keyof RegisterFormFields, boolean>>;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const HAS_NUMBER_REGEX = /\d/;
const HAS_SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

function validateField(
  name: keyof RegisterFormFields,
  value: string,
): string | undefined {
  switch (name) {
    case "name":
      return value.trim() ? undefined : "Name is required.";
    case "email":
      if (!value.trim()) return "Email is required.";
      if (!EMAIL_REGEX.test(value)) return "Please enter a valid email address.";
      return undefined;
    case "password":
      if (!value) return "Password is required.";
      if (value.length < 8) return "Password must be at least 8 characters.";
      if (!HAS_NUMBER_REGEX.test(value)) return "Password must contain at least one number.";
      if (!HAS_SPECIAL_CHAR_REGEX.test(value))
        return "Password must contain at least one special character.";
      return undefined;
  }
}

function validateAll(fields: RegisterFormFields): RegisterFormErrors {
  return {
    name: validateField("name", fields.name),
    email: validateField("email", fields.email),
    password: validateField("password", fields.password),
  };
}

function hasErrors(errors: RegisterFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}

/**
 * Manages validation state for the registration form.
 *
 * Tracks per-field errors and "touched" status so that errors are only
 * surfaced after the user has interacted with a field or attempted submission.
 *
 * @returns `validateOneField` – validate a single field on change/blur,
 *          `touchField` – mark a field as touched (call on blur),
 *          `validateAllFields` – run full validation on submit; returns whether the form is valid,
 *          `getFieldError` – returns the visible error for a field (only if touched).
 */
export function useRegisterValidation() {
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  function validateOneField(name: keyof RegisterFormFields, value: string): void {
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  }

  function touchField(name: keyof RegisterFormFields): void {
    setTouched(prev => ({ ...prev, [name]: true }));
  }

  function validateAllFields(fields: RegisterFormFields): boolean {
    const fieldErrors = validateAll(fields);
    setErrors(fieldErrors);
    setTouched({ name: true, email: true, password: true });
    return !hasErrors(fieldErrors);
  }

  function getFieldError(name: keyof RegisterFormFields): string | undefined {
    return touched[name] ? errors[name] : undefined;
  }

  return { validateOneField, touchField, validateAllFields, getFieldError };
}
