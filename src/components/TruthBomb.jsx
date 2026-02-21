import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRecommendations } from './GameRecommendations';

export const TruthBomb = ({ onBack, onSelectGame, afterDark }) => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [drinkCount, setDrinkCount] = useState(0);
    const [usedIndices, setUsedIndices] = useState([]);
    const [answered, setAnswered] = useState(null);

    const getPrompt = () => {
        let prompts = t('truthbomb.prompts', { returnObjects: true });
        if (afterDark) {
            const spicy = t('truthbomb.after_dark_prompts', { returnObjects: true });
            if (Array.isArray(spicy)) prompts = [...prompts, ...spicy];
        }
        const remaining = prompts.map((p, i) => ({ p, i })).filter(x => !usedIndices.includes(x.i));
        if (!remaining.length) { setUsedIndices([]); return prompts[Math.floor(Math.random() * prompts.length)]; }
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        setUsedIndices(prev => [...prev, pick.i]);
        return pick.p;
    };

    const startGame = () => { setUsedIndices([]); setDrinkCount(0); setCurrentPrompt(getPrompt()); setAnswered(null); setIsPlaying(true); };
    const next = (drank) => { if (drank) setDrinkCount(c => c + 1); setAnswered(drank ? 'drink' : 'answer'); setTimeout(() => { setCurrentPrompt(getPrompt()); setAnswered(null); }, 400); if (navigator.vibrate) navigator.vibrate(drank ? [100, 50, 200] : 30); };

    const COLOR = '#FF6B35';

    return (
        <div className="container flex-center" style={{ padding: '1rem', height: '100dvh', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer' }}>← {t('common.back')}</button>
            </div>
            <AnimatePresence mode="wait">
                {!isPlaying ? (
                    <motion.div key="start" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', borderColor: `${COLOR}44` }}>
                        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>💣</div>
                        <h2 className="title-main" style={{ fontSize: '2.8rem', background: `linear-gradient(135deg, ${COLOR}, #ff9a3c)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{t('menu.game_truthbomb')}</h2>
                        <div style={{ width: '100%', marginBottom: '2rem' }}>
                            {t('truthbomb.rules', { returnObjects: true }).map((r, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                                    <span style={{ minWidth: '1.5rem', height: '1.5rem', borderRadius: '50%', background: `linear-gradient(135deg, ${COLOR}, #ff9a3c)`, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>{r}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={startGame} style={{ background: `linear-gradient(135deg, ${COLOR}, #ff9a3c)`, color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900 }}>{t('common.start')}</button>
                        {onSelectGame && <GameRecommendations currentGame="truthbomb" onSelectGame={onSelectGame} />}
                    </motion.div>
                ) : (
                    <motion.div key="play" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', gap: '1.5rem' }}>
                        {drinkCount > 0 && <div style={{ fontSize: '0.75rem', fontWeight: 700, color: COLOR, letterSpacing: '2px', fontFamily: "'Space Grotesk', sans-serif" }}>🍺 {drinkCount} {t('truthbomb.shame_label')}</div>}
                        <AnimatePresence mode="wait">
                            <motion.div key={currentPrompt} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center', width: '100%' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif" }}>TRUTH OR DRINK</p>
                                <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.3, fontFamily: "'Space Grotesk', sans-serif" }}>{currentPrompt}</h2>
                            </motion.div>
                        </AnimatePresence>
                        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                            <motion.button whileTap={{ scale: 0.93 }} onClick={() => next(false)} style={{ flex: 1, background: answered === 'answer' ? 'rgba(0,255,136,0.2)' : 'rgba(0,255,136,0.08)', border: '2px solid #00ff88', color: '#00ff88', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '0.9rem', padding: '1rem' }}>{t('truthbomb.answer_btn')}</motion.button>
                            <motion.button whileTap={{ scale: 0.93 }} onClick={() => next(true)} style={{ flex: 1, background: answered === 'drink' ? `${COLOR}33` : `${COLOR}11`, border: `2px solid ${COLOR}`, color: COLOR, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '0.9rem', padding: '1rem' }}>{t('truthbomb.drink_btn')}</motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
