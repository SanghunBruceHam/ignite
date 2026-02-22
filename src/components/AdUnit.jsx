import { useEffect } from 'react';

export const AdUnit = ({ slotId, style = {} }) => {
    useEffect(() => {
        try {
            if (window.adsbygoogle && typeof window !== 'undefined') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("AdSense placement error:", e);
        }
    }, [slotId]);

    return (
        <div style={{ width: '100%', margin: '1rem 0', minHeight: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: slotId ? 'none' : '1px dashed rgba(255,255,255,0.1)', ...style }}>
            <ins className="adsbygoogle"
                style={{ display: 'block', width: '100%', textAlign: 'center' }}
                data-ad-client="ca-pub-5508768187151867"
                data-ad-slot={slotId || "8583724069"}
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
            {!slotId && <span style={{ position: 'absolute', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Ad Space (Requires Ad Unit ID)</span>}
        </div>
    );
};
