import {
    LogLevel,
    NotationMode,
    TabRhythmMode,
    LayoutMode,
    StaveProfile,
    PlayerOutputMode,
    ScrollMode,
    SystemsLayoutMode,
    AlphaTabApi
} from "@coderline/alphatab";

interface AlphaTabSettingsParams {
    fileUrl: string;
    selectedTrack: number;
    showNotation: boolean;
    showTablature: boolean;
    showFingering: boolean;
    selectedLayout: LayoutMode;
    showMetronome: boolean;
    currentPage: number;
    scrollElement: HTMLDivElement;
}

export class AlphaTabService {
    private static readonly SOUNDFONT_URL = 'https://cdn.jsdelivr.net/npm/@coderline/alphatab/dist/soundfont/sonivox.sf2';
    
    static async initializePlayer(api: AlphaTabApi): Promise<void> {
        return new Promise((resolve) => {
            api.playerReady.on(() => {
                console.log("Player is ready");
                resolve();
            });

            api.playerStateChanged.on((state) => {
                console.log("Player state changed:", state);
            });

            // Subscribe to loading error events
            api.soundFontLoad.on(() => {
                console.log("SoundFont loading started");
            });

            api.soundFontLoaded.on(() => {
                console.log("SoundFont loaded successfully");
            });

            // Load the soundfont explicitly
            api.loadSoundFont(AlphaTabService.SOUNDFONT_URL);
        });
    }

    static getSettings(params: AlphaTabSettingsParams) {
        return {
            core: {
                logLevel: LogLevel.Debug,
                fontDirectory: "https://cdn.jsdelivr.net/npm/@coderline/alphatab/dist/font/",
                file: params.fileUrl,
                tracks: [params.selectedTrack],
                engine: "html5",
                useWorkers: false, // Changed to false to help with debugging
                enableLazyLoading: false,
                tex: false
            },
            notation: {
                notationMode: params.showNotation && params.showTablature ? NotationMode.GuitarPro 
                            : params.showNotation ? NotationMode.SongBook 
                            : NotationMode.GuitarPro,
                rhythmMode: TabRhythmMode.ShowWithBars,
                fingeringMode: params.showFingering ? 1 : 0,
                elements: {
                    barNumber: true,
                    chordDiagrams: true,
                    rhythm: true,
                    fingering: params.showFingering
                },
                rhythmHeight: 15,
                transpositionPitches: [] as number[],
                displayTranspositionPitches: [] as number[],
                smallGraceTabNotes: false
            },
            display: {
                layoutMode: params.selectedLayout,
                scale: 1,
                staveProfile: StaveProfile.Default,
                systemsLayoutMode: SystemsLayoutMode.UseModelLayout,
                stretchForce: 0.8,
                barsPerRow: 4,
                startBar: (params.currentPage - 1) * 4,
                barCount: -1
            },
            player: {
                soundFont: this.SOUNDFONT_URL,
                audioWorklet: false, // Try without audioWorklet first
                enablePlayer: true,
                outputMode: PlayerOutputMode.WebAudioAudioWorklets, // Changed to WebAudioWorklets
                enableCursor: true,
                enableAnimatedBeatCursor: true,
                enableElementHighlighting: true,
                scrollElement: params.scrollElement,
                scrollOffsetX: -50,
                scrollOffsetY: -20,
                scrollMode: ScrollMode.Continuous,
                metronomeVolume: params.showMetronome ? 1 : 0
            }
        };
    }

    static calculateTotalPages(masterBarsLength: number, barsPerRow: number = 4): number {
        return Math.ceil((masterBarsLength || 0) / barsPerRow);
    }

    static calculateStartBar(page: number, barsPerRow: number = 4): number {
        return (page - 1) * barsPerRow;
    }

    static getDefaultState() {
        return {
            currentPage: 1,
            totalPages: 1,
            isPlaying: false,
            tempo: 100,
            currentBar: 0,
            tracks: [] as any[],
            selectedTrack: 0,
            showNotation: true,
            showTablature: true,
            selectedLayout: LayoutMode.Page,
            showFingering: true,
            showMetronome: false,
            volume: 100
        };
    }

    static formatTime(timeInSeconds: number): string {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    static isValidFileType(fileType: string): boolean {
        const validTypes = ['gp3', 'gp4', 'gp5', 'gpx', 'gp'];
        return validTypes.includes(fileType.toLowerCase());
    }

    static adjustVolumeLevel(volume: number): number {
        return Math.max(0, Math.min(100, volume)) / 100;
    }

    static adjustTempo(tempo: number): number {
        return Math.max(25, Math.min(200, tempo));
    }
}