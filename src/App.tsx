import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/AppRoutes";
// Global styles are imported once from main.tsx (src/styles/index.css).
// Do not add "./App.css" here — the double import would land unlayered and
// override Tailwind utilities once they arrive in Phase 2.

export default function App() {
  // CartProvider is nested inside AuthProvider because it reads userEmail to
  // namespace the cart per account.
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}
