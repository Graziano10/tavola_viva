import { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-300">{eyebrow}</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
        <p className="text-base text-stone-300">{description}</p>
      </div>
      {action}
    </div>
  );
}
