import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

export const Bomb31 = ({ onBack }) => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentNum, setCurrentNum] = useState(0);
    const [exploded, setExploded] = useState(false);

    const startGame = () => {
        setCurrentNum(0);
        setIsPlaying(true);
        setExploded(false);
    };

    const handleTap = (amount) => {
        const nextNum = currentNum + amount;
        if (nextNum >= 31) {
            setCurrentNum(31);
            setExploded(true);
            if (navigator.vibrate) navigator.vibrate([400, 100, 400, 100, 800]); // BA-BUM BA-BUM BOOM
        } else {
            setCurrentNum(nextNum);
            // Tension Haptics
            if (navigator.vibrate) {
                if (nextNum > 26) {
                    navigator.vibrate(150); // Hard heartbeat
                } else if (nextNum > 20) {
                    navigator.vibrate(80); // Medium thud
                } else {
                    navigator.vibrate(30); // Light tap
                }
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    // V5 Cyber Aesthetic: Violent Red Shift
    const tension = currentNum > 20 ? Math.min((currentNum - 20) / 10, 1) : 0;
    const bgGradient = tension > 0
        ? `radial-gradient(circle at center, rgba(255, 0, 127, ${tension * 0.6}) 0%, transparent 100%)`
        : 'none';

    return (
        <div className={`container flex-center`} style={{ padding: '1rem', height: '100dvh', background: bgGradient, transition: 'background 0.3s ease' }}>
            <AnimatePresence mode="wait">
                {!isPlaying ? (
                    <motion.div
                        key="start"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="flex-center glass-card"
                        style={{ flex: 1, justifyContent: 'center', borderColor: 'var(--accent-primary)', boxShadow: '0 0 30px rgba(255,0,127,0.2)' }}
                    >
                        <Flame size={80} color="var(--accent-primary)" style={{ filter: 'drop-shadow(0 0 20px rgba(255,0,127,0.8))', marginBottom: '1rem' }} />
                        <h2 className="title-main" style={{ fontSize: '3rem', color: 'var(--accent-primary)', textShadow: '0 0 20px rgba(255,0,127,0.5)' }}>{t('menu.game_31bomb')}</h2>
                        <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
                            {t('bomb31.rules')}
                        </p>
                        <button onClick={startGame} style={{ background: 'var(--accent-primary)', color: 'black', border: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
                            {t('common.start')}
                        </button>
                        <button onClick={onBack} style={{ background: 'transparent' }}>
                            {t('common.back')}
                        </button>
                    </motion.div>
                ) : exploded ? (
                    <motion.div
                        key="boom"
                        initial={{ scale: 0, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="flex-center"
                        style={{ flex: 1, width: '100%', background: 'rgba(255,0,127,0.2)', borderRadius: '16px', border: '4px solid var(--accent-primary)', padding: '2rem' }}
                    >
                        <h1 style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--accent-primary)', textShadow: '0 0 40px var(--accent-primary)', margin: 0, lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
                            {t('bomb31.boom')}
                        </h1>
                        <h2 style={{ fontSize: '2rem', marginBottom: '3rem', textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif" }}>
                            {t('bomb31.fail_message')}
                        </h2>
                        <button onClick={startGame} style={{ background: 'white', color: 'black', fontFamily: "'Space Grotesk', sans-serif" }}>
                            PLAY AGAIN
                        </button>
                        <button onClick={onBack} style={{ background: 'transparent' }}>
                            {t('common.back')}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="play"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="flex-center"
                        style={{ flex: 1, width: '100%' }}
                    >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                                {t('bomb31.current_number')}
                            </p>
                            <motion.h1
                                key={currentNum}
                                initial={{ scale: 1.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{
                                    fontSize: '12rem',
                                    fontWeight: 900,
                                    margin: 0,
                                    lineHeight: 1,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    color: currentNum > 25 ? 'var(--accent-primary)' : 'white',
                                    textShadow: currentNum > 25 ? '0 0 50px rgba(255,0,127,0.8)' : '0 0 20px rgba(255,255,255,0.2)'
                                }}
                            >
                                {currentNum}
                            </motion.h1>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', width: '100%', marginBottom: '1rem' }}>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={() => handleTap(1)} style={{ fontSize: '2.5rem', padding: '1.5rem', background: 'var(--bg-charcoal)', borderColor: 'rgba(255,0,127,0.3)' }}>
                                {t('bomb31.tap_1')}
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={() => handleTap(2)} style={{ fontSize: '2.5rem', padding: '1.5rem', background: 'var(--bg-charcoal)', borderColor: 'rgba(255,0,127,0.3)' }}>
                                {t('bomb31.tap_2')}
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={() => handleTap(3)} style={{ fontSize: '2.5rem', padding: '1.5rem', background: 'var(--bg-charcoal)', borderColor: 'rgba(255,0,127,0.3)' }}>
                                {t('bomb31.tap_3')}
                            </motion.button>
                        </div>

                        <button onClick={onBack} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                            {t('common.back')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
