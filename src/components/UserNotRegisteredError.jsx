export default function UserNotRegisteredError() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4"
      style={{ background: "var(--go-bg)" }}
    >
      <div
        className="max-w-md w-full p-6 rounded-lg"
        style={{
          background: "var(--go-bg-card)",
          border: "1px solid var(--go-border)",
        }}
      >
        <h1
          className="text-[16px] font-semibold mb-2"
          style={{ color: "var(--go-text)" }}
        >
          Account not registered
        </h1>
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: "var(--go-text-secondary)" }}
        >
          Your account is not registered for this application. Please contact
          support if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
