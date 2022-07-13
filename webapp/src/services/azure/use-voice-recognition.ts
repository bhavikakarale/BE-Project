import { useState, useEffect, useContext } from 'react'
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import Spoken from 'spoken'
import { VoiceRecognitionHook, RecognitionRequest, RecognitionError } from '../use-voice-recognition'
import MyRecognizer from './voice-recognizer'
import IpcRenderer from '../electron-ipc'
import { GlobalContext } from '../global-context'

const useAzureVoiceRecognition: VoiceRecognitionHook = () => {
    const [results, setResults] = useState<RecognitionRequest | null>(null)
    const [error, setError] = useState<RecognitionError | null>(null)
    const { language = 'pt-BR', executeInternalCommand } = useContext(GlobalContext)
    const recognizer = MyRecognizer.getRecognizer()

    useEffect(() => {
        IpcRenderer.on('Spoken:executeCommandResult', (result: any) => {
            console.log('[webapp.services.azure-voice-recognition.onResultError]: Execute command result: ' + result)
        })

        return () => {
            IpcRenderer.removeAllListeners('Spoken:executeCommandResult')
        }
    }, [])

    useEffect(() => {
        console.log('[webapp.services.azure-voice-recognition]: Initializing')

        recognizer
            .on('results', (result: SpeechSDK.SpeechRecognitionResult, isFinal: boolean) => {
                if (!result.text || result.text.trim() === '') return

                const attempt = { text: sanitizePonctuation(result.text), isFinal, id: Date.now(), recognized: false }

                if (isFinal) {
                    const match = findComand(result, language)

                    attempt.recognized = !!match

                    if (attempt.recognized) {
                        if (match?.id?.startsWith('__')) executeInternalCommand(match)
                        else IpcRenderer.send('Spoken:executeCommand', match)
                    }
                }

                setResults(attempt)
            })
            .on('error', (err) => {
                setError({
                    __error: err,
                    mainTitle: 'Could not connect to Azure Speech to Text',
                    title: 'Azure STT does\'nt seem to be working',
                    subTitle: 'Try switching STT provider to Chrome',
                    body: `This project is powered by Azure Speech to Text, which is a paid service, so maybe my free credits are over.
                        If you are in the demo page try switching the STT provider to Chrome (free, works on Chrome and Edge).`
                })
                console.error('[webapp.services.azure-voice-recognition.onResultError]: Error', err.toString())
            })
            .init(language)

        return () => {
            recognizer.destroy()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language])

    const start = async () => {
        console.log('start')
        recognizer.start()
    }

    const stop = async () => {
        console.log('stop')
        recognizer.stop()
    }

    const analyzeSentence = async (phrase: string, timeout:number | null = 3000) => {
        const w = { text: sanitizePonctuation(phrase) }
        const attempt = { text: phrase, isFinal: true, id: Date.now(), recognized: false }
        const match = findComand(w as unknown as SpeechSDK.SpeechRecognitionResult, language)

        attempt.recognized = !!match

        const fn = () => {
            setResults(attempt)
            if (attempt.recognized) {
                if (match?.id?.startsWith('__')) executeInternalCommand(match)
                else IpcRenderer.send('Spoken:executeCommand', match)
            }
        }

        if (timeout) setTimeout(fn, timeout)
        else fn()
    }

    return {
        results,
        start,
        stop,
        error,
        analyzeSentence
    }
}


function findComand(voiceToTextResponse: SpeechSDK.SpeechRecognitionResult, language: string) {
    const text = sanitizePonctuation(voiceToTextResponse.text)
    const result = Spoken.recognizePhrase(text.toLocaleLowerCase(), language)

    if (result != null) {
        result.extra._rawVoiceToTextResponse = voiceToTextResponse
        result.extra.phrase = text
    }

    return result
}

function sanitizePonctuation(text: string) {
    return text.replace(/(?<! )(:|\*|,|\.|\?|!)/gi, ' $1')
}

export default useAzureVoiceRecognition
