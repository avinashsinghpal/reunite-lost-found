import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© {year} Lost & Found. All rights reserved.</p>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/privacy" className="story-link">Privacy Policy</Link>
          <Link to="/contact" className="story-link">Contact</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
