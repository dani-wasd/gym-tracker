import { PageHeader } from "@/src/components/ui/page-header";
import { Section } from "@/src/components/ui/section";
import { LoadingRegion, SkeletonText } from "@/src/components/ui/skeleton";

/** Shown the instant the link is clicked, before the server has answered. */
export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-16">
      <PageHeader eyebrow="Your account" title="Settings" />
      <Section eyebrow="What friends see" title="Profile">
        <LoadingRegion label="settings">
          <SkeletonText width="24ch" lines={3} className="max-w-xl text-2xl" />
        </LoadingRegion>
      </Section>
    </div>
  );
}
