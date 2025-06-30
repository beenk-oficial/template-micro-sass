import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LocaleIndex() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Welcome to Micro SaaS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-700">
            This is the locale-specific homepage. Customize it as needed.
          </p>
          {/* https://shadcnblocks-free.vercel.app/ */}
        </CardContent>
      </Card>
    </div>
  );
}
