const sampleText = `
An old silent pond.
A frog jumps into the pond.
Splash! Silence again.
`.trim()

export interface State {
  value: string
  language: string
  voice: string
  pitch: string
  rate: string
  chunkIndex: number
}

export const initialState: State = {
  value: sampleText,
  language: 'en-US',
  voice: 'en-us-x-tpd-network',
  pitch: '1',
  rate: '1',
  chunkIndex: 0,
}
