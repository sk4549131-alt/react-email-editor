/**
 * Email Panel 화면
 * 동작:
 * 1. Drag & Drop할 타일들을 관리
 */
'use client'

import {
    AlignLeft,
    Image,
    RectangleHorizontal,
    SeparatorHorizontal,
    ArrowUpDown,
    Share2,
    Video,
    Columns2,
    Code2,
    Search,
} from "lucide-react";
import {useState} from "react";

type Position = {
    x: number,
    y: number,
}

type Props = {
    setPosition: ({x,y}: Position) => void;
    position: Position | null
}

type Drag = {
    flag: boolean,
    type: string
}

const blocks = [
    { label: "텍스트", icon: <AlignLeft strokeWidth={1.5} /> },
    { label: "이미지", icon: <Image strokeWidth={1.5} /> },
    { label: "버튼", icon: <RectangleHorizontal strokeWidth={1.5} /> },
    { label: "구분선", icon: <SeparatorHorizontal strokeWidth={1.5} /> },
    { label: "여백", icon: <ArrowUpDown strokeWidth={1.5} /> },
    { label: "소셜", icon: <Share2 strokeWidth={1.5} /> },
    { label: "동영상", icon: <Video strokeWidth={1.5} /> },
    { label: "컬럼", icon: <Columns2 strokeWidth={1.5} /> },
    { label: "HTML", icon: <Code2 strokeWidth={1.5} /> },
];

export default function Panel({setPosition, position}: Props) {
    const [drag, setDrag] =useState<Drag | null>(null);

    function pointerDown(
        e: React.PointerEvent<HTMLDivElement>,
        label: string
    ) {
        setDrag({flag: true, type: label});
        e.currentTarget.setPointerCapture(e.pointerId)

        console.log('pointerDown');
    }

    function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (drag?.flag) {
            setPosition({
                x: e.clientX,
                y: e.clientY,
            })
            console.log('pointerMove');
        }
    }

    function pointerUp(e: React.PointerEvent<HTMLDivElement>) {
        setDrag(null);
        e.currentTarget.releasePointerCapture(e.pointerId);
        console.log('pointerUp');
    }

    return (
        <>
            <div className="flex h-full flex-col bg-white">
                <div className="flex gap-1 border-b border-gray-200 p-3">
                    <button className="flex-1 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white">
                        블록
                    </button>
                    <button className="flex-1 rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100">
                        스타일
                    </button>
                </div>

                <div className="border-b border-gray-200 p-3">
                    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                        <Search className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={1.5} />
                        <span className="text-xs text-gray-400">블록 검색</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                    <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        콘텐츠
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {blocks.map((block) => (
                            <div
                                key={block.label}
                                className="flex cursor-grab flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white py-4 text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
                                onPointerMove={pointerMove}
                                onPointerDown={
                                    (e) =>
                                        pointerDown(e, block.label)
                                }
                                onPointerUp={pointerUp}
                            >
                                <span className="[&>svg]:h-5 [&>svg]:w-5">{block.icon}</span>
                                <span className="text-[11px] font-medium">{block.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {
                drag && position && (
                    <div style={{
                        position: 'absolute',
                        left: position.x,
                        top: position.y,
                    }}>
                        sadas
                    </div>
                )
            }
        </>
    );
}
