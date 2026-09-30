import { createPortal } from "react-dom";
import { useEffect, useState } from 'react';

/**
 * Email Preview 화면
 * 동작:
 * 1. iframe에 Email 볼 수 있는 화면
 */

const IFRAME_HEIGHT = 900;

type Props = {
    children: React.ReactNode,
    iframe: React.RefObject<HTMLIFrameElement | null>,
    insideIframe: Boolean,
}

export default function Preview({
        children,
        iframe,
        insideIframe } : Props) {
    const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

    function handleLoad() {
        setMountNode(iframe.current?.contentDocument?.body ?? null);
    }

    useEffect(() => {
        // srcDoc이 이미 로드된 상태로 재마운트되는 경우를 대비한 폴백
        handleLoad();
    }, [iframe]);

    return (
        <>
        <iframe
            ref={iframe}
            srcDoc="<style>html, body { margin: 0; overflow-y: auto; }</style>"
            onLoad={handleLoad}
            style={{ height: IFRAME_HEIGHT }}
            className="w-full rounded-lg border-0 bg-white shadow-sm ring-1 ring-gray-200"
        />
        { mountNode && createPortal(children, mountNode) }
        </>
    );
}
