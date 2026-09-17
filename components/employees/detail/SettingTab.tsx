import { InfoField, InputField, SectionCard } from "./DetailFields";

type SettingTabProps = {
  timezone: string;
  calendarVisibility: "Everyone" | "Only me";
  accountSettingsEditing: boolean;
  privacyEditing: boolean;
  onTimezoneChange: (value: string) => void;
  onCalendarVisibilityChange: (value: "Everyone" | "Only me") => void;
  onToggleAccountSettings: () => void;
  onTogglePrivacy: () => void;
  onCancelAccountSettings: () => void;
  onCancelPrivacy: () => void;
  onSaveAccountSettings: () => void;
  onSavePrivacy: () => void;
};

export function SettingTab({ timezone, calendarVisibility, accountSettingsEditing, privacyEditing, onTimezoneChange, onCalendarVisibilityChange, onToggleAccountSettings, onTogglePrivacy, onCancelAccountSettings, onCancelPrivacy, onSaveAccountSettings, onSavePrivacy }: SettingTabProps) {
  return <div className="mt-5 space-y-5">
    <SectionCard title="Account Settings" isEditing={accountSettingsEditing} onToggleEdit={onToggleAccountSettings} onCancel={onCancelAccountSettings} onSave={onSaveAccountSettings}>
      {accountSettingsEditing ? <InputField label="Timezone" value={timezone} onChange={onTimezoneChange} /> : <InfoField label="Timezone" value={timezone} />}
    </SectionCard>
    <SectionCard title="Privacy" isEditing={privacyEditing} onToggleEdit={onTogglePrivacy} onCancel={onCancelPrivacy} onSave={onSavePrivacy}>
      {privacyEditing ? <InputField label="Who can see your birthday on calendar?" value={calendarVisibility} onChange={(value) => onCalendarVisibilityChange(value as "Everyone" | "Only me")} selectOptions={["Everyone", "Only me"]} /> : <InfoField label="Who can see your birthday on calendar?" value={calendarVisibility} />}
    </SectionCard>
  </div>;
}
