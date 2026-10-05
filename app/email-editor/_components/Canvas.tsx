import {useEffect, memo, useState, Fragment} from "react";
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
import { log } from "console";

type Drag = { 
    phase: 'move' | 'drop', 
    type: string 
};

type Props = {
    insideIframe: boolean,
    contents: Block[],
    setContents: React.Dispatch<React.SetStateAction<Block[]>>;
    position: Position | null,
    drag: Drag | null;
    setDrag: (d: Drag | null) => void;
    iframe: React.RefObject<HTMLIFrameElement | null>,
}

type Position = {
    x: number,
    y: number,
}

// iframe 안은 Tailwind가 적용되지 않으므로 inline style로 꾸민다
const defaultHtml = (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        minHeight: 220,
        margin: 24,
        border: '1.5px dashed #cbd5e1',
        borderRadius: 16,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
    }}>
        <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: '#fff',
            boxShadow: '0 1px 3px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b"
                 strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
            </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                블록을 여기로 끌어다 놓으세요
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: '#94a3b8' }}>
                왼쪽 패널에서 원하는 블록을 선택하세요
            </div>
        </div>
    </div>
);

// Panel에서 타일을 드래그해서 놓았을 때, 그 타일 타입에 맞는 기본값으로 새 블록을 만든다.
export function createBlockFromType(type: string): Block {
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
    return (
        <div data-block-id={block.id} style={{ padding: '12px 24px' }}>
            {renderBlock(block)}
        </div>
    );
});

// 놓을 자리를 알려주는 영역. iframe 안이라 inline style로 꾸민다
function DropIndicator() {
    return (
        <div style={{
            height: 72,
            margin: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            border: '1.5px dashed #60a5fa',
            borderRadius: 12,
            background: 'linear-gradient(180deg, rgba(59,130,246,0.10) 0%, rgba(59,130,246,0.04) 100%)',
            boxShadow: '0 0 0 4px rgba(59,130,246,0.08)',
            color: '#2563eb',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: 13,
            fontWeight: 600,
        }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
            </svg>
            여기에 놓기
        </div>
    );
}

export default function Canvas({
    insideIframe,
    position,
    drag, 
    setDrag,
    contents,
    setContents,
    iframe
}: Props) {
    // 내가 드랍할 위치의 순서 찾기
    const [dropIndex, setDropIndex] = useState<number | null>(null);
    
    const isDragging = drag?.phase === 'move'; 

    useEffect(() => {
        if (!insideIframe || !iframe.current || !position) return;

        const rect = iframe.current.getBoundingClientRect();
        // iframe 좌표 구하기 (왼쪽 상단 끝네 두면 x:0, y:0 이면 맞게 한거)
        //const x = position.x - rect.left;
        const y = position.y - rect.top;

        const doc = iframe.current.contentDocument;
        if (!doc) return;
        // iframe에 있는 html을 읽어옴
        const blockList = doc.querySelectorAll<HTMLElement>('[data-block-id]');
        // Ifrme에 있는 컨텐츠의 id값과 위치를 찾아냄
        const rects = Array.from(blockList).map((el)=> {
            const r = el.getBoundingClientRect();
            return { blockId: el.dataset.blockId, top: r.top, bottom: r.bottom }
        })
        // 찾아낸 정보를 사용해서 마우스가 어디에 있고 element의 위에 드랍할지 아래에 넣을지 찾는 동작 추가
        const index = rects.findIndex((r) => {
            // 사용자의 iframe 좌표 
            console.log(`y: ${y}`);
            // conent의 높이를 알아내서 중간을 찾음
            const contentHeight = r.top + r.bottom;
            //console.log(`top: ${r.top + r.bottom} `);
            console.log(y < contentHeight / 2);
             
            return y < contentHeight / 2;
        });

        setDropIndex(index === -1 ? rects.length : index);
        
    }, [insideIframe, position, iframe]);
    // Drop 했을때 이벤트 등록
    useEffect(() => {
        if (drag?.phase !== 'drop') return;

        if (insideIframe && dropIndex !== null) {
            setContents((prev) => [
                ...prev.slice(0, dropIndex),
                createBlockFromType(drag.type),
                ...prev.slice(dropIndex),
            ]);
        }
        setDrag(null);
        setDropIndex(null);
    }, [drag])

    return (
        <>
        { /** 기본 Html 설정 */ }
        { contents.length === 0 && (
            defaultHtml
        )}
        {  
            contents.map((block, i) => (
                <Fragment key={block.id}>
                    {insideIframe && isDragging && dropIndex === i && <DropIndicator />} 
                    <BlockItem key={block.id} block={block} />
                </Fragment>
            ))
        }
        {insideIframe && isDragging && dropIndex === contents.length && <DropIndicator />} 
        </>
    )
}