import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] p-6">
      <SignIn />
    </div>
  );
}