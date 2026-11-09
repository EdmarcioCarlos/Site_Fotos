import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/session";
import { listSiteSettings, type SiteSetting } from "@/lib/events";
import { updateSettingsAction, type SettingsFormState } from "../actions";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  await requireOwner();
  const settings = await listSiteSettings();

  return <SettingsForm initialSettings={settings} action={updateSettingsAction} />;
}