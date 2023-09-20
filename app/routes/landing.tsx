import { SignInButton, useUser } from "@clerk/remix";

export default function Example() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <h1 className="mb-4 text-2xl font-bold text-white">Please Sign in</h1>
        <div className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
          <SignInButton mode="modal" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-2xl font-bold text-white">
        Hello, {user.firstName} welcome to Clerk
      </h1>
    </div>
  );
}
