import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Club, Share2 } from 'lucide-react';
import { ShareReceipt } from './ShareReceipt';

export const KingsCup = ({ onBack }) => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentCardKey, setCurrentCardKey] = useState(null);
    const [kingsDrawn, setKingsDrawn] = useState(0);

    // Receipt stats tracking
    const [totalCardsDrawn, setTotalCardsDrawn] = useState(0);
    const [showReceipt, setShowReceipt] = useState(false);

    const cardKeys = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    const startGame = () => {
        setIsPlaying(true);
        setKingsDrawn(0);
        setCurrentCardKey(null);
        setTotalCardsDrawn(0);
    };

    const drawCard = () => {
        if (kingsDrawn >= 4) return;

        const randomKey = cardKeys[Math.floor(Math.random() * cardKeys.length)];
        setCurrentCardKey(randomKey);

        if (randomKey === "K") {
            const newDrawn = kingsDrawn + 1;
            setKingsDrawn(newDrawn);
            if (newDrawn === 4) {
                if (navigator.vibrate) navigator.vibrate([1000, 500, 1000]); // HUGE BOOM
            } else {
                if (navigator.vibrate) navigator.vibrate([300, 100, 300]); // King drawn thud
            }
        } else {
            if (navigator.vibrate) navigator.vibrate(50); // Standard draw snap
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    const isGameOver = kingsDrawn >= 4;
    const currentCardData = currentCardKey ? t(`kingscup.cards.${currentCardKey}`, { returnObjects: true }) : null;

    // V5 Cyber Aesthetic: Violent Red Shift for Kings Cup
    const tension = kingsDrawn === 3 ? 0.8 : kingsDrawn === 2 ? 0.4 : kingsDrawn === 1 ? 0.1 : 0;
    const bgGradient = tension > 0
        ? `radial-gradient(circle at center, rgba(255, 0, 127, ${tension * 0.6}) 0%, transparent 100%)`
        : 'none';

    return (
        <div className="container flex-center" style={{ padding: '1rem', height: '100dvh', background: bgGradient, transition: 'background 0.5s ease' }}>
            <AnimatePresence mode="wait">
                {!isPlaying ? (
                    <motion.div
                        key="start"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="flex-center glass-card"
                        style={{ flex: 1, justifyContent: 'center', borderColor: 'var(--neon-pink)', boxShadow: '0 0 30px rgba(255,0,127,0.2)' }}
                    >
                        <Club size={80} color="var(--neon-pink)" style={{ filter: 'drop-shadow(0 0 20px rgba(255,0,127,0.8))', marginBottom: '1rem' }} />
                        <h2 className="title-main" style={{ fontSize: '3rem', color: 'var(--neon-pink)', textShadow: '0 0 20px rgba(255,0,127,0.5)' }}>
                            {t('menu.game_kings_cup')}
                        </h2>
                        <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
                            {t('kingscup.rules')}
                        </p>
                        <button onClick={startGame} style={{ background: 'var(--neon-pink)', color: 'black', border: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
                            {t('common.start')}
                        </button>
                        <button onClick={onBack} style={{ background: 'transparent' }}>
                            {t('common.back')}
                        </button>
                    </motion.div>
                ) : isGameOver ? (
                    <motion.div
                        key="gameover"
                        initial={{ scale: 0, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="flex-center"
                        style={{ flex: 1, width: '100%', background: 'rgba(255, 0, 127, 0.2)', borderRadius: '16px', border: '4px solid var(--neon-pink)', padding: '2rem' }}
                    >
                        <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--neon-pink)', textShadow: '0 0 40px var(--neon-pink)', textAlign: 'center', lineHeight: 1, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                            {t('kingscup.game_over')}
                        </h1>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '3rem', textAlign: 'center', padding: '0 1rem', fontFamily: "'Space Grotesk', sans-serif", marginTop: '1rem' }}>
                            {t('kingscup.game_over_msg')}
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

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: 'auto', marginTop: '1rem' }}>
                            {[1, 2, 3, 4].map(idx => (
                                <div key={idx} style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px', /* Brutalist sharp corners */
                                    background: kingsDrawn >= idx ? 'var(--neon-pink)' : 'var(--bg-charcoal)',
                                    boxShadow: kingsDrawn >= idx ? '0 0 15px var(--neon-pink)' : 'none',
                                    border: kingsDrawn >= idx ? 'none' : '1px solid rgba(255,255,255,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 900, color: kingsDrawn >= idx ? '#000' : 'rgba(255,255,255,0.3)',
                                    fontFamily: "'Space Grotesk', sans-serif"
                                }}>K</div>
                            ))}
                        </div>

                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <AnimatePresence mode="wait">
                                {currentCardKey ? (
                                    <motion.div
                                        key={currentCardKey + Math.random()} // Force re-animation even on same card draw
                                        initial={{ scale: 0.5, rotateY: 90, opacity: 0 }}
                                        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                                        exit={{ scale: 0.5, y: -100, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 150 }}
                                        className="flex-center"
                                        style={{
                                            width: '280px',
                                            height: '400px',
                                            background: '#0a0a0a', /* Black Card */
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            boxShadow: '0 0 30px rgba(255,0,127,0.1), inset 0 0 20px rgba(0,0,0,1)',
                                            borderRadius: '16px',
                                            padding: '1rem',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        {/* Card Corner Index */}
                                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--neon-pink)', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
                                            {currentCardKey}
                                        </div>
                                        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', color: 'var(--neon-pink)', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, transform: 'rotate(180deg)', fontFamily: "'Space Grotesk', sans-serif" }}>
                                            {currentCardKey}
                                        </div>

                                        {/* Center Content */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 1rem' }}>
                                            <h2 style={{ color: 'white', fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1, textTransform: 'uppercase' }}>
                                                {currentCardData.title}
                                            </h2>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 400 }}>
                                                {currentCardData.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div style={{ width: '280px', height: '400px', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <p style={{ color: 'var(--text-secondary)', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase', letterSpacing: '2px' }}>NO CARD DRAWN</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={drawCard}
                            style={{ background: 'var(--neon-pink)', color: 'black', marginTop: 'auto', marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            <Club size={24} />
                            {t('kingscup.draw_card')}
                        </button>
                        <button onClick={onBack} style={{ background: 'transparent', color: 'var(--text-secondary)', marginTop: 0 }}>
                            {t('common.back')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
