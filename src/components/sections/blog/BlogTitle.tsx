import type { FunctionComponent } from "react";

interface BlogTitleProps {
  text: string;
}

const BlogTitle: FunctionComponent<BlogTitleProps> = ({ text }) => (
  <h1 className="text-blue-500">{text}</h1>
);

export default BlogTitle;
