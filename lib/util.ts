import * as Speech from 'expo-speech'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const truthy = <T>(value: T): value is T => Boolean(value)

export const sortBy = <T extends { [key: string]: string }>(key: keyof T) => (a: T, b: T) =>
  a[key].localeCompare(b[key])

export const getSavedState = async (key: string, fallback?: any) => {
  try {
    const json = await AsyncStorage.getItem(key)
    return json?.trim() ? JSON.parse(json) : fallback
  } catch (e) {
    return fallback
  }
}

export const saveState = async (key: string, state: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(state))
    return true
  } catch (e) {
    return false
  }
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const retryPromise = <T extends (...args: any[]) => Promise<any>>(
  times: number,
  promiseFn: T
): ReturnType<T> => {
  return promiseFn().catch(async error => {
    console.log('promised failed, retry', times, error)
    if (times > 0) {
      await sleep(200)
      return await retryPromise(times - 1, promiseFn)
    }
    throw error
  }) as ReturnType<T>
}

export const getVoices = async () => {
  const voices = await Speech.getAvailableVoicesAsync()
  if (voices.length <= 0) throw new Error('could not find voices :(')

  return {
    voices: voices.sort(sortBy('name')),
    languages: [...new Set(voices.map(x => x.language))].sort(),
  }
}

const sentenceEnd = '.;\n…!?'
const quoteEnd = '”"'

export const chunkText = (text: string, chunkSize = 200): string[] => {
  if (text?.trim().length <= 0) return []

  const chunks: string[] = []
  let lastIndex = 0

  for (let i = 0; i < text.length; i++) {
    if (i - lastIndex > chunkSize && sentenceEnd.includes(text.charAt(i))) {
      if (quoteEnd.includes(text.charAt(i + 1))) i += 1
      chunks.push(text.slice(lastIndex, i + 1))
      lastIndex = i + 1
    }
  }

  const lastBit = text.slice(lastIndex)
  if (lastBit.trim()) chunks.push(lastBit)

  return chunks
}

export const chunkStats = (value: string, chunks: string[]) => {
  const wordCount = value.split(/\s+/gmu).length
  const averageCharPerChunk = Math.round(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0) / chunks.length
  )
  return [
    `Finished reading ${wordCount} words`,
    `${averageCharPerChunk} characters per chunk on average`,
    'Thanks for listening friendo',
  ].join('. ')
}

export const genId = () => Math.random().toString(36).slice(2)

export const debounce = <T extends (...args: any) => void>(ms: number, fn: T) => {
  let id = 0
  return (...args: Parameters<T>) => {
    window.clearTimeout(id)
    id = window.setTimeout(() => fn(...(args as any)), ms)
  }
}
