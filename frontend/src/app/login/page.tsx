"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/services/api";

export default function LoginPage() {
  const router = useRouter();

  // Store login form values.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Control password visibility and remember-me option.
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Manage login loading state and error messages.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ==========================================
  // LOGIN
  // ==========================================

  // Validate the form and authenticate the user through the backend.
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }


    // ==========================================
    // API LOGIN
    // ==========================================

    try {
      setLoading(true);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000/api";

      // Send login credentials to the backend.
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      console.log("Login response:", response.data);


      /*
       * Expected backend response:
       *
       * {
       *   token: "your-token",
       *   user: {
       *     id: "...",
       *     name: "...",
       *     email: "..."
       *   }
       * }
       */


      // Extract authentication data from the API response.
      const token = response.data?.token;
      const user = response.data?.user;


      // Stop login if the backend did not return a token.
      if (!token) {
        setError(
          "Login successful, but authentication token was not received."
        );
        return;
      }


      // ==========================================
      // SAVE AUTHENTICATION DATA
      // ==========================================

      // Use localStorage when Remember Me is selected,
      // otherwise use sessionStorage.
      const storage = rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem("token", token);

      if (user) {
        storage.setItem(
          "user",
          JSON.stringify(user)
        );
      }


      // ==========================================
      // REDIRECT
      // ==========================================

      // Redirect the user to the dashboard after successful login.
      router.push("/dashboard");

    } catch (err: unknown) {
      console.error("Login error:", err);


      // Handle Axios-specific API errors.
      if (axios.isAxiosError(err)) {

        // Invalid credentials.
        if (err.response?.status === 401) {
          setError("Invalid email or password.");

        // Show backend error message when available.
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);

        // Handle other API errors.
        } else {
          setError(
            "Unable to login. Please try again."
          );
        }

      } else {
        // Handle unexpected non-Axios errors.
        setError(
          "Something went wrong. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">


        {/* ======================================
            LOGO
        ====================================== */}

        <div className="text-center mb-8">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white shadow-lg">
            FL
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Financial Ledger
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Match Financial Management
          </p>

        </div>


        {/* ======================================
            LOGIN CARD
        ====================================== */}

        <div className="rounded-2xl bg-white p-8 shadow-xl">

          <div className="mb-6">

            <h2 className="text-2xl font-semibold text-slate-900">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to manage your financial ledger
            </p>

          </div>


          {/* Display validation or API error message. */}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}


          {/* ======================================
              LOGIN FORM
          ====================================== */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >


            {/* Email */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Enter your email"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
              />

            </div>


            {/* Password */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                {/* Forgot password functionality is not implemented yet. */}

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Forgot password functionality coming soon."
                    )
                  }
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Forgot Password?
                </button>

              </div>


              <div className="relative">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100"
                />


                {/* Toggle password visibility. */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            {/* Remember Me */}

            <div className="flex items-center">

              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                disabled={loading}
                className="h-4 w-4 rounded border-slate-300"
              />

              <label
                htmlFor="remember"
                className="ml-2 text-sm text-slate-600"
              >
                Remember me
              </label>

            </div>


            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {/* Show spinner while login request is running. */}

              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                  Logging in...
                </>
              ) : (
                "Login"
              )}

            </button>

          </form>

        </div>


        {/* ======================================
            FOOTER
        ====================================== */}

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 Financial Ledger. All rights reserved.
        </p>

      </div>

    </main>
  );
}