import Link from "next/link";
import { normalizeLink } from "@/utils";
import { useRouter } from "next/router";

interface CustomLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({
  href,
  className,
  children,
}) => {
  const router = useRouter();
  return (
    <Link href={normalizeLink(href, router)} className={className}>
      {children}
    </Link>
  );
};

export default CustomLink;
