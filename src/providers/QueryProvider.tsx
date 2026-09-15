"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
    children: ReactNode;
}

const HOUR = 60 * 60 * 1000;

export function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: HOUR,
                        gcTime: 12 * HOUR,
                        retry: 2,
                        refetchOnWindowFocus: false,
                        networkMode: "offlineFirst",
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
