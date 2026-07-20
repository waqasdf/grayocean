/**
 * Shared page hero — matches auth typography language
 * (kicker + Inter Tight title + muted subtitle).
 */
export default function PageHero({ kicker = "Workspace", title, subtitle, action }) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {kicker ? <p className="go-kicker mb-2">{kicker}</p> : null}
          <h1 className="go-page-title">{title}</h1>
          {subtitle ? <p className="go-page-subtitle mt-2 max-w-xl">{subtitle}</p> : null}
        </div>
        {action ? <div className="flex-shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
