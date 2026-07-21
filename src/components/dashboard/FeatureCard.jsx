import { cn } from "@/lib/utils";

export function FeatureCard({ icon: Icon, title, description, className }) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[10px] border border-go-border bg-go-surface p-5 go-transition",
        "hover:border-go-border-strong",
        className
      )}
    >
      {Icon ? (
        <Icon
          className="mb-3 size-5 text-go-text"
          strokeWidth={1.5}
          aria-hidden
        />
      ) : null}
      <h3 className="text-[14px] font-medium text-go-text">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-go-text-muted">
        {description}
      </p>
    </article>
  );
}
