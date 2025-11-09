'use client'
import Image from "next/image"
import { useEffect, useState } from "react"

type AdBannerProps = {
  dataAdSlot: string,
  dataAdFormat: string,
  dataFullWidthResponsive: boolean
}

const AdInTake = ({ dataAdSlot, dataAdFormat, dataFullWidthResponsive }: AdBannerProps) => {
  const [adLoaded, setAdLoaded] = useState(false)

  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || []
      ;(window as any).adsbygoogle.push({})
      setTimeout(() => {
        // crude check if ads injected something
        const adEl = document.querySelector(".adsbygoogle") as HTMLElement
        if (adEl && adEl.innerHTML.trim().length > 0) {
          setAdLoaded(true)
        }
      }, 2000)
    } catch (error) {
      console.log("AdSense error:", error)
    }
  }, [])

  return (
    <div className="ad-container overflow-x-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5597598848182147"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></ins>

      {!adLoaded && (
        <div className="right-profiles flex flex-col justify-start">
          <h6 className="text-2xl font-semibold">Ads</h6>
          <div className="py-2 rounded-3xl flex h-max items-center justify-start">
            <Image src="/ad.png" className="ad-img" height={200} width={300} alt="ad" />
          </div>
        </div>
      )}
    </div>
  )
}

export default AdInTake
