import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left ml-3">
          &copy; {new Date().getFullYear()} AI Notes. All rights reserved.
        </p>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/contact" className="hover:underline mr-3">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}