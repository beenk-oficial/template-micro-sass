import Link from "next/link";
import { useWhitelabel } from "@/hooks/useWhitelabel";

export default function AuthLayout({
  children,
  banner,
  invert,
}: Readonly<{
  children: React.ReactNode;
  banner?: string;
  invert?: boolean;
}>) {
  const { name, logo, marketing_banner } = useWhitelabel();

  const FormColumn = (
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <Link href="/" className="flex items-center cursor-pointer">
        <img
          src={logo}
          alt={`${name} logo`}
          className="w-full h-10 object-contain"
        />
      </Link>
      <div className="flex justify-center align-center h-full -mt-10">
        {children}
      </div>
    </div>
  );

  const BannerColumn = (
    <div className="bg-muted relative hidden lg:block">
      <img
        src={banner ?? marketing_banner.login}
        alt="Image"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  );

  return (
    <div className="bg-background">
      <div className="grid min-h-svh lg:grid-cols-2">
        {invert ? (
          <>
            {BannerColumn}
            {FormColumn}
          </>
        ) : (
          <>
            {FormColumn}
            {BannerColumn}
          </>
        )}
      </div>
    </div>
  );
}
