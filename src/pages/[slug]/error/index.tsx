import ErrorLayout from "@/components/layout/ErrorLayout";

export default function GenericError() {
  return (
    <ErrorLayout>
      <h1 className="text-2xl font-bold mb-4">An Error Occurred</h1>
      <p className="text-gray-600 mb-4">
        Something went wrong. Please try again later.
      </p>
      <a href="/" className="text-blue-500 underline">
        Go back to the homepage
      </a>
    </ErrorLayout>
  );
}
