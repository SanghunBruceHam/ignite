import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Share2, Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ShareReceipt = ({ gameName, stats, onClose }) => {
    const { t } = useTranslation();
    const receiptRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleShare = async () => {
        if (!receiptRef.current) return;
        setIsGenerating(true);

        try {
            const canvas = await html2canvas(receiptRef.current, {
                backgroundColor: '#0a0a0a',
                scale: 3, // High quality for IG stories
                logging: false,
                useCORS: true
            });

            canvas.toBlob(async (blob) => {
                if (!blob) return;

                // Attempt Native Share API if supported (mobile)
                if (navigator.share && navigator.canShare) {
                    const file = new File([blob], 'vibecheck-receipt.png', { type: 'image/png' });
                    if (navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({
                                files: [file],
                                title: 'VibeCheck Results',
                                text: 'We just played VibeCheck! 🍻'
                            });
                        } catch (err) {
                            console.log('Share cancelled or failed', err);
                            fallbackDownload(blob);
                        }
                    } else {
                        fallbackDownload(blob);
                    }
                } else {
                    fallbackDownload(blob);
                }
                setIsGenerating(false);
            }, 'image/png');

        } catch (error) {
            console.error('Failed to generate receipt', error);
            setIsGenerating(false);
        }
    };

    const fallbackDownload = (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `vibecheck-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Format today's date
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const timeString = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}
        >
            {/* The Receipt Container (This gets screenshot) */}
            <motion.div
                ref={receiptRef}
                initial={{ y: 50, scale: 0.9 }}
                animate={{ y: 0, scale: 1 }}
                style={{
                    background: '#1a1a1a', // Dark receipt paper
                    width: '100%',
                    maxWidth: '320px',
                    padding: '2rem 1.5rem',
                    borderRadius: '4px',
                    position: 'relative',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    border: '1px solid #333'
                }}
            >
                {/* Jagged Zig-Zag Top & Bottom using CSS */}
                <div style={{ position: 'absolute', top: '-10px', left: 0, right: 0, height: '10px', background: 'linear-gradient(45deg, transparent 33.333%, #1a1a1a 33.333%, #1a1a1a 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #1a1a1a 33.333%, #1a1a1a 66.667%, transparent 66.667%)', backgroundSize: '10px 20px', backgroundPosition: '0 -10px' }} />
                <div style={{ position: 'absolute', bottom: '-10px', left: 0, right: 0, height: '10px', background: 'linear-gradient(45deg, #1a1a1a 33.333%, transparent 33.333%, transparent 66.667%, #1a1a1a 66.667%), linear-gradient(-45deg, #1a1a1a 33.333%, transparent 33.333%, transparent 66.667%, #1a1a1a 66.667%)', backgroundSize: '10px 20px' }} />

                <div style={{ textAlign: 'center', borderBottom: '2px dashed #444', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontFamily: 'monospace', fontSize: '2rem', margin: 0, fontWeight: 900, letterSpacing: '2px', color: '#fff' }}>VIBECHECK</h1>
                    <p style={{ fontFamily: 'monospace', color: '#888', margin: '0.5rem 0 0 0', fontSize: '0.8rem' }}>PARTY NIGHT RECEIPT</p>
                    <p style={{ fontFamily: 'monospace', color: '#666', margin: '0.25rem 0 0 0', fontSize: '0.7rem' }}>{dateString} {timeString}</p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontFamily: 'monospace', color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>
                        GAME: <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{gameName}</span>
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stats.map((stat, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                <span style={{ color: '#aaa' }}>{stat.label}</span>
                                <span style={{ color: '#fff', fontWeight: 'bold' }}>{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center', borderTop: '2px dashed #444', paddingTop: '1.5rem' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#888', margin: 0 }}>
                        Thank you for playing.
                    </p>
                    <div style={{ marginTop: '1rem', background: '#fff', height: '40px', width: '100%', position: 'relative' }}>
                        {/* Fake Barcode */}
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${i * 3.3}%`, width: `${Math.random() * 3}px`, background: '#000' }} />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                <button
                    onClick={onClose}
                    disabled={isGenerating}
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '1rem', borderRadius: '50%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <X size={24} />
                </button>
                <button
                    onClick={handleShare}
                    disabled={isGenerating}
                    style={{ background: 'var(--accent-primary)', color: 'black', padding: '1rem 2rem', borderRadius: '32px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
                >
                    {isGenerating ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Share2 size={24} /></motion.div> : <><Share2 size={24} /> {t('common.share') || 'SHARE TO IG'}</>}
                </button>
            </div>
        </motion.div>
    );
};
