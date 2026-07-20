import { Link, useParams } from "react-router-dom";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  SimpleLink,
} from "@/components/marketing/primitives";
import { POSTS } from "./Blog";

const SAMPLE = {
  slug: "sample",
  title: "Sample post",
  date: "Jul 1, 2026",
  excerpt: "A generic template for GrayOcean blog posts.",
  body: [
    "This is a placeholder post body. Replace it with CMS content or MDX later.",
    "GrayOcean posts stay short and practical: what changed, why it matters, and what to do next.",
    "Link out to Docs when readers need procedures; keep the blog for narrative and decisions.",
  ],
};

export default function BlogPost() {
  const { slug } = useParams();
  const fromList = POSTS.find((p) => p.slug === slug);
  const post = fromList
    ? {
        ...fromList,
        body: [
          fromList.excerpt,
          "Full article content will live here. For now this template renders the list metadata plus a short body so routes work end to end.",
          "When you wire a CMS, keep the same shell and typography — go-h2 for titles, 15px body feel, thin borders.",
        ],
      }
    : SAMPLE;

  return (
    <MarketingShell>
      <Section className="!pt-16 md:!pt-24 !pb-8">
        <Container className="max-w-2xl">
          <p className="go-kicker mb-3" style={{ color: "var(--go-accent-text)" }}>
            Blog
          </p>
          <p className="text-[13px] mb-4" style={{ color: "var(--go-text-muted)" }}>
            {post.date}
          </p>
          <h1 className="go-h2 mb-6">{post.title}</h1>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container className="max-w-2xl space-y-5">
          {post.body.map((para) => (
            <p key={para.slice(0, 24)} className="text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
              {para}
            </p>
          ))}

          <div className="pt-10 flex flex-wrap gap-3 border-t" style={{ borderColor: "var(--go-border)" }}>
            <SimpleLink to="/blog" variant="ghost">← All posts</SimpleLink>
            <Link to="/docs" className="text-[14px] inline-flex items-center" style={{ color: "var(--go-accent-text)" }}>
              Documentation
            </Link>
          </div>
        </Container>
      </Section>
    </MarketingShell>
  );
}
