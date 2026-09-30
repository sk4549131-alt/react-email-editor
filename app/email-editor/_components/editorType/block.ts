export type Block =
    | { id: string, type: "텍스트", content: { text: string } }
    | { id: string, type: "이미지", content: { src: string, alt: string } }
    | { id: string, type: "버튼", content: { label: string, href: string } }
    | { id: string, type: "구분선", content: {} }
    | { id: string, type: "여백", content: { height: number } }
    | { id: string, type: "소셜", content: { links: { platform: string, href: string }[] } }
    | { id: string, type: "동영상", content: { src: string } }
    | { id: string, type: "컬럼", content: { columns: number } }
    | { id: string, type: "HTML", content: { html: string } };
