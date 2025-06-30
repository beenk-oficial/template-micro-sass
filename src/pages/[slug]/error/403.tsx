import ErrorLayout from "@/components/layout/ErrorLayout";

export default function Forbidden() {
  return (
    <ErrorLayout>
      <h1 className="text-2xl font-bold mb-4">403 - Forbidden</h1>
      <p className="text-gray-600 mb-4">
        You do not have permission to access this page.
      </p>
      <a href="/" className="text-blue-500 underline">
        Go back to the homepage
      </a>
    </ErrorLayout>
  );
}
