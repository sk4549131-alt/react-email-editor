/**
 * Email Editor 화면
 * 동작:
 * 1. Drag & Drop 으로 생성되는 동작
 */
 'use client'

import Panel from "@/app/email-editor/_components/Panel";
import Preview from "@/app/email-editor/_components/Preview";
import Canvas from "@/app/email-editor/_components/Canvas";
import type {Block} from "@/app/email-editor/_components/editorType/block";
import {useState, useRef, useEffect} from "react";

type Position = {
    x: number,
    y: number,
}

type Drag = {
    type: 'move' | 'drop',
    title: string
}

const initialBlocks: Block[] = [];

export default function Editor() {
    const iframe =
        useRef<HTMLIFrameElement>(null);
    const [position, setPosition] = useState<Position | null>(null);
    const [insideIframe, setInsideIframe] = useState<boolean>(false);
    const [drag, setDrag] =useState<Drag | null>(null);
    // 실제 데이터
    const [blocks, setBlocks] = useState<Block[]>(initialBlocks);

    useEffect(() => {
        const rootIframe = iframe?.current?.getBoundingClientRect();
        if (rootIframe) {
            const {x, y} = position ?? { x: 0, y: 0 };
            const {left, right, top, bottom} = rootIframe;
            // iframe에 마우스가 도달했는지 확인 필요
            setInsideIframe(
                !!rootIframe
                && x >= left && x <= right
                && y >= top && y <= bottom
            );
        }
    }, [position]);

    return (
        <section className="flex h-screen bg-gray-100">
            <article className="w-[320px] shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
                <Panel setPosition={setPosition} position={position} setDrag={setDrag} drag={drag} />
            </article>
            <article className="flex flex-1 items-start justify-center overflow-y-auto px-10 py-12">
                <div className="w-[800px] max-w-full">
                    <Preview iframe={iframe} insideIframe={insideIframe}>
                        <Canvas 
                            iframe={iframe}
                            insideIframe={insideIframe} 
                            position={position}
                            drag={drag}
                            blocks={blocks}
                            setBlocks={setBlocks}
                        />
                    </Preview>
                </div>
            </article>
        </section>
    );
}
