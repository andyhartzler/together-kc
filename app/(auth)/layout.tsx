import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Together KC',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
