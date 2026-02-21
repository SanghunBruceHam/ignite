import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand } from 'lucide-react';
import { GameRecommendations } from './GameRecommendations';

export const NunchiTap = ({ onBack, onSelectGame }) => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [tapCount, setTapCount] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [success, setSuccess] = useState(false);
    const lastTapTime = useRef(0);

    const startGame = () => {
        setTapCount(0);
        setGameOver(false);
        setSuccess(false);
        setIsPlaying(true);
        lastTapTime.current = 0;
    };

    const handleTap = (e) => {
        // Prevent default to avoid double-firing of touch and click
        e.preventDefault();
        if (!isPlaying || gameOver || success) return;

        const now = Date.now();
        const timeSinceLastTap = now - lastTapTime.current;

        // If tapped within 400ms of the last tap, it's a CLASH (failure)
        if (lastTapTime.current !== 0 && timeSinceLastTap < 400) {
            setGameOver(true);
            if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 500]);
        } else {
            // Safe tap
            setTapCount(c => c + 1);
            lastTapTime.current = now;
            if (navigator.vibrate) navigator.vibrate(50);

            // Randomly decide round success after 5+ valid taps just for pacing
            if (tapCount > 5 && Math.random() > 0.8) {
                setSuccess(true);
                if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        show: { opacity: 1, y: 0 }
    };

    const backBtn = (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer' }}>
                ← {t('common.back')}
            </button>
        </div>
    );

    return (
        <div className="container flex-center" style={{ padding: '1rem', height: '100dvh', flexDirection: 'column', justifyContent: 'flex-start' }}>
            {backBtn}
            <AnimatePresence mode="wait">
                {!isPlaying ? (
                    <motion.div
                        key="start"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="flex-center glass-card"
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        <Hand size={64} className="text-gradient-primary" style={{ marginBottom: '1rem' }} />
                        <h2 className="title-main" style={{ fontSize: '2.5rem', color: 'var(--accent-secondary)' }}>{t('menu.game_nunchitap')}</h2>
                        <div style={{ width: '100%', marginBottom: '2rem' }}>
                            {t('nunchitap.rules', { returnObjects: true }).map((step, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.6rem' }}>
                                    <span style={{ minWidth: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'var(--accent-secondary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>{step}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={startGame} style={{ background: 'var(--accent-secondary)', color: '#000', border: 'none' }}>
                            {t('common.start')}
                        </button>
                        {onSelectGame && <GameRecommendations currentGame="nunchitap" onSelectGame={onSelectGame} />}
                    </motion.div>
                ) : gameOver ? (
                    <motion.div
                        key="fail"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="flex-center"
                        style={{ flex: 1, width: '100%', background: 'rgba(255,51,102,0.2)', borderRadius: '32px', border: '2px solid var(--accent-primary)' }}
                    >
                        <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--accent-primary)', textShadow: '0 0 20px var(--accent-primary)', textAlign: 'center' }}>
                            {t('nunchitap.game_over')}
                        </h1>
                        <h2 style={{ fontSize: '2rem', marginBottom: '3rem', textAlign: 'center' }}>
                            {t('nunchitap.fail_message')}
                        </h2>
                        <button onClick={startGame} style={{ background: 'white', color: 'var(--accent-primary)' }}>
                            {t('common.start')}
                        </button>
                    </motion.div>
                ) : success ? (
                    <motion.div
                        key="success"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex-center"
                        style={{ flex: 1, width: '100%', background: 'rgba(0, 229, 255, 0.2)', borderRadius: '32px', border: '2px solid var(--accent-secondary)' }}
                    >
                        <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--accent-secondary)', textShadow: '0 0 20px var(--accent-secondary)', textAlign: 'center' }}>
                            {t('nunchitap.success')}
                        </h1>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '3rem', textAlign: 'center' }}>
                            {t('nunchitap.success_message')}
                        </h2>
                        <button onClick={startGame} style={{ background: 'var(--accent-secondary)', color: 'black' }}>
                            {t('common.start')}
                        </button>
                    </motion.div>
                ) : (
                    <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {/* Full-screen tap zone */}
                        <motion.div
                            key="play"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="flex-center"
                            style={{ flex: 1, width: '100%', cursor: 'pointer' }}
                            onPointerDown={handleTap}
                        >
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '4px dashed var(--glass-border)', borderRadius: '32px', width: '100%', background: 'var(--glass-bg)' }}>
                                <Hand size={64} color="var(--glass-border)" style={{ marginBottom: '2rem' }} />
                                <h2 style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '4px', textAlign: 'center' }}>
                                    {t('nunchitap.tap_to_start')}
                                </h2>
                                <motion.h1
                                    key={tapCount}
                                    initial={{ scale: 1.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--accent-secondary)', marginTop: '1rem' }}
                                >
                                    {tapCount > 0 ? tapCount : ""}
                                </motion.h1>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
