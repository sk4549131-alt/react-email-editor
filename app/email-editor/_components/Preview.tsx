/**
 * Email Preview 화면
 * 동작:
 * 1. iframe에 Email 볼 수 있는 화면
 */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const defaultHtml = `<style>html, body { height: 100%; margin: 0; }</style>`;

    
export default function Preview({
        children,
        iframe
    } : {
        children: React.ReactNode,
        iframe: React.RefObject<HTMLIFrameElement | null>
    }) {
    // Iframe contentDocument 읽기 위한 Hook
    const [iBody, setIbody] = useState<HTMLElement | null >(null);

    useEffect(() => {
        const doc = iframe.current?.contentDocument;

        if (doc?.readyState === 'complete') {
            setIbody(doc.body);
        }
        
    }, [iframe])

    return (
        <>
        <iframe
            ref={iframe}
            srcDoc={defaultHtml}
            className="h-full w-full rounded-lg border-0 bg-white shadow-sm ring-1 ring-gray-200"
        />
        { iBody && createPortal(children, iBody)  }
        </>
    );
}
