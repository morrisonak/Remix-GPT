export default function Index() {
    return (
    <div className="container flex flex-col gap-8 p-6 mx-auto text-white bg-gray-900">
      <h1 className="text-4xl font-bold">Hello, world!</h1>
      <p className="text-xl">
        This is a simple example of using Clerk in a Remix app.
      </p>
      <p className="text-xl">
        You can find the source code for this example in{" "}
        <a
          href="https://github.com/clerkinc/remix-clerk-example"
          className="underline"
        >
          https://github.com/clerkinc/remix-clerk-example
        </a>
        .
      </p>
    </div>
  );
}