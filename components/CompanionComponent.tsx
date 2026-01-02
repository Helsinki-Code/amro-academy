'use client';

import {useEffect, useRef, useState, Suspense} from 'react'
import {cn, configureAssistant, getSubjectColor} from "@/lib/utils";
import {vapi} from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, {LottieRefCurrentProps} from "lottie-react";
import soundwaves from '@/constants/soundwaves.json'
import {addToSessionHistory} from "@/lib/actions/companion.actions";
import { Orb, type AgentState } from "@/components/Orb";
import { BarVisualizer, type AgentState as BarState } from "@/components/ui/audio-analyser";
import { ShimmeringText } from "@/components/ui/shimmering-text";
import { Response } from "@/components/ui/response";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if(lottieRef) {
            if(isSpeaking) {
                lottieRef.current?.play()
            } else {
                lottieRef.current?.stop()
            }
        }
    }, [isSpeaking, lottieRef])

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            addToSessionHistory(companionId)
        }

        const onMessage = (message: Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage= { role: message.role, content: message.transcript}
                setMessages((prev) => [newMessage, ...prev])
            }
        }

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => console.log('Error', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        }
    }, []);

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted)
    }

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING)

        const assistantOverrides = {
            variableValues: { subject, topic, style },
            clientMessages: ["transcript"],
            serverMessages: [],
        }

        // @ts-expect-error
        vapi.start(configureAssistant(voice, style), assistantOverrides)
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    }

    // Map call status and speaking state to Orb agentState
    const getAgentState = (): AgentState => {
        if (callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED) {
            return null;
        }
        if (callStatus === CallStatus.CONNECTING) {
            return "thinking";
        }
        if (callStatus === CallStatus.ACTIVE) {
            return isSpeaking ? "talking" : "listening";
        }
        return null;
    };

    // Map call status to BarVisualizer state
    const getBarState = (): BarState | undefined => {
        if (callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED) {
            return undefined;
        }
        if (callStatus === CallStatus.CONNECTING) {
            return "connecting";
        }
        if (callStatus === CallStatus.ACTIVE) {
            return isSpeaking ? "speaking" : "listening";
        }
        return undefined;
    };

    // AMRO Academy colors (cyan theme)
    const orbColors: [string, string] = ["#00CED1", "#008B8B"];

    return (
        <section className="flex flex-col h-[70vh] gap-6">
            {/* Avatar Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Companion Section */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                    <div className="companion-avatar relative w-48 h-48 rounded-xl flex items-center justify-center mb-4 overflow-hidden" style={{ backgroundColor: getSubjectColor(subject), boxShadow: `0 8px 32px ${getSubjectColor(subject)}40` }}>
                        {/* Show subject icon when inactive/finished */}
                        <div
                            className={cn(
                                'absolute transition-opacity duration-1000 flex items-center justify-center z-10',
                                callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0',
                                callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
                            )}
                        >
                            <Image src={`/icons/${subject}.svg`} alt={subject} width={120} height={120} className="max-sm:w-fit" />
                        </div>

                        {/* Orb component for active sessions */}
                        <div className={cn('absolute inset-0 transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100': 'opacity-0')}>
                            <Suspense fallback={<div className="w-full h-full bg-primary/10 animate-pulse rounded-xl" />}>
                                <Orb
                                    agentState={getAgentState()}
                                    colors={orbColors}
                                    className="w-full h-full"
                                />
                            </Suspense>
                        </div>
                    </div>
                    <h3 className="font-bold text-2xl text-foreground text-center">
                        <ShimmeringText 
                            text={name} 
                            duration={3}
                            repeat={callStatus === CallStatus.ACTIVE}
                            shimmerColor="hsl(186 100% 50%)"
                        />
                    </h3>
                    <p className="text-sm text-foreground-muted mt-2">AI Learning Companion</p>
                    
                    {/* Audio Visualizer */}
                    {callStatus === CallStatus.ACTIVE && (
                        <div className="w-full mt-4">
                            <BarVisualizer
                                state={getBarState()}
                                barCount={15}
                                demo={true}
                                minHeight={15}
                                maxHeight={90}
                            />
                        </div>
                    )}
                </div>

                {/* User Section */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <Image
                                src={userImage}
                                alt={userName}
                                width={130}
                                height={130}
                                className="rounded-xl border-4 border-primary/20 object-cover shadow-lg"
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-2xl text-foreground">{userName}</h3>
                            <p className="text-sm text-foreground-muted mt-1">Student</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full mt-6">
                        <button
                            className={cn(
                                'flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300',
                                'border border-border bg-card hover:bg-card/80 text-foreground',
                                callStatus !== CallStatus.ACTIVE && 'opacity-50 cursor-not-allowed'
                            )}
                            onClick={toggleMicrophone}
                            disabled={callStatus !== CallStatus.ACTIVE}
                        >
                            <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt="mic" width={20} height={20} />
                            <span className="max-sm:hidden">
                                {isMuted ? 'Mic Off' : 'Mic On'}
                            </span>
                        </button>

                        <button
                            className={cn(
                                'px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center',
                                callStatus === CallStatus.ACTIVE
                                    ? 'btn-destructive hover:bg-red-600 shadow-lg hover:shadow-xl'
                                    : 'btn-primary hover:shadow-lg',
                                callStatus === CallStatus.CONNECTING && 'animate-pulse'
                            )}
                            onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                        >
                            {callStatus === CallStatus.ACTIVE
                            ? "End Session"
                            : callStatus === CallStatus.CONNECTING
                                ? 'Connecting...'
                            : 'Start Session'
                            }
                        </button>
                    </div>
                </div>
            </section>

            {/* Transcript Section */}
            <section className="flex-1 flex flex-col rounded-2xl bg-card border border-border overflow-hidden">
                <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                    <div className="transcript-message space-y-4">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-center">
                                <p className="text-foreground-muted text-sm">
                                    {callStatus === CallStatus.ACTIVE ? (
                                        <ShimmeringText 
                                            text="Start speaking to begin..." 
                                            duration={2}
                                            repeat={true}
                                            shimmerColor="hsl(186 100% 50%)"
                                        />
                                    ) : (
                                        'Session transcript will appear here'
                                    )}
                                </p>
                            </div>
                        ) : (
                            messages.map((message, index) => {
                                const isAssistant = message.role === 'assistant';
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            'flex gap-3 animate-slide-up',
                                            isAssistant ? 'justify-start' : 'justify-end'
                                        )}
                                    >
                                        <div className={cn(
                                            'max-w-xs px-4 py-3 rounded-lg',
                                            isAssistant
                                                ? 'bg-primary/10 border border-primary/20 text-foreground rounded-bl-none'
                                                : 'bg-primary text-primary-foreground rounded-br-none'
                                        )}>
                                            <p className="text-xs font-semibold opacity-70 mb-1">
                                                {isAssistant ? name : userName}
                                            </p>
                                            {isAssistant ? (
                                                <Response className="text-sm">
                                                    {message.content}
                                                </Response>
                                            ) : (
                                                <p className="text-sm">{message.content}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="transcript-fade" />
            </section>
        </section>
    )
}

export default CompanionComponent
