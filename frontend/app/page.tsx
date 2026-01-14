'use client';
import { useState, useEffect } from 'react';

// DeleteChordでidを使用するため、型定義にidを追加しました
type Chord = {
    id: number;
    chord: string;
    fingering: string;
    position: number;
};

export default function Home() {
    const [chord, setChord] = useState('');
    const [fingering, setFingering] = useState('');
    const [position, setPosition] = useState(0);
    const [chords, setChords] = useState<Chord[]>([]);

    useEffect(() => {
        GetChords();
    }, []);

    const GetChords = async () => {
        try {
            const res = await fetch('http://localhost:8000/chords/');
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            setChords(data);
        } catch (error) {
            console.error(error);
        }
    };

    const PostChord = async () => {
        // 簡単なバリデーション
        if (!chord || !fingering) return;

        try {
            const res = await fetch('http://localhost:8000/chords/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chord, fingering, position }),
            });
            if (!res.ok) {
                const message = await res.text();
                throw new Error(message || 'Network response was not ok');
            }
            const data = await res.json();
            console.log('Created:', data);

            // フォームのリセット
            setChord('');
            setFingering('');
            setPosition(0);

            GetChords();
        } catch (error) {
            console.error('Error posting chord:', error);
        }
    }

    const DeleteChord = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:8000/chords/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                throw new Error('Failed to delete chord');
            }
            GetChords();
        } catch (error) {
            console.error('Error deleting chord:', error);
        }
    };

    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                    ギターコード登録ツール
                </h1>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <input
                            type="text"
                            placeholder="Chord Name (e.g. C)"
                            className="border p-2 rounded w-full"
                            value={chord}
                            onChange={(e) => setChord(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Fingering (e.g. x32010)"
                            className="border p-2 rounded w-full"
                            value={fingering}
                            onChange={(e) => setFingering(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Position"
                            className="border p-2 rounded w-full"
                            value={position}
                            onChange={(e) => setPosition(Number(e.target.value))}
                        />
                        <button
                            onClick={PostChord}
                            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            Add Chord
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <h2 className="text-xl font-semibold p-4 border-b bg-gray-100">
                        Registered Chords
                    </h2>
                    <ul>
                        {chords.length === 0 ? (
                            <li className="p-4 text-gray-500 text-center">No chords registered yet.</li>
                        ) : (
                            chords.map((item) => (
                                <li
                                    key={item.id}
                                    className="border-b last:border-b-0 p-4 flex justify-between items-center hover:bg-gray-50"
                                >
                                    <div>
                                        <span className="text-lg font-bold mr-4 w-16 inline-block">
                                            {item.chord}
                                        </span>
                                        <span className="text-gray-600 mr-4 font-mono">
                                            {item.fingering}
                                        </span>
                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700">
                                            Pos: {item.position}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => DeleteChord(item.id)}
                                        className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </main>
    );
}