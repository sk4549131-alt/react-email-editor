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
import type {Block} from "@/app/email-editor/_components/editorType/block";

type Position = {
    x: number,
    y: number,
}
type Drag = { 
    phase: 'move' | 'drop', 
    type: string 
};

export default function Editor() {
    const iframe = useRef<HTMLIFrameElement>(null);
    const [position, setPosition] = useState<Position | null>(null);
    const [insideIframe, setInsideIframe] = useState<boolean>(false);
    // canvas에 그려줄 패널 순서
    const [contents, setContents] = useState<Block[]>([
        { id: 'default-text', type: '텍스트', content: { text: '테스트 텍스트' } },
        //{ id: 'default-text-2', type: '텍스트', content: { text: '테스트 텍스트' } },
    ]);
    // 드래그 이벤트 상태를 저장
    const [drag, setDrag] = useState<Drag | null>(null);


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
                <Panel setPosition={setPosition} position={position} drag={drag} setDrag={setDrag} />
            </article>
            <article className="flex flex-1 items-center justify-center overflow-y-auto px-10 py-12">
                <div className="w-[600px] h-[600px] max-w-full">
                    <Preview iframe={iframe} >
                        <Canvas 
                            iframe={iframe}
                            position={position}
                            insideIframe={insideIframe}
                            drag={drag} 
                            setDrag={setDrag}
                            contents={contents}
                            setContents={setContents}
                        />
                    </Preview>
                </div>
            </article>
        </section>
    );
}
