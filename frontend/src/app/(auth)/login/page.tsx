// import { AuthForm } from "@/components/auth/auth-form";
// import Link from "next/link";

// export default function LoginPage() {
//   return (
//     <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
//       <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
//         <div className="absolute inset-0 bg-zinc-900" />
//         <div className="relative z-20 flex items-center text-lg font-medium">
//           <svg
//             className="mr-2 h-6 w-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//             />
//           </svg>
//           TaskFlow Architecture
//         </div>
//         <div className="relative z-20 mt-auto">
//           <blockquote className="space-y-2">
//             <p className="text-lg">
//               "This task management system uses a dual-token JWT rotation
//               strategy, ensuring enterprise-grade security for your data."
//             </p>
//             <footer className="text-sm">Senior System Design</footer>
//           </blockquote>
//         </div>
//       </div>
//       <div className="lg:p-8">
//         <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
//           <AuthForm type="login" />
//           <p className="px-8 text-center text-sm text-muted-foreground">
//             Don&apos;t have an account?{" "}
//             <Link
//               href="/register"
//               className="underline underline-offset-4 hover:text-primary"
//             >
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Login | TaskFlow",
  description: "Secure login to your TaskFlow workspace",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <BrandPanel />
      <AuthPanel />
    </main>
  );
}

/* ===============================
   Left Brand Panel
================================ */
function BrandPanel() {
  return (
    <section className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white px-12 py-16 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 space-y-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-lg font-bold">TF</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">TaskFlow</h1>
        </div>

        {/* Hero */}
        <div className="space-y-6 max-w-xl">
          <h2 className="text-5xl font-bold leading-tight tracking-tight">
            Stay organized.
            <br />
            <span className="text-slate-400">Stay productive.</span>
          </h2>

          <p className="text-lg text-slate-400 leading-relaxed">
            Enterprise-grade security with JWT rotation, scalable architecture,
            and real-time task orchestration.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <FeatureTag label="Secure Authentication" />
            <FeatureTag label="Real-time Sync" />
            <FeatureTag label="Advanced Analytics" />
          </div>
        </div>
      </div>

      {/* Footer (Static Text Now) */}
      <footer className="relative z-10 flex items-center justify-between text-sm text-slate-500">
        <span>© {new Date().getFullYear()} TaskFlow</span>
        <span className="text-slate-600">All rights reserved</span>
      </footer>
    </section>
  );
}

/* ===============================
   Right Auth Panel
================================ */
function AuthPanel() {
  return (
    <section className="flex items-center justify-center px-6 py-12 sm:px-12">
      <div className="w-full max-w-md space-y-10">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-semibold">TF</span>
          </div>
          <h1 className="text-xl font-semibold">TaskFlow</h1>
        </div>

        {/* Heading */}
        <header className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="text-slate-600">
            Enter your credentials to access your workspace.
          </p>
        </header>

        {/* Auth Form */}
        <AuthForm type="login" />

        {/* Divider */}
        <Divider label="New to TaskFlow?" />

        {/* Register Link (Keep this since page exists) */}
        <div className="text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-2 font-semibold text-slate-900 hover:text-blue-600 transition-colors"
          >
            Create an account →
          </a>
        </div>

        {/* Static Help Text */}
        <p className="text-center text-sm text-slate-500 pt-4">
          Need assistance? Reach out via your administrator.
        </p>
      </div>
    </section>
  );
}

/* ===============================
   Reusable UI Components
================================ */

function FeatureTag({ label }: { label: string }) {
  return (
    <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium backdrop-blur-sm">
      {label}
    </span>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-4 text-slate-500">{label}</span>
      </div>
    </div>
  );
}
