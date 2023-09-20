import { SignOutButton, SignInButton } from "@clerk/remix";
import { Link } from "@remix-run/react";
import { Authenticated, Unauthenticated } from "convex/react";

export function Header() {
  return (
    <div className="shadow-md bg-gray-950"  style={{background: 'radial-gradient(circle, rgba(58, 58, 70, 1) 0%, rgba(0, 0, 10, 1) 100%)'}}>
      <div className="container flex items-center justify-between p-4 mx-auto">
        <div className="text-2xl font-semibold text-white">
          <Link to={"/"} className="hover:text-gray-400">
            Remix GPT
          </Link>
        </div>

        <div className="flex gap-1"></div>

        <div>
          <Authenticated>
            <div className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700">
              <SignOutButton />
            </div>
          </Authenticated>
          <Unauthenticated>
            <div className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
              <SignInButton mode="modal" />
            </div>
          </Unauthenticated>
        </div>
      </div>
      <div className="w-full h-px bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 blur-md"></div>
    </div>
  );
}
