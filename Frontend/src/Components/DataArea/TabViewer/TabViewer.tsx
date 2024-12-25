import React, { useEffect, useRef, useState } from "react";
import {
    AlphaTabApi,
    LayoutMode
} from "@coderline/alphatab";
import { TabControls } from "../TabControls/TabControls";
import { AlphaTabService } from "../../../Services/AlphaTabService";

interface TabViewerProps {
    fileUrl: string;
}

export interface TrackInfo {
    name: string;
    index: number;
}

export interface TabViewerState {
    currentPage: number;
    totalPages: number;
    isPlaying: boolean;
    tempo: number;
    currentBar: number;
    tracks: TrackInfo[];
    selectedTrack: number;
    showNotation: boolean;
    showTablature: boolean;
    selectedLayout: LayoutMode;
    showFingering: boolean;
    showMetronome: boolean;
    volume: number;
}

export function TabViewer({ fileUrl }: TabViewerProps): JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<AlphaTabApi | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize state using AlphaTabService
    const [state, setState] = useState<TabViewerState>(AlphaTabService.getDefaultState());

    // Update specific state properties
    const updateState = (updates: Partial<TabViewerState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    useEffect(() => {
        const initAlphaTab = async () => {
            if (!containerRef.current) {
                setError("Container reference is null.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Get settings from service
                const settings = AlphaTabService.getSettings({
                    fileUrl,
                    selectedTrack: state.selectedTrack,
                    showNotation: state.showNotation,
                    showTablature: state.showTablature,
                    showFingering: state.showFingering,
                    selectedLayout: state.selectedLayout,
                    showMetronome: state.showMetronome,
                    currentPage: state.currentPage,
                    scrollElement: containerRef.current
                });

                console.log("Initializing AlphaTab with settings:", settings);
                const api = new AlphaTabApi(containerRef.current, settings);
                apiRef.current = api;

                // Debug logging
                api.scoreLoaded.on((score) => {
                    console.log("Score loaded successfully:", score);
                    setIsLoading(false);
                    updateState({
                        totalPages: AlphaTabService.calculateTotalPages(score?.masterBars?.length),
                        tempo: api.playbackSpeed,
                        tracks: score?.tracks?.map((track: any, index: number) => ({
                            name: track.name || `Track ${index + 1}`,
                            index
                        })) || []
                    });
                });

                api.playerReady.on(() => {
                    console.log("Player is ready to play");
                });

                api.midiLoaded.on(() => {
                    console.log("MIDI data loaded successfully");
                });

                api.soundFontLoaded.on(() => {
                    console.log("SoundFont loaded successfully");
                });

                api.renderStarted.on(() => {
                    console.log("Started rendering score");
                    setIsLoading(true);
                });

                api.renderFinished.on(() => {
                    console.log("Finished rendering score");
                    setIsLoading(false);
                });

                api.playerStateChanged.on((e) => {
                    console.log("Player state changed:", e);
                    updateState({ isPlaying: e.state === 1 });
                });

                api.playerPositionChanged.on((e) => {
                    updateState({ currentBar: e.currentTime });
                });

                api.error.on((err) => {
                    console.error("AlphaTab error:", err);
                    setError(`Error: ${err.message}`);
                });

                // Initialize player
                try {
                    console.log("Starting player initialization");
                    await AlphaTabService.initializePlayer(api);
                    console.log("Player initialized successfully");
                } catch (e) {
                    console.error("Failed to initialize player:", e);
                    setError("Failed to initialize audio player. Playback might not work.");
                }

            } catch (err) {
                console.error("Error during AlphaTab initialization:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred");
                setIsLoading(false);
            }
        };

        initAlphaTab();

        return () => {
            if (apiRef.current) {
                console.log("Cleaning up AlphaTab instance");
                apiRef.current.destroy();
            }
        };
    }, [fileUrl, state.selectedTrack, state.showNotation, state.showTablature,
        state.selectedLayout, state.showFingering, state.currentPage]);

    return (
        <div className="tab-viewer">
            {isLoading && <div className="loading">Loading tab...</div>}
            {error && <div className="error">{error}</div>}

            <TabControls
                api={apiRef.current}
                state={state}
                updateState={updateState}
            />

            <div
                ref={containerRef}
                className="score-container"
                style={{
                    width: "100%",
                    minHeight: "600px",
                    backgroundColor: "white",
                    overflowX: "hidden",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    padding: "10px"
                }}
            />
        </div>
    );
}