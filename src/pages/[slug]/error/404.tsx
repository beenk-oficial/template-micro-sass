import ErrorLayout from "@/components/layout/ErrorLayout";

export default function NotFound() {
  return (
    <ErrorLayout>
      <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-4">
        The page you are looking for does not exist.
      </p>
      <a href="/" className="text-blue-500 underline">
        Go back to the homepage
      </a>
    </ErrorLayout>
  );
}
