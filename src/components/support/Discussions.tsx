'use client';

import Giscus from '@giscus/react';
import { useThemeStore } from '../theme';
import { useLanguage } from '../../i18n/LanguageProvider';

export default function Discussions() {
    const isDark = useThemeStore((state) => state.isDark);
    const { language } = useLanguage();

    return (
        <div className="w-full">
            <Giscus
                id="comments"
                repo={process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`}
                repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID!}
                category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY!}
                categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!}
                mapping="pathname"
                term="Welcome to console.svc.plus Discussions!"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={isDark ? 'dark' : 'light'}
                lang={language === 'zh' ? 'zh-CN' : 'en'}
                loading="lazy"
            />
        </div>
    );
}
