import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRecommendations } from './GameRecommendations';

export const RedFlag = ({ onBack, onSelectGame, afterDark }) => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [usedIndices, setUsedIndices] = useState([]);

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.92 },
        show: { opacity: 1, scale: 1 }
    };

    const getRandomPrompt = () => {
        let prompts = t('redflag.prompts', { returnObjects: true });
        if (afterDark) {
            const spicy = t('redflag.after_dark_prompts', { returnObjects: true });
            if (Array.isArray(spicy)) prompts = [...prompts, ...spicy];
        }
        const remaining = prompts
            .map((p, i) => ({ ...p, idx: i }))
            .filter(p => !usedIndices.includes(p.idx));
        if (remaining.length === 0) {
            setUsedIndices([]);
            return prompts[Math.floor(Math.random() * prompts.length)];
        }
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        setUsedIndices(prev => [...prev, pick.idx]);
        return pick;
    };

    const startGame = () => {
        setUsedIndices([]);
        setCurrentPrompt(getRandomPrompt());
        setRevealed(false);
        setIsPlaying(true);
    };

    const nextPrompt = () => {
        setCurrentPrompt(getRandomPrompt());
        setRevealed(false);
        if (navigator.vibrate) navigator.vibrate(40);
    };

    const reveal = () => {
        setRevealed(true);
        if (navigator.vibrate) navigator.vibrate([100, 50, 200]);
    };

    const guiltyColor = currentPrompt?.guilty === 'boys' ? '#4fc3f7' : '#f06292';
    const guiltyLabel = currentPrompt?.guilty === 'boys' ? t('redflag.boys') : t('redflag.girls');
    const guiltyEmoji = currentPrompt?.guilty === 'boys' ? '👦' : '👧';

    return (
        <div className="container flex-center" style={{ padding: '1rem', height: '100dvh', flexDirection: 'column', justifyContent: 'flex-start', background: revealed ? `radial-gradient(circle at center, ${guiltyColor}18 0%, transparent 70%)` : 'transparent', transition: 'background 0.4s ease' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer' }}>
                    ← {t('common.back')}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {!isPlaying ? (
                    <motion.div
                        key="start"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="flex-center glass-card"
                        style={{ flex: 1, justifyContent: 'center', borderColor: 'rgba(255, 23, 68, 0.4)', boxShadow: '0 0 30px rgba(255, 23, 68, 0.15)' }}
                    >
                        <div style={{ fontSize: '5rem', marginBottom: '0.5rem' }}>🚩</div>
                        <h2 className="title-main" style={{ fontSize: '3rem', background: 'linear-gradient(135deg, #4fc3f7, #f06292)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            {t('menu.game_redflag')}
                        </h2>
                        <div style={{ width: '100%', marginBottom: '2rem' }}>
                            {t('redflag.rules', { returnObjects: true }).map((step, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.6rem' }}>
                                    <span style={{ minWidth: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #4fc3f7, #f06292)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>{step}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={startGame} style={{ background: 'linear-gradient(135deg, #4fc3f7, #f06292)', color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900 }}>
                            {t('common.start')}
                        </button>
                        {onSelectGame && <GameRecommendations currentGame="redflag" onSelectGame={onSelectGame} />}
                    </motion.div>
                ) : (
                    <motion.div
                        key="play"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="flex-center glass-card"
                        style={{ flex: 1, justifyContent: 'center', width: '100%', gap: '1.5rem' }}
                    >
                        {/* Question */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPrompt?.q}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                                style={{ textAlign: 'center', width: '100%' }}
                            >
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif" }}>
                                    WHO IS MORE GUILTY?
                                </p>
                                <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.3, fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>
                                    {currentPrompt?.q}
                                </h2>
                            </motion.div>
                        </AnimatePresence>

                        {/* Boys vs Girls indicator */}
                        <div style={{ display: 'flex', width: '100%', gap: '0.75rem', alignItems: 'center' }}>
                            <div style={{
                                flex: 1, padding: '1rem', borderRadius: '12px', textAlign: 'center',
                                background: revealed && currentPrompt?.guilty === 'boys' ? 'rgba(79,195,247,0.2)' : 'rgba(255,255,255,0.04)',
                                border: `2px solid ${revealed && currentPrompt?.guilty === 'boys' ? '#4fc3f7' : 'rgba(79,195,247,0.3)'}`,
                                transition: 'all 0.3s ease',
                                transform: revealed && currentPrompt?.guilty === 'boys' ? 'scale(1.05)' : 'scale(1)'
                            }}>
                                <div style={{ fontSize: '2rem' }}>👦</div>
                                <div style={{ fontWeight: 900, color: '#4fc3f7', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '1px', marginTop: '0.25rem' }}>{t('redflag.boys')}</div>
                                {revealed && currentPrompt?.guilty === 'boys' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{ marginTop: '0.5rem', fontSize: '1.2rem' }}
                                    >🚩</motion.div>
                                )}
                            </div>
                            <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: 900, flexShrink: 0 }}>VS</div>
                            <div style={{
                                flex: 1, padding: '1rem', borderRadius: '12px', textAlign: 'center',
                                background: revealed && currentPrompt?.guilty === 'girls' ? 'rgba(240,98,146,0.2)' : 'rgba(255,255,255,0.04)',
                                border: `2px solid ${revealed && currentPrompt?.guilty === 'girls' ? '#f06292' : 'rgba(240,98,146,0.3)'}`,
                                transition: 'all 0.3s ease',
                                transform: revealed && currentPrompt?.guilty === 'girls' ? 'scale(1.05)' : 'scale(1)'
                            }}>
                                <div style={{ fontSize: '2rem' }}>👧</div>
                                <div style={{ fontWeight: 900, color: '#f06292', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '1px', marginTop: '0.25rem' }}>{t('redflag.girls')}</div>
                                {revealed && currentPrompt?.guilty === 'girls' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{ marginTop: '0.5rem', fontSize: '1.2rem' }}
                                    >🚩</motion.div>
                                )}
                            </div>
                        </div>

                        {/* Reveal / verdict */}
                        {revealed ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ textAlign: 'center', width: '100%' }}
                            >
                                <p style={{ fontSize: '1rem', fontWeight: 700, color: guiltyColor, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '2px', marginBottom: '0.25rem' }}>
                                    {guiltyEmoji} {guiltyLabel} — {t('redflag.drinks')}
                                </p>
                                <button onClick={nextPrompt} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif", width: 'auto', padding: '0.6rem 2rem' }}>
                                    {t('redflag.next_prompt')} →
                                </button>
                            </motion.div>
                        ) : (
                            <button
                                onClick={reveal}
                                style={{ background: 'linear-gradient(135deg, #4fc3f7, #f06292)', color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '1rem' }}
                            >
                                {t('redflag.reveal_btn')}
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
