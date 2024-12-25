import React from "react";
import { AlphaTabApi, LayoutMode } from "@coderline/alphatab";
import { TabViewerState } from "../TabViewer/TabViewer";

interface TabControlsProps {
    api: AlphaTabApi | null;
    state: TabViewerState;
    updateState: (updates: Partial<TabViewerState>) => void;
}

export function TabControls({ api, state, updateState }: TabControlsProps): JSX.Element {
    const updateSettings = () => {
        if (!api) return;
        api.updateSettings();
        api.render();
    };

    const handlePrevPage = () => {
        if (!api || state.currentPage <= 1) return;
        
        const newPage = state.currentPage - 1;
        const startBar = (newPage - 1) * 4;
        api.settings.display.startBar = startBar;
        updateState({ currentPage: newPage });
        updateSettings();
    };

    const handleNextPage = () => {
        if (!api || state.currentPage >= state.totalPages) return;
        
        const newPage = state.currentPage + 1;
        const startBar = (newPage - 1) * 4;
        api.settings.display.startBar = startBar;
        updateState({ currentPage: newPage });
        updateSettings();
    };

    const handlePlayPause = () => {
        if (!api) return;
        if (state.isPlaying) {
            api.pause();
        } else {
            api.play();
        }
    };

    const handleStop = () => {
        if (!api) return;
        api.stop();
    };

    const handleCountIn = () => {
        if (!api) return;
        api.countInVolume = api.countInVolume === 1 ? 0 : 1;
    };

    const handleMetronome = () => {
        if (!api) return;
        const newValue = !state.showMetronome;
        api.metronomeVolume = newValue ? 1 : 0;
        updateState({ showMetronome: newValue });
    };

    const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!api) return;
        const trackIndex = parseInt(e.target.value);
        updateState({ selectedTrack: trackIndex });
        const track = api.tracks.find(t => t.index === trackIndex);
        if (track) {
            api.renderTracks([track]);
        }
    };

    const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!api) return;
        const layout = parseInt(e.target.value) as LayoutMode;
        updateState({ selectedLayout: layout });
        api.settings.display.layoutMode = layout;
        updateSettings();
    };

    const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!api) return;
        const newTempo = parseInt(e.target.value);
        updateState({ tempo: newTempo });
        api.playbackSpeed = newTempo;
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!api) return;
        const newVolume = parseInt(e.target.value);
        updateState({ volume: newVolume });
        api.masterVolume = newVolume / 100;
    };

    const handleZoomIn = () => {
        if (!api) return;
        api.settings.display.scale *= 1.2;
        updateSettings();
    };

    const handleZoomOut = () => {
        if (!api) return;
        api.settings.display.scale /= 1.2;
        updateSettings();
    };

    return (
        <div className="control-panel" style={{ 
            padding: '20px', 
            backgroundColor: 'black', 
            borderRadius: '8px',
            marginBottom: '15px',
            color: 'white'
        }}>
            {/* Track Selection */}
            <div className="control-section" style={{ marginBottom: '15px' }}>
                <label style={{ marginRight: '10px' }}>
                    Track:
                    <select 
                        value={state.selectedTrack} 
                        onChange={handleTrackChange}
                        style={{
                            marginLeft: '10px',
                            padding: '5px',
                            backgroundColor: '#333',
                            color: 'white',
                            border: '1px solid #666',
                            borderRadius: '4px'
                        }}
                    >
                        {state.tracks.map((track) => (
                            <option key={track.index} value={track.index}>
                                {track.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Display Options */}
            <div className="control-section" style={{ marginBottom: '15px' }}>
                <label style={{ marginRight: '15px' }}>
                    <input
                        type="checkbox"
                        checked={state.showNotation}
                        onChange={(e) => {
                            updateState({ showNotation: e.target.checked });
                            updateSettings();
                        }}
                        style={{ marginRight: '5px' }}
                    />
                    Show Notation
                </label>
                <label style={{ marginRight: '15px' }}>
                    <input
                        type="checkbox"
                        checked={state.showTablature}
                        onChange={(e) => {
                            updateState({ showTablature: e.target.checked });
                            updateSettings();
                        }}
                        style={{ marginRight: '5px' }}
                    />
                    Show Tablature
                </label>
                <label style={{ marginRight: '15px' }}>
                    <input
                        type="checkbox"
                        checked={state.showFingering}
                        onChange={(e) => {
                            updateState({ showFingering: e.target.checked });
                            updateSettings();
                        }}
                        style={{ marginRight: '5px' }}
                    />
                    Show Fingering
                </label>
            </div>

            {/* Layout Selection */}
            <div className="control-section" style={{ marginBottom: '15px' }}>
                <label style={{ marginRight: '10px' }}>
                    Layout:
                    <select 
                        value={state.selectedLayout} 
                        onChange={handleLayoutChange}
                        style={{
                            marginLeft: '10px',
                            padding: '5px',
                            backgroundColor: '#333',
                            color: 'white',
                            border: '1px solid #666',
                            borderRadius: '4px'
                        }}
                    >
                        <option value={LayoutMode.Page}>Page</option>
                        <option value={LayoutMode.Horizontal}>Horizontal</option>
                    </select>
                </label>
            </div>

            {/* Navigation Controls */}
            <div className="control-section" style={{ marginBottom: '15px' }}>
                <button 
                    onClick={handlePrevPage}
                    disabled={state.currentPage <= 1}
                    style={{ 
                        marginRight: '10px',
                        padding: '8px 16px',
                        backgroundColor: state.currentPage <= 1 ? '#333' : '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: state.currentPage <= 1 ? 'not-allowed' : 'pointer',
                        opacity: state.currentPage <= 1 ? 0.5 : 1
                    }}
                >
                    Previous
                </button>
                <span style={{ margin: '0 15px' }}>
                    Page {state.currentPage} of {state.totalPages}
                </span>
                <button 
                    onClick={handleNextPage}
                    disabled={state.currentPage >= state.totalPages}
                    style={{ 
                        marginRight: '10px',
                        padding: '8px 16px',
                        backgroundColor: state.currentPage >= state.totalPages ? '#333' : '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: state.currentPage >= state.totalPages ? 'not-allowed' : 'pointer',
                        opacity: state.currentPage >= state.totalPages ? 0.5 : 1
                    }}
                >
                    Next
                </button>
            </div>

            {/* Playback Controls */}
            <div className="control-section" style={{ marginBottom: '15px' }}>
                <button 
                    onClick={handlePlayPause}
                    style={{ 
                        marginRight: '10px',
                        padding: '8px 16px',
                        backgroundColor: state.isPlaying ? '#cc3300' : '#00cc66',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {state.isPlaying ? "Pause" : "Play"}
                </button>
                <button 
                    onClick={handleStop}
                    style={{ 
                        marginRight: '10px',
                        padding: '8px 16px',
                        backgroundColor: '#cc3300',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Stop
                </button>
                <button 
                    onClick={handleCountIn}
                    style={{ 
                        marginRight: '10px',
                        padding: '8px 16px',
                        backgroundColor: '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Count-In
                </button>
                <button 
                    onClick={handleMetronome}
                    style={{ 
                        marginRight: '10px',
                        padding: '8px 16px',
                        backgroundColor: state.showMetronome ? '#00cc66' : '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Metronome
                </button>
            </div>

            {/* Tempo and Volume Controls */}
            <div className="control-section" style={{ marginBottom: '15px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ 
                        marginRight: '10px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        Tempo: {state.tempo}%
                        <input
                            type="range"
                            min="25"
                            max="200"
                            value="100"
                            onChange={handleTempoChange}
                            style={{ 
                                marginLeft: '15px',
                                width: '200px',
                                accentColor: '#0066cc'
                            }}
                        />
                    </label>
                </div>
                <div>
                    <label style={{ 
                        marginRight: '10px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        Volume: {state.volume}%
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={state.volume}
                            onChange={handleVolumeChange}
                            style={{ 
                                marginLeft: '15px',
                                width: '200px',
                                accentColor: '#0066cc'
                            }}
                        />
                    </label>
                </div>
            </div>

            {/* View Controls */}
            <div className="control-section">
                <button 
                    onClick={handleZoomIn}
                    style={{ 
                        marginRight: '10px',
                        padding: '8px 16px',
                        backgroundColor: '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Zoom In
                </button>
                <button 
                    onClick={handleZoomOut}
                    style={{ 
                        padding: '8px 16px',
                        backgroundColor: '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Zoom Out
                </button>
            </div>
        </div>
    );
}