import {useEffect, useState, useRef, memo} from "react";
import type {Block} from "@/app/email-editor/_components/editorType/block";
import TextBlock from "@/app/email-editor/_components/blocks/TextBlock";
import ImageBlock from "@/app/email-editor/_components/blocks/ImageBlock";
import ButtonBlock from "@/app/email-editor/_components/blocks/ButtonBlock";
import DividerBlock from "@/app/email-editor/_components/blocks/DividerBlock";
import SpacerBlock from "@/app/email-editor/_components/blocks/SpacerBlock";
import SocialBlock from "@/app/email-editor/_components/blocks/SocialBlock";
import VideoBlock from "@/app/email-editor/_components/blocks/VideoBlock";
import ColumnBlock from "@/app/email-editor/_components/blocks/ColumnBlock";
import HtmlBlock from "@/app/email-editor/_components/blocks/HtmlBlock";

type Position = {
    x: number,
    y: number,
}

type Drag = {
    type: string,
    title: string
}

type Props = {
    insideIframe: boolean,
    position: Position | null,
    iframe: React.RefObject<HTMLIFrameElement | null>,
    drag: Drag | null,
    blocks: Block[],
    setBlocks: (blocks: Block[]) => void 
}

type DropTarget = { blockId: string, position: 'before' | 'after' } | null;
type BlockRect = { blockId: string, top: number, bottom: number };

// 블록 중간 지점 근처에서 before/after가 계속 뒤집히지 않도록 두는 여유 구간(px)
const HYSTERESIS = 0;

// Panel에서 타일을 드래그해서 놓았을 때, 그 타일 타입에 맞는 기본값으로 새 블록을 만든다.
function createBlockFromType(type: string): Block {
    const id = crypto.randomUUID();
    switch (type) {
        case "텍스트":
            return { id, type, content: { text: "안녕하세요" } };
        case "이미지":
            return { id, type, content: { src: "https://placehold.co/600x200", alt: "이미지" } };
        case "버튼":
            return { id, type, content: { label: "구매하기", href: "#" } };
        case "구분선":
            return { id, type, content: {} };
        case "여백":
            return { id, type, content: { height: 24 } };
        case "소셜":
            return { id, type, content: { links: [{ platform: "instagram", href: "#" }] } };
        case "동영상":
            return { id, type, content: { src: "https://example.com/video.mp4" } };
        case "컬럼":
            return { id, type, content: { columns: 2 } };
        case "HTML":
            return { id, type, content: { html: "<div>커스텀 HTML</div>" } };
        default:
            throw new Error(`알 수 없는 블록 타입: ${type}`);
    }
}

function renderBlock(block: Block) {
    switch (block.type) {
        case "텍스트":
            return <TextBlock {...block.content} />;
        case "이미지":
            return <ImageBlock {...block.content} />;
        case "버튼":
            return <ButtonBlock {...block.content} />;
        case "구분선":
            return <DividerBlock />;
        case "여백":
            return <SpacerBlock {...block.content} />;
        case "소셜":
            return <SocialBlock {...block.content} />;
        case "동영상":
            return <VideoBlock {...block.content} />;
        case "컬럼":
            return <ColumnBlock {...block.content} />;
        case "HTML":
            return <HtmlBlock {...block.content} />;
    }
}

const BlockItem = memo(function BlockItem({ block }: { block: Block }) {
    return <div data-block-id={block.id}>{renderBlock(block)}</div>;
});

// Panel의 드래그 타일(py-4 + 아이콘 20px + 라벨) 크기와 맞춘 고정 높이
const TILE_PLACEHOLDER_HEIGHT = 72;

function DropIndicator() {
    return (
        <div style={{
            height: TILE_PLACEHOLDER_HEIGHT,
            background: 'rgba(59,130,246,0.08)',
            border: '1.5px dashed #3b82f6',
            borderRadius: 8,
        }} />
    );
}

export default function Canvas({iframe, insideIframe, position, drag, blocks, setBlocks}: Props) {
    const [dropTarget, setDropTarget] = useState<DropTarget>(null);
    // 드래그 시작 시점(placeholder가 아직 없어 레이아웃이 밀리지 않은 상태)의 블록 위치 스냅샷.
    // 이후 판정은 계속 실시간으로 DOM을 재측정하지 않고 이 캐시만 사용한다 —
    // 그래야 우리가 그린 placeholder 때문에 블록이 밀리면서 기준 좌표 자체가 흔들리는 되먹임을 피할 수 있다.
    const blockRectsRef = useRef<BlockRect[]>([]);

    useEffect(() => {
        // 드랍했을때
        if (drag?.type === 'drop' && iframe?.current) {
            const newBlock = createBlockFromType(drag.title);

            if (blocks.length === 0 || !dropTarget) {
                setBlocks([...blocks, newBlock]);
            } else {
                const index = blocks.findIndex(b => b.id === dropTarget.blockId);
                const insertAt = dropTarget.position === 'before' ? index : index + 1;
                setBlocks([
                    ...blocks.slice(0, insertAt),
                    newBlock,
                    ...blocks.slice(insertAt),
                ]);
            }

            setDropTarget(null); // 드롭 끝났으니 인디케이터 잔상 치우기
        }
        // 'move'(드래그 시작 순간)에만 스냅샷을 찍는다. 'drop'(드래그 종료) 때도 drag가
        // 새 객체로 바뀌어서 이 effect가 다시 도는데, 그때는 이미 쓸모없는 재측정이라 건너뛴다.
        if (drag?.type !== 'move' || !iframe?.current) return;

        const doc = iframe.current.contentDocument;
        if (!doc) return;

        const blockEls = doc.querySelectorAll<HTMLElement>('[data-block-id]');
        blockRectsRef.current = Array.from(blockEls).map((el) => {
            const r = el.getBoundingClientRect();
            return { blockId: el.dataset.blockId!, top: r.top, bottom: r.bottom };
        });
    }, [drag, iframe]);

    useEffect(() => {
        if (!insideIframe || !iframe?.current || !position) {
            setDropTarget(null);
            return;
        }

        const rects = blockRectsRef.current;
        if (rects.length === 0) {
            setDropTarget(null);
            return;
        }

        // position은 최상위 문서 좌표계이므로 iframe 내부 좌표계로 변환
        const rect = iframe.current.getBoundingClientRect();
        const localY = position.y - rect.top;

        setDropTarget(prev => {
            for (const r of rects) {
                const midpoint = (r.top + r.bottom) / 2;
                // 경계선 근처에서 미세한 마우스 움직임에 before/after가 계속 뒤집히는 걸 막기 위한 여유 구간
                const wasBefore = prev?.blockId === r.blockId && prev.position === 'before';
                const wasAfter = prev?.blockId === r.blockId && prev.position === 'after';
                const threshold = wasBefore ? midpoint + HYSTERESIS :
                 wasAfter ? midpoint - HYSTERESIS : midpoint;

                if (localY < threshold) {
                    const next: DropTarget = { blockId: r.blockId, position: 'before' };
                    return prev?.blockId === next.blockId && prev?.position === next.position ? prev : next;
                }
            }

            const last = rects[rects.length - 1];
            const next: DropTarget = { blockId: last.blockId, position: 'after' };
            return prev?.blockId === next.blockId && prev?.position === next.position ? prev : next;
        });
    }, [insideIframe, position]);

    return (
        <>
            { blocks.length === 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 160,
                    fontFamily: 'sans-serif',
                    fontSize: '14px',
                    color: insideIframe && drag ? '#3b82f6' : '#9ca3af',
                    background: insideIframe && drag ? '#eff6ff' : '#f9fafb',
                    boxShadow: insideIframe && drag ? '0 0 0 2px #3b82f6' : '0 0 0 2px transparent',
                    transition: 'background-color 150ms ease, box-shadow 150ms ease, color 150ms ease',
                }}>
                    Drag Here
                </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                {blocks.map((block) => (
                    <div key={block.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {dropTarget?.blockId === block.id && dropTarget.position === 'before' && <DropIndicator />}
                        <BlockItem block={block} />
                        {dropTarget?.blockId === block.id && dropTarget.position === 'after' && <DropIndicator />}
                    </div>
                ))}
            </div>
        </>
    )
}