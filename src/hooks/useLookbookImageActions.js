import { useCallback } from "react";

import { showToast } from "../utils/toast";

const LOOKBOOK_MEDIA_ORIGIN = "https://hello1423.site";
const LOOKBOOK_MEDIA_PATH = "/media/lookbooks/";

const getDownloadSourceUrl = (imageUrl) => {
  const url = new URL(imageUrl, window.location.origin);

  if (
    url.origin === LOOKBOOK_MEDIA_ORIGIN &&
    url.pathname.startsWith(LOOKBOOK_MEDIA_PATH)
  ) {
    const relativePath = url.pathname.slice(
      LOOKBOOK_MEDIA_PATH.length,
    );

    return `/lookbook-media/${relativePath}${url.search}`;
  }

  return url.href;
};

export function useLookbookImageActions({
  imageUrl,
  shareSlug,
}) {
  const getImageFile = useCallback(async () => {
    if (!imageUrl) {
      throw new Error("저장할 이미지가 없습니다.");
    }

    const downloadSourceUrl =
      getDownloadSourceUrl(imageUrl);
    const response = await fetch(downloadSourceUrl);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "생성된 이미지 파일을 서버에서 찾을 수 없습니다.",
        );
      }

      throw new Error(
        `이미지 요청 실패: ${response.status}`,
      );
    }

    const blob = await response.blob();

    if (!blob.type.startsWith("image/")) {
      throw new Error(
        "서버에서 올바른 이미지 파일을 받지 못했습니다.",
      );
    }

    const extension =
      blob.type === "image/png" ? "png" : "jpg";

    return new File(
      [blob],
      `OandO-${shareSlug || "lookbook"}.${extension}`,
      {
        type: blob.type || "image/jpeg",
      },
    );
  }, [imageUrl, shareSlug]);

  const shareLookbookLink = useCallback(async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: "O&O Lookbook",
        text: "O&O에서 만든 나만의 화보",
        url: shareUrl,
      });

      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
    } else {
      const copyTarget = document.createElement("textarea");

      copyTarget.value = shareUrl;
      copyTarget.setAttribute("readonly", "");
      copyTarget.style.position = "fixed";
      copyTarget.style.opacity = "0";

      document.body.appendChild(copyTarget);
      copyTarget.select();

      const copied = document.execCommand("copy");

      copyTarget.remove();

      if (!copied) {
        throw new Error(
          "클립보드 복사를 지원하지 않습니다.",
        );
      }
    }

    showToast("화보 링크가 복사되었습니다.");
  }, []);

  const handleShare = useCallback(async () => {
    try {
      const imageFile = await getImageFile();
      const shareData = {
        files: [imageFile],
        title: "O&O Lookbook",
        text: "O&O에서 만든 나만의 화보",
      };

      if (
        navigator.share &&
        navigator.canShare?.(shareData)
      ) {
        await navigator.share(shareData);
        return;
      }

      await shareLookbookLink();
    } catch (error) {
      if (error?.name === "AbortError") return;

      try {
        await shareLookbookLink();
      } catch (shareError) {
        if (shareError?.name === "AbortError") return;

        showToast("화보를 공유하지 못했습니다.");
      }
    }
  }, [getImageFile, shareLookbookLink]);

  const handleDownload = useCallback(async () => {
    try {
      const imageFile = await getImageFile();
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" &&
          navigator.maxTouchPoints > 1);
      const shareData = {
        files: [imageFile],
        title: "O&O Lookbook",
      };

      if (
        isIOS &&
        navigator.share &&
        (!navigator.canShare ||
          navigator.canShare(shareData))
      ) {
        await navigator.share(shareData);
        return;
      }

      const downloadUrl = URL.createObjectURL(imageFile);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = imageFile.name;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);
    } catch (error) {
      if (error?.name === "AbortError") return;

      showToast(
        error?.message ||
          "이미지를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    }
  }, [getImageFile]);

  return {
    handleShare,
    handleDownload,
  };
}
