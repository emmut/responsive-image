"use client";

import { useEffect, useRef, useState } from "react";
import { clsx as cn } from "clsx";

type ResponsiveImageProps = {
  className?: string;
  src: string;
  width: number;
  height: number;
  alt?: string;
  quality?: number;
  loading?: "lazy" | "eager";
};

function buildUrl(
  src: string,
  width: number,
  height: number,
  quality?: number
) {
  const url = new URL(`https:${src}`);

  if (url.pathname.endsWith(".svg")) {
    return url.href;
  }
  url.searchParams.set("fm", "webp");
  url.searchParams.set("w", width.toString());
  url.searchParams.set("h", height.toString());
  url.searchParams.set("q", (quality ?? 75).toString());
  url.searchParams.set("fit", "fill");

  return url.href;
}

export default function ResponsiveImage({
  className,
  src,
  alt,
  width,
  height,
  quality = 75,
  loading = "lazy",
  ...props
}: ResponsiveImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [srcUrl, setSrcUrl] = useState<string>();

  useEffect(() => {
    let w = imgRef.current?.clientWidth ?? 1;
    let h = imgRef.current?.clientHeight ?? 1;

    if (w === 0) {
      w = width;
    }

    if (h === 0) {
      h = height;
    }

    const dpi = window.devicePixelRatio ?? 1;
    const dpiW = Math.floor(w * dpi);
    const dpiH = Math.floor(h * dpi);

    // console.log({ image: imgRef.current, w, h, dpi, dpiW, dpiH })

    setSrcUrl(buildUrl(src, dpiW, dpiH, quality));

    imgRef.current?.addEventListener("load", () => {
      setIsLoading(false);
    });
  }, [src, quality, width, height]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    // @ts-ignore
    <img
      ref={imgRef}
      src={srcUrl}
      width={width}
      height={height}
      style={{ aspectRatio: `${width}/${height}` }}
      alt={alt}
      loading={loading}
      className={cn(className, {
        "opacity-0": isLoading,
      })}
      {...props}
    />
  );
}

ResponsiveImage.displayName = "ResponsiveImage";
