import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* <h1 className="text-2xl font-bold mb-4">Signup</h1> */}
      <SignupForm />
    </div>
  );
}
