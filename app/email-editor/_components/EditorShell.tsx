'use client'

import { useState, useEffect } from "react";
import Panel from "./Panel";
import Preview from "./Preview";
import { log } from "console";

export default function EditorShell() {
    const [drag, setDrag] = useState<string | null>(null);
    const [pointer, setPointer] = useState<{x: number, y: number} | null >(null);

    useEffect(() => {
        if (drag) false;

        function mousePointerDown(e: PointerEvent) {
            console.log("--------");
            setPointer({
                x: e.clientX,
                y: e.clientY
            })
        }

        function handlePointerUp() {
            setDrag(null);
            setPointer(null);
        }

        document.addEventListener('pointermove', mousePointerDown);
        document.addEventListener('pointerup', handlePointerUp);

        return () => {
            document.removeEventListener('pointermove', mousePointerDown);
            document.removeEventListener('pointerup', handlePointerUp);
        }

    }, [drag])

    return (
        <>
        <section className="flex h-screen bg-gray-100">
            <aside className="w-[320px] shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
                <Panel setDrag={setDrag} />
            </aside>

            <main className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-center border-b border-gray-200 bg-white py-2">
                    <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                        <button className="rounded-md bg-white p-1.5 text-gray-900 shadow-sm">
                            <DesktopIcon className="h-4 w-4" />
                        </button>
                        <button className="rounded-md p-1.5 text-gray-400 hover:text-gray-600">
                            <MobileIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 justify-center overflow-y-auto px-10 py-12">
                    <div className="h-fit w-[600px] max-w-full overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
                        <Preview />
                    </div>
                </div>
            </main>
        </section>
        {
            pointer && drag && (
                <div
                    style={{
                        position: 'absolute',
                        left: pointer.x,
                        top: pointer.y
                    }}
                >
                    {drag}
                </div>
            )
        }
        </>
    )
}

function DesktopIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="3" y="4" width="18" height="12" rx="1.5" />
            <line x1="9" y1="20" x2="15" y2="20" />
            <line x1="12" y1="16" x2="12" y2="20" />
        </svg>
    );
}

function MobileIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="7" y="3" width="10" height="18" rx="2" />
            <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
    );
}