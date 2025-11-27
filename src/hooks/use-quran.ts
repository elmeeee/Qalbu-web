'use client'

import { useQuery } from '@tanstack/react-query'
import {
    getAllSurahs,
    getSurahById,
    getSurahWithAudio,
    getJuz,
    searchQuran,
    type Surah,
    type SurahDetail,
} from '@/lib/api/quran'

export function useAllSurahs() {
    return useQuery<Surah[]>({
        queryKey: ['surahs'],
        queryFn: getAllSurahs,
        staleTime: Infinity, // Surahs never change
    })
}

export function useSurah(id: number, withAudio: boolean = false) {
    return useQuery<SurahDetail>({
        queryKey: ['surah', id, withAudio],
        queryFn: () => (withAudio ? getSurahWithAudio(id) : getSurahById(id)),
        enabled: id > 0 && id <= 114,
        staleTime: Infinity,
    })
}

export function useJuz(juzNumber: number) {
    return useQuery({
        queryKey: ['juz', juzNumber],
        queryFn: () => getJuz(juzNumber),
        enabled: juzNumber > 0 && juzNumber <= 30,
        staleTime: Infinity,
    })
}

export function useQuranSearch(query: string) {
    return useQuery({
        queryKey: ['quranSearch', query],
        queryFn: () => searchQuran(query),
        enabled: query.length > 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}
