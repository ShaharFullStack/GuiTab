import React, { useState, useEffect } from 'react';
import { Guitar, Music, Play, Database } from 'lucide-react';
import { TabModel } from '../../../Models/TabModel';
import { tabsService } from '../../../Services/TabsService';
import { socketService } from '../../../Services/SocketService';
import { notify } from '../../../Utils/Notify';
import { TabViewer } from '../../DataArea/TabViewer/TabViewer';

interface TabWithTimestamp extends TabModel {
    timestamp?: number;
}

export function Home(): JSX.Element {
    const [recentTabs, setRecentTabs] = useState<TabModel[]>([]);
    const [selectedTab, setSelectedTab] = useState<TabModel | null>(null);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        // Connect to socket service
        socketService.connect((msg: string) => {
            setMessage(msg);
        });

        // Fetch recent tabs
        fetchRecentTabs();

        // Cleanup socket connection
        return () => socketService.disconnect();
    }, []);

    const fetchRecentTabs = async () => {
        try {
            const tabsFromBackend = await tabsService.getRecentTabs();
            const savedTabs = loadRecentlyViewedTabs();

            // Add timestamps to tabs
            const backendTabsWithTime: TabWithTimestamp[] = tabsFromBackend.map(tab => ({
                ...tab,
                timestamp: Date.now()
            }));

            const localTabsWithTime: TabWithTimestamp[] = savedTabs.map(tab => ({
                ...tab,
                timestamp: Date.now() - 1000
            }));

            // Merge and sort tabs
            const allTabs = [...backendTabsWithTime, ...localTabsWithTime];
            const uniqueTabs = allTabs.reduce((acc, current) => {
                const exists = acc.find(tab => tab.songName === current.songName);
                if (!exists || (exists.timestamp && current.timestamp && exists.timestamp < current.timestamp)) {
                    return [...acc.filter(tab => tab.songName !== current.songName), current];
                }
                return acc;
            }, [] as TabWithTimestamp[]);

            // Sort by timestamp and take the 5 most recent
            const sortedTabs = uniqueTabs
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
                .slice(0, 5);

            setRecentTabs(sortedTabs);
        } catch (err: any) {
            notify.error(err);
        }
    };

    const loadRecentlyViewedTabs = (): TabWithTimestamp[] => {
        const storedTabs = localStorage.getItem('recentTabs');
        return storedTabs ? JSON.parse(storedTabs) : [];
    };

    const saveRecentlyViewedTabs = (tab: TabModel) => {
        const storedTabs = loadRecentlyViewedTabs();
        const tabWithTime: TabWithTimestamp = {
            ...tab,
            timestamp: Date.now()
        };

        const updatedTabs = [tabWithTime, ...storedTabs]
            .filter((t, index, self) => 
                index === self.findIndex(st => st.songName === t.songName)
            )
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .slice(0, 5);

        localStorage.setItem('recentTabs', JSON.stringify(updatedTabs));
    };

    const handleTabSelection = (tab: TabModel) => {
        setSelectedTab(tab);
        saveRecentlyViewedTabs(tab);
        fetchRecentTabs(); // Refresh the list after selection
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-1000 via-transparent to-yellow-600 text-white overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-550/20 rounded-full blur-3xl animate-pulse"></div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                {/* Header */}
                <header className="text-center mb-16">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <Guitar className="w-16 h-16 text-orange-400 animate-pulse-slow" />
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-600">
                            GuiTab Pro
                        </h1>
                    </div>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Guitar Pro tabs scraper.
                    </p>
                </header>

                {/* Feature Cards */}
                <div className="grid xl:grid-cols-3 gap-5 mb-20">
                    {[
                        {
                            icon: Database,
                            title: 'Recent Tabs',
                            description: 'Browse through recently added guitar tabs',
                            color: 'text-blue-400'
                        },
                        {
                            icon: Music,
                            title: 'Trending',
                            description: 'Most popular tabs this week',
                            color: 'text-green-400'
                        },
                        {
                            icon: Play,
                            title: 'Quick Play',
                            description: 'Instantly view and play tabs',
                            color: 'text-purple-400'
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gray-800/50 p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300 group"
                        >
                            <feature.icon
                                className={`mx-auto mb-4 w-16 h-16 ${feature.color} group-hover:animate-bounce`}
                            />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Tabs Section */}
                {recentTabs.length > 0 && (
                    <div className="bg-gray-800/50 rounded-xl p-6 mb-16">
                        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-yellow-500">
                            Recently Added Tabs
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {recentTabs.map((tab, index) => (
                                <div
                                    key={tab.songName}
                                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-500 cursor-pointer"
                                    onClick={() => handleTabSelection(tab)}
                                >
                                    <h3 className="text-lg font-semibold">{tab.songName}</h3>
                                    <span className="text-sm text-red-400 mt-2 block">File Version: {tab.fileType}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab Viewer */}
                {selectedTab && (
                    <div className="bg-gray-800/50 rounded-xl p-6">
                        <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-600">
                            Now Viewing: {selectedTab.songName}
                        </h3>
                        <TabViewer fileUrl={selectedTab.downloadUrl} />
                    </div>
                )}

                {/* Empty State */}
                {recentTabs.length === 0 && (
                    <div className="text-center text-gray-400 py-16">
                        <p>{message || "No recent tabs available"}</p>
                    </div>
                )}
            </div>
        </div>
    );
}