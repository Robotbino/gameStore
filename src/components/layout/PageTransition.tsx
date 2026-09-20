import { Outlet, useLocation } from "react-router-dom";

// Re-keying on the path remounts the wrapper, which replays the CSS enter
// animation on every route change without any timers.
export default function PageTransition() {
  const { pathname } = useLocation();

  return (
    <div className="page-enter" key={pathname}>
      <Outlet />
    </div>
  );
}
