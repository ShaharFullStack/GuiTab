
// Frontend\src\Components\DataArea\TabsList\TabsList.tsx
import { Guitar, Search } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from "react";
import { TabModel } from "../../../Models/TabModel";
import { socketService } from "../../../Services/SocketService";
import { tabsService } from "../../../Services/TabsService";
import { notify } from "../../../Utils/Notify";
import { TabViewer } from "../TabViewer/TabViewer";
import "./TabsList.css";

export function TabsList(): JSX.Element {
    const [query, setQuery] = useState<string>("");
    const [tabs, setTabs] = useState<TabModel[]>([]);
    const [message, setMessage] = useState<string>("");
    const [selectedTab, setSelectedTab] = useState<TabModel | null>(null);

    useEffect(() => {
        socketService.connect((msg: string) => {
            setMessage(msg);
        });

        return () => socketService.disconnect();
    }, []);

    async function search() {
        try {
            setTabs([]);
            setSelectedTab(null);
            const results = await tabsService.searchTabs(query);
            setTabs(results);
            if (results.length === 0) notify.success("No tabs found");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-transparent to-transparent text-white overflow-hidden relative">
            {/* Background Blobs */}
            <div className="fixed -top-50 -right-50 w-96 h-96 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="fixed -bottom-20 -left-20 w-96 h-96 bg-green-700/50 rounded-full blur-3xl animate-pulse"></div>
            <div className="fixed -top-20 -right-20 w-96 h-96 bg-purple-700/50 rounded-full blur-3xl animate-pulse"></div>
            <div className="fixed -top-20 -left-30 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                {/* Header */}
                <header className="text-center mb-16">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <Guitar className="w-16 h-16 text-orange-600 animate-pulse-slow" />
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-yellow-400">
                            Search For Tabs
                        </h1>
                    </div>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Find Your Perfect Guitar Tab
                    </p>
                </header>

                {/* Search Section */}
                <div className="max-w-3xl mx-auto mb-16">
                    <div className="relative">
                        <input
                            type="search"
                            onChange={handleChange}
                            value={query}
                            placeholder="Enter song name, artist, or genre..."
                            className="w-full p-4 pl-12 pr-24 text-lg bg-gray-800 border-2 border-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 w-6 h-6" />
                        <button
                            onClick={search}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-700 to-yellow-400 hover:from-red-600 hover:to-orange-700 text-black px-6 py-2 rounded-full transition-all duration-300"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Search Results */}
                {tabs.length === 0 && (
                    <div className="text-center font-bold text-3xl text-black bg-orange-600/70 rounded-full p-3 w-2/3 mx-auto">
                        <p>{message || "Enter a query and start searching"}</p>
                    </div>
                )}

                {tabs.length > 0 && (
                    <div className="bg-gray-800/50 rounded-xl p-6 mb-16">
                        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            Search Results
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="p-3">Song</th>
                                        <th className="p-3">Band</th>
                                        <th className="p-3">File Type</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tabs.map((tab, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                                        >
                                            <td className="p-3">{tab.songName}</td>
                                            <td className="p-3">{tab.bandName || "N/A"}</td>
                                            <td className="p-3">{tab.fileType}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => setSelectedTab(tab)}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab Viewer */}
                {selectedTab && (
                    <div className="bg-gray-800/50 rounded-xl p-6">
                        <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            Now Viewing: {selectedTab.songName}
                        </h3>
                        <TabViewer fileUrl={selectedTab.downloadUrl} />
                    </div>
                )}
            </div>
        </div>
    );
}