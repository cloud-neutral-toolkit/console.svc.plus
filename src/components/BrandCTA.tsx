import Image from 'next/image'

type BrandCTAProps = {
  lang?: 'zh' | 'en'
  variant?: 'compact' | 'default'
}

const COPY = {
  zh: {
    main: '云原生实践 · 架构思考',
    secondary: '获取更多信息，可通过右侧官方渠道',
  },
  en: {
    main: 'Cloud-native practice · Architecture thinking',
    secondary: 'For more information, see the official channels on the right',
  },
}

export default function BrandCTA({ lang = 'en', variant = 'default' }: BrandCTAProps) {
  const content = COPY[lang]
  const isCompact = variant === 'compact'
  const imageSize = isCompact ? 160 : 180

  return (
    <section className={`flex items-center border-t border-slate-200 ${isCompact ? 'pt-3' : 'pt-4'}`}>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-slate-600">{content.main}</p>
        {!isCompact && (
          <>
            <div className="h-3" aria-hidden="true" />
            <p className="text-xs text-slate-500">{content.secondary}</p>
          </>
        )}
      </div>
      <div className="ml-6 flex justify-end">
        <Image
          src="/icons/webchat.jpg"
          alt={lang === 'zh' ? 'Cloud-Neutral 微信二维码' : 'Cloud-Neutral WeChat QR code'}
          width={imageSize}
          height={imageSize}
          className="h-auto w-auto"
        />
      </div>
    </section>
  )
}
