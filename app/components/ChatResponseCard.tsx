import { OpenAILogo } from "./OpenAILogo";

interface Props {
  children?: React.ReactNode | string;
  title?: string;
  subtitle?: string;
}
export function ChatResponseCard({
  children = "",
  title = "OpenAI Chat Completion API",
  subtitle = "",
}: Props) {
  return (
    <figure className="px-6 py-4 shadow-lg bg-sky-600 rounded-2xl ring-1 ring-gray-900/5">
      <p className="text-xl whitespace-pre-wrap">“{children}”</p>
      <figcaption className="flex items-center px-8 mt-6 text-sm gap-x-4">
        <OpenAILogo />
        <div>
          <div className="font-semibold">{title}</div>
          {subtitle && (
            <div className="font-mono text-gray-600">{subtitle}</div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}