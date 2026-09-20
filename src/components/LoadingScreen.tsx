export default function LoadingScreen({ label = "Loading" }: { label?: string }) {
  return (
    <div className="loading-screen" role="status">
      {label}
      <span className="loading-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}
