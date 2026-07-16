import { PageHeader } from "@/components/dashboard/ui";

export default function ComingSoon({ title, blurb }: { title: string; blurb: string }) {
  return (
    <>
      <PageHeader title={title} subtitle={blurb} />
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] py-20 text-center">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">work in progress</div>
        <p className="mt-3 max-w-sm text-sm text-white/40">
          This section isn&apos;t ready yet — it&apos;s coming in a future update.
        </p>
      </div>
    </>
  );
}
