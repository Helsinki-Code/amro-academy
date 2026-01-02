'use client';

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import Image from "next/image";
import {formUrlQuery, removeKeysFromUrlQuery} from "@jsmastery/utils";

const SearchInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('topic') || '';

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if(searchQuery) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "topic",
                    value: searchQuery,
                });

                router.push(newUrl, { scroll: false });
            } else {
                if(pathname === '/companions') {
                    const newUrl = removeKeysFromUrlQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["topic"],
                    });

                    router.push(newUrl, { scroll: false });
                }
            }
        }, 500)
    }, [searchQuery, router, searchParams, pathname]);

    return (
        <div className="relative h-11 w-full rounded-lg bg-card border border-border flex items-center gap-2.5 px-4 py-3 transition-all duration-300 hover:border-primary/50 focus-within:border-primary focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary/20 group">
            <Image
                src="/icons/search.svg"
                alt="search"
                width={18}
                height={18}
                className="opacity-50 group-focus-within:opacity-100 transition-opacity duration-200 flex-shrink-0"
            />
            <input
                placeholder="Search companions..."
                className="outline-none bg-transparent text-foreground placeholder:text-foreground-muted/60 w-full text-sm font-medium transition-colors duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
                <button
                    onClick={() => setSearchQuery('')}
                    className="flex-shrink-0 text-foreground-muted hover:text-foreground transition-colors duration-200"
                    aria-label="Clear search"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    )
}
export default SearchInput
