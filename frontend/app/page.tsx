'use client';
import { useState, useEffect } from 'react';
import ChordDiagram from '../components/chorddiagram';

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

            // リセット
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
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-4">Chord Manager</h1>
            
            {/* Input Form */}
            <div className="flex gap-4 mb-8 p-4 bg-gray-100 rounded">
                <input
                    className="border p-2 rounded"
                    placeholder="Chord Name (e.g. C)"
                    value={chord}
                    onChange={(e) => setChord(e.target.value)}
                />
                <input
                    className="border p-2 rounded"
                    placeholder="Fingering (e.g. x32010)"
                    value={fingering}
                    onChange={(e) => setFingering(e.target.value)}
                />
                <input
                    type="number"
                    className="border p-2 rounded w-24"
                    placeholder="Position"
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                />
                <button 
                    onClick={PostChord}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add
                </button>
            </div>
            {/* List */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {chords.map((c) => (
                    <div key={c.id} className="border p-4 rounded shadow-sm hover:shadow-md flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-2">{c.chord}</h2>
                        {/* ここでSVGコンポーネントを使用 */}
                        <ChordDiagram
                            fingering={c.fingering}
                            position={c.position}
                        />
                        <div className="text-sm text-gray-500 mt-2">
                            {c.fingering} / pos: {c.position}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}