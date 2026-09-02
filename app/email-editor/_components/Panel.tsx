type Props = {
    setDrag: (name: string) => void;
}

const blocks = [
    { label: "텍스트", icon: <TextIcon /> },
    { label: "이미지", icon: <ImageIcon /> },
    { label: "버튼", icon: <ButtonIcon /> },
    { label: "구분선", icon: <DividerIcon /> },
    { label: "여백", icon: <SpacerIcon /> },
    { label: "소셜", icon: <SocialIcon /> },
    { label: "동영상", icon: <VideoIcon /> },
    { label: "컬럼", icon: <ColumnsIcon /> },
    { label: "HTML", icon: <HtmlIcon /> },
];

export default function Panel({setDrag} : Props) {

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
                    <SearchIcon className="h-4 w-4 shrink-0 text-gray-400" />
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
                            className="flex cursor-grab flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white py-4 text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 active:cursor-grabbing"
                            onPointerDown={() => setDrag(block.label)}
                        >
                            <span className="[&>svg]:h-5 [&>svg]:w-5">{block.icon}</span>
                            <span className="text-[11px] font-medium">{block.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>        
    );
}

function TextIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="14" y2="18" />
        </svg>
    );
}

function ImageIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.5" />
            <path d="M4 16l5-5 4 4 3-3 4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ButtonIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect x="4" y="9" width="16" height="6" rx="3" />
        </svg>
    );
}

function DividerIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
            <circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" />
            <line x1="8.5" y1="12" x2="15.5" y2="12" />
            <circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none" />
        </svg>
    );
}

function SpacerIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4" />
        </svg>
    );
}

function SocialIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="6" cy="12" r="2" />
            <circle cx="18" cy="6" r="2" />
            <circle cx="18" cy="18" r="2" />
            <line x1="7.8" y1="11" x2="16.2" y2="7" />
            <line x1="7.8" y1="13" x2="16.2" y2="17" />
        </svg>
    );
}

function VideoIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round">
            <rect x="3" y="6" width="14" height="12" rx="2" />
            <path d="M17 10l4-2v8l-4-2z" />
        </svg>
    );
}

function ColumnsIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect x="4" y="5" width="7" height="14" rx="1" />
            <rect x="13" y="5" width="7" height="14" rx="1" />
        </svg>
    );
}

function HtmlIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />
        </svg>
    );
}

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className={className}>
            <circle cx="10" cy="10" r="6" />
            <line x1="14.5" y1="14.5" x2="19" y2="19" />
        </svg>
    );
}
