import { Link } from "react-router-dom";

export function SiteFooter() {
//   const pages = [
//     { name: "All Products", href: "#" },
//     { name: "Studio", href: "#" },
//     { name: "Clients", href: "#" },
//     { name: "Pricing", href: "#" },
//     { name: "Blog", href: "#" },
//   ];

  const socials = [
    { name: "Facebook", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Twitter", href: "#" },
    { name: "LinkedIn", href: "#" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ];

  const register = [
    { name: "Sign Up", href: "#" },
    { name: "Login", href: "#" },
    // { name: "Forgot Password", href: "#" },
  ];

  return (
    <footer className="bg-slate-50 pt-24 pb-0 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8 mb-20">
        
        {/* Left Side: Logo & Copyright */}
        <div className="flex flex-col items-start w-full md:w-1/3">
          <Link to="/" className="flex items-center gap-2 mb-6 text-slate-900">
            {/* Minimalist Logo mimicking Aceternity's icon */}
            {/* <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-slate-900"
            >
              <path
                d="M5.4 19.3333L12 4L18.6 19.3333H16.0592L12 9.87321L7.94082 19.3333H5.4Z"
                fill="currentColor"
              />
              <path
                d="M12 19.3333L8.7 11.6L5.4 19.3333H12Z"
                fill="currentColor"
              />
            </svg> */}
            <span className="text-xl font-medium tracking-tight">DashPage</span>
          </Link>
          <p className="text-slate-500 text-sm">
            © copyright DashPage 2026. All rights reserved.
          </p>
        </div>

        {/* Right Side: 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16 w-full md:w-2/3 md:justify-items-end lg:justify-items-end">
          {/* <div className="flex flex-col gap-4 items-start">
            <h3 className="font-semibold text-slate-700 mb-2">Pages</h3>
            <ul className="flex flex-col gap-4">
              {pages.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-500 hover:text-slate-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          <div className="flex flex-col gap-4 items-start">
            <h3 className="font-semibold text-slate-700 mb-2">Socials</h3>
            <ul className="flex flex-col gap-4">
              {socials.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-slate-500 hover:text-slate-900 transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 items-start">
            <h3 className="font-semibold text-slate-700 mb-2">Legal</h3>
            <ul className="flex flex-col gap-4">
              {legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-500 hover:text-slate-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 items-start">
            <h3 className="font-semibold text-slate-700 mb-2">Register</h3>
            <ul className="flex flex-col gap-4">
              {register.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-500 hover:text-slate-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Massive Typography at Bottom */}
      <div className="w-full pointer-events-none select-none flex justify-center mt-12 pb-2">
        <h1 
          className="font-black tracking-tighter text-slate-200 uppercase text-center"
          style={{ 
            fontSize: '18vw', 
            lineHeight: 0.75,
          }}
        >
          DashPage
        </h1>
      </div>
    </footer>
  );
}
