import React from "react";
import { Guitar, Music, Search, PlayCircle, Settings } from "lucide-react";

export default function About(): JSX.Element {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <Guitar className="w-16 h-16 text-blue-400" />
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            Guitar Tab Viewer
                        </h1>
                    </div>
                    <p className="text-xl text-gray-300">
                        An advanced guitar tablature viewer and player for musicians
                    </p>
                </div>

                {/* Main Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <FeatureCard 
                        icon={<Search className="w-8 h-8 text-blue-400" />}
                        title="Easy Search"
                        description="Search for your favorite songs across multiple sources and find the perfect tab for your practice."
                    />
                    <FeatureCard 
                        icon={<PlayCircle className="w-8 h-8 text-blue-400" />}
                        title="Interactive Playback"
                        description="Play along with the tab, adjust tempo, use metronome, and follow the cursor as it moves."
                    />
                    <FeatureCard 
                        icon={<Music className="w-8 h-8 text-blue-400" />}
                        title="Multiple Formats"
                        description="Supports various Guitar Pro formats (GP3, GP4, GP5, GPX) with high-quality rendering."
                    />
                    <FeatureCard 
                        icon={<Settings className="w-8 h-8 text-blue-400" />}
                        title="Customizable View"
                        description="Switch between notation and tab views, adjust zoom, change layout, and customize display options."
                    />
                </div>

                {/* Detailed Features List */}
                <div className="bg-gray-800/50 rounded-xl p-8 mb-16">
                    <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Key Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FeatureList title="Playback Features" items={[
                            "Adjustable playback speed",
                            "Built-in metronome",
                            "Count-in option",
                            "Multiple instrument tracks",
                            "Volume control",
                            "Cursor following"
                        ]} />
                        <FeatureList title="Display Options" items={[
                            "Standard notation view",
                            "Tablature view",
                            "Combined view",
                            "Fingering display",
                            "Chord diagrams",
                            "Multiple layout options"
                        ]} />
                    </div>
                </div>

                {/* Usage Instructions */}
                <div className="bg-gray-800/50 rounded-xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        How to Use
                    </h2>
                    <ol className="space-y-4 text-gray-300">
                        <li className="flex items-start">
                            <span className="font-bold text-blue-400 mr-2">1.</span>
                            <span>Enter a song name or artist in the search bar and click search</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-blue-400 mr-2">2.</span>
                            <span>Select your desired tab from the search results</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-blue-400 mr-2">3.</span>
                            <span>Use the playback controls to start playing, adjust tempo, or enable the metronome</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-blue-400 mr-2">4.</span>
                            <span>Customize the view using display options to suit your preferences</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-xl font-bold ml-4">{title}</h3>
            </div>
            <p className="text-gray-300">{description}</p>
        </div>
    );
}

function FeatureList({ title, items }: { title: string, items: string[] }) {
    return (
        <div>
            <h3 className="font-bold mb-4 text-lg">{title}</h3>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}