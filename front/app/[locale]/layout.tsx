import type {Metadata} from "next";
import {Nunito} from "next/font/google";
import {ReactNode} from "react";
import "@/shared/styles/main.css";
import {ThemeSwitch, Toaster} from "@/shared/components";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {routing} from "@/shared/i18n/routing";
import {notFound} from "next/navigation";

const nunito = Nunito({
    subsets: ['cyrillic'],
    variable: '--font-nunito',
    weight: ['500', '600', '700', '900'],
});

export const metadata: Metadata = {
    title: "Bot4You",
};

export default async function LocaleLayout({children, params}: {
    children: ReactNode;
    params: Promise<{locale: string}>;
}) {
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale}>
        <body className={nunito.variable}>
        <NextIntlClientProvider>
            <ThemeSwitch/>
            {children}
            <Toaster position="top-center"/>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}