"use client"

import { SoundType } from "@/types/sound";
import { useCallback, useRef } from "react"

// Store the parameters for each sound type
const SOUND_PARAMS: Record<SoundType, Array<{ frequency: number; duration: number; volume: number; delay?: number }>> = {
  success: [
    { frequency: 523.25, duration: 0.1, volume: 0.6 }, // C5
    { frequency: 659.25, duration: 0.15, volume: 0.6, delay: 100 }, // E5
  ],
  error: [
    { frequency: 392, duration: 0.2, volume: 0.6 }, // G4
    { frequency: 293.66, duration: 0.3, volume: 0.6, delay: 150 }, // D4
  ],
  info: [
    { frequency: 440, duration: 0.15, volume: 0.6 }, // A4
  ],
}

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)

  // The original createBeep function
  const createBeep = (frequency: number, duration: number, volume = 0.1) => {
    const audioContext = audioContextRef.current!
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }

  const playSound = useCallback((type: SoundType) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    const audioContext = audioContextRef.current
    const paramsArr = SOUND_PARAMS[type]
    paramsArr.forEach(({ frequency, duration, volume, delay }) => {
      if (delay) {
        setTimeout(() => createBeep(frequency, duration, volume), delay)
      } else {
        createBeep(frequency, duration, volume)
      }
    })
  }, [])

  return { playSound }
}
