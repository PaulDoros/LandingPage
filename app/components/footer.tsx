import { Link } from '@remix-run/react';

export function Footer() {
  return (
    <footer className="border-border/40 bg-background border-t">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <h4 className="text-base font-medium">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/templates"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-medium">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-medium">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/status"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-medium">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-border/40 mt-8 border-t pt-8">
          <p className="text-muted-foreground text-center text-sm">
            © {new Date().getFullYear()} Landing Builder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
