import { useStore } from './state'
import { retryPromise, getVoices, chunkText } from '../lib/util'

const { set, subscribe } = useStore

// fetch voices/languages on load
subscribe(
  s => s.loaded,
  loaded => {
    if (!loaded) return
    retryPromise(3, getVoices).then(({ voices, languages }) =>
      set({ languages, voices, language: x => (languages.includes(x) ? x : languages[0]) })
    )
  }
)

// sync language choices
subscribe([s => s.language, s => s.voices], (language, voices) => {
  if (!language || voices.length <= 0) return
  const filteredVoices = voices.filter(voice => voice.language === language)
  set({
    filteredVoices,
    voice: voice =>
      filteredVoices.some(x => x.identifier === voice) ? voice : filteredVoices[0].identifier,
  })
})

// chunk text when value changes
subscribe([s => s.loaded, s => s.value], (loaded, value) => {
  if (!loaded) return
  const chunks = chunkText(value)
  set({ reading: false, chunks, chunkIndex: x => (x >= chunks.length ? 0 : x) })
})
