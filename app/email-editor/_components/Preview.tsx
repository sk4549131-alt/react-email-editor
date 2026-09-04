/**
 * Email Preview 화면
 * 동작:
 * 1. iframe에 Email 볼 수 있는 화면
 */
import {IframeHTMLAttributes} from "react";

export default function Preview(
    {
        children,
        iframe
    } :
    {
        children: React.ReactNode,
        iframe: React.RefObject<HTMLIFrameElement | null>
    }
) {

    const defaultHtml = `
        <style>html, body { height: 100%; margin: 0; }</style>
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            font-family: sans-serif;
            font-size: 14px;
            color: #9ca3af;
            background: #f9fafb;
        ">
            Drag Here
        </div>
    `;

    return (
        <iframe
            ref={iframe}
            srcDoc={defaultHtml}
            className="h-[160px] w-full rounded-lg border-0 bg-white shadow-sm ring-1 ring-gray-200"
        />
    );
}
