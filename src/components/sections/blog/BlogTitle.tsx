import type { FunctionComponent } from "react";

interface BlogTitleProps {
  text: string;
}

const BlogTitle: FunctionComponent<BlogTitleProps> = ({ text }) => (
  <h1 className="mb-8 text-4xl font-black leading-tight tracking-tight text-default sm:text-5xl lg:text-6xl">{text}</h1>
);

export default BlogTitle;
