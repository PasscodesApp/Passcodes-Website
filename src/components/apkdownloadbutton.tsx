"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import constants from "@/libs/constants";

type Asset = {
  url: string;
  id: number;
  name: string;
  download_count: number;
  browser_download_url: string;
};

type Release = {
  html_url: string;
  id: number;
  tag_name: string;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: Asset[];
};

export async function getLatestDownloadableUniversalApkAssetData() {
  try {
    console.groupCollapsed("Github Release API Call:-");

    let res = await fetch(constants.GITHUB_LATEST_RELEASE_API_URL);
    let latestRelease: Release = await res.json();
    console.log("Response:", latestRelease);

    let assets = latestRelease.assets;
    let universalApkAssets = assets.find(
      (asset) =>
        asset.name.toLowerCase().includes("universal") &&
        asset.name.toLowerCase().endsWith(".apk")
    );

    console.log("universalApkAssets", universalApkAssets);

    if (!universalApkAssets) {
      console.error("No Universal Apk Found!!");
      throw new Error("No Universal Apk Found!!");
    }

    return {
      downloadUrl: universalApkAssets.browser_download_url,
      count: universalApkAssets.download_count,
    };
  } catch (e) {
    throw console.error("Can't find latest release!!");
  } finally {
    console.groupEnd();
  }
}

type ApkDownloadButtonProps = {
  fallbackUrl?: string;
};

export function ApkDownloadButton({
  fallbackUrl = constants.GITHUB_RELEASE_URL,
}: ApkDownloadButtonProps) {
  const [downloadUrl, setDownloadUrl] = useState<string>(
    constants.GITHUB_REPO_URL
  );
  const [downloadCount, setDownloadCount] = useState<number>(-1);

  useEffect(() => {
    async function fetchApk() {
      try {
        const universalApkAssetData =
          await getLatestDownloadableUniversalApkAssetData();

        if (universalApkAssetData) {
          setDownloadUrl(universalApkAssetData.downloadUrl);
          setDownloadCount(universalApkAssetData.count);
        } else {
          setDownloadUrl(fallbackUrl);
          setDownloadCount(0);
        }
      } catch {
        console.error("Error occured in fetch the release!!!");
      }
    }

    fetchApk();
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <Button size="lg" className="gap-2" disabled={!downloadUrl}>
        <Link
          className="flex items-center gap-2"
          href={downloadUrl || fallbackUrl}
          target="_blank"
        >
          <Download className="h-5 w-5" />
          Download APK
        </Link>
      </Button>
      <p>Downloads: {downloadCount}</p>
    </div>
  );
}
