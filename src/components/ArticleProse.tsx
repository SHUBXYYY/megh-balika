import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { normalizeBlogContent } from "@/lib/blog";

/**
 * Shared renderer for blog article content. Used by the public article page
 * (/blog/:slug) and the CMS live preview so both show identical typography.
 */
const ArticleProse = ({ content, className = "" }: { content: string; className?: string }) => (
  <div className={`article-prose ${className}`}>
    <ReactMarkdown>{normalizeBlogContent(content)}</ReactMarkdown>
  </div>
);

export default memo(ArticleProse);
