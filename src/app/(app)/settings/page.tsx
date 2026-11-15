import { SettingsForm } from "@/src/components/settings/settings-form";
import { TimezoneField, type TimezoneOption } from "@/src/components/settings/timezone-field";
import { Field } from "@/src/components/ui/field";
import { PageHeader } from "@/src/components/ui/page-header";
import { requireProfile } from "@/src/lib/auth";
import { timezoneOf } from "@/src/lib/data/users";
import { timezoneOffsetLabel } from "@/src/lib/dates";
import { MIN_PASSWORD_LENGTH } from "@/src/lib/validation";
import { changeEmail, changePassword, deleteAccount, updateProfile } from "./actions";

/** Every timezone the runtime knows, plus the saved one in case it isn't listed. */
function timezoneOptions(saved: string): TimezoneOption[] {
  const zones = new Set(["UTC", saved, ...Intl.supportedValuesOf("timeZone")]);
  return [...zones]
    .sort()
    .map((zone) => ({ value: zone, label: `${zone} (${timezoneOffsetLabel(zone)})` }));
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="headline mt-1 mb-6 text-5xl">{title}</h2>
      {children}
    </section>
  );
}

export default async function SettingsPage() {
  const profile = await requireProfile();
  const timezone = timezoneOf(profile);

  return (
    <div className="flex flex-col gap-16">
      <PageHeader eyebrow={`Signed in as ${profile.email}`} title="Settings" />

      <Section eyebrow="What friends see" title="Profile">
        <SettingsForm action={updateProfile} submitLabel="Save profile">
          <Field
            label="Username"
            name="username"
            required
            minLength={2}
            maxLength={24}
            autoComplete="username"
            defaultValue={profile.username}
          />
          <TimezoneField name="timezone" defaultValue={timezone} options={timezoneOptions(timezone)} />
        </SettingsForm>
      </Section>

      <Section eyebrow="Sign-in" title="Email">
        <SettingsForm action={changeEmail} submitLabel="Change email">
          <Field
            label="New email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={profile.email}
          />
        </SettingsForm>
      </Section>

      <Section eyebrow="Sign-in" title="Password">
        <SettingsForm action={changePassword} submitLabel="Change password">
          <Field
            label="Current password"
            name="current"
            type="password"
            required
            autoComplete="current-password"
          />
          <Field
            label="New password"
            name="next"
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
          />
          <Field
            label="New password again"
            name="confirm"
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
          />
        </SettingsForm>
      </Section>

      <Section eyebrow="Permanent" title="Delete account">
        <SettingsForm action={deleteAccount} submitLabel="Delete my account" variant="danger">
          <p className="max-w-md text-sm text-steel">
            This removes your workouts, plans and friendships for good. It can&apos;t be
            undone. Type your username,{" "}
            <span className="text-chalk">{profile.username}</span>, to confirm.
          </p>
          <Field label="Username" name="confirm" required autoComplete="off" />
        </SettingsForm>
      </Section>
    </div>
  );
}
