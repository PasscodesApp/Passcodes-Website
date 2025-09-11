import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import constants from "@/libs/constants";
import {
  ArrowBigDownDash,
  CodeXml,
  Download,
  NotebookText,
} from "lucide-react";
import Link from "next/link";

export default async function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">
            Download <span className="hidden sm:inline">Application</span>
          </h1>
          <p className="hidden sm:inline text-xl text-muted-foreground leading-relaxed">
            Passcodes app takes down your headache of remembering password.
          </p>
        </div>

        {/* Repository Info */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowBigDownDash />
                Android Application Download
              </CardTitle>
              <CardDescription>
                Stable Release has relatively less bugs..
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="gap-2" size="lg" asChild>
                  <Link href={constants.GITHUB_LATEST_RELEASE_URL}>
                    <Download className="h-5 w-5" />
                    <span className="hidden sm:inline">Download</span> Stable
                    Version
                  </Link>
                </Button>
                <Button variant="outline" className="gap-2" size="lg" asChild>
                  <Link href={constants.GITHUB_LATEST_RELEASE_URL}>
                    <Download className="h-5 w-5" />
                    <span className="hidden sm:inline">Download</span> Latest
                    Version
                  </Link>
                </Button>
              </div>
              <div className="hidden sm:flex flex-col flex-row gap-4">
                <Button variant="link" className="gap-2" size="sm" asChild>
                  <Link href={constants.GITHUB_REPO_URL}>
                    <CodeXml className="h-5 w-5" />
                    Source Code
                  </Link>
                </Button>
                <Button variant="link" className="gap-2" size="sm" asChild>
                  <Link href={constants.RELEASE_NOTES_URL}>
                    <NotebookText className="h-5 w-5" />
                    Release Notes
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
