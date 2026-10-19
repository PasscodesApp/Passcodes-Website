import type { Metadata } from "next";
import { UpgradeContent } from "@/components/upgrade/UpgradeContent";
import { SITE_META } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Upgrade & Migration Guide | Passcodes",
    description:
        "Find the right next step for your Passcodes installation. Step-by-step guidance for first-time installs, version updates, legacy migrations, device changes, and backups.",
    openGraph: {
        title: "Upgrade & Migration Guide | Passcodes",
        description:
            "Find the right next step for your Passcodes installation. Guidance for first-time installs, version updates, legacy migrations, device changes, and backups.",
        url: `${SITE_META.url}/upgrade/`,
        siteName: "Passcodes",
        type: "website",
    },
};

export default function UpgradePage() {
    return <UpgradeContent />;
}
