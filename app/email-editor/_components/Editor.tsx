/**
 * Email Editor 화면
 * 동작:
 * 1. Drag & Drop 으로 생성되는 동작
 */
 'use client'

import Panel from "@/app/email-editor/_components/Panel";
import Preview from "@/app/email-editor/_components/Preview";
import Canvas from "@/app/email-editor/_components/Canvas";
import {useState, useRef, useEffect} from "react";

type Position = {
    x: number,
    y: number,
}

export default function Editor() {
    const iframe =
        useRef<HTMLIFrameElement>(null);
    const [position, setPosition] = useState<Position | null>(null);
    const [insideIframe, setInsideIframe] = useState<boolean>(false);

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
                <Panel setPosition={setPosition} position={position} />
            </article>
            <article className="flex flex-1 items-center justify-center overflow-y-auto px-10 py-12">
                <div className="w-[600px] h-[600px] max-w-full">
                    <Preview iframe={iframe}>
                        <Canvas insideIframe={insideIframe} />
                    </Preview>
                </div>
            </article>
        </section>
    );
}
