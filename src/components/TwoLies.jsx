import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRecommendations } from './GameRecommendations';

export const TwoLies = ({ onBack, onSelectGame, afterDark }) => {
    const { t } = useTranslation();
    const [phase, setPhase] = useState('start'); // start | theme | vote | reveal
    const [currentTheme, setCurrentTheme] = useState(null);
    const [votes, setVotes] = useState([0, 0, 0]);
    const [lieIndex, setLieIndex] = useState(null);
    const [usedIndices, setUsedIndices] = useState([]);

    const getTheme = () => {
        let prompts = t('twolies.prompts', { returnObjects: true });
        if (afterDark) {
            const spicy = t('twolies.after_dark_prompts', { returnObjects: true });
            if (Array.isArray(spicy)) prompts = [...prompts, ...spicy];
        }
        const remaining = prompts.map((p, i) => ({ p, i })).filter(x => !usedIndices.includes(x.i));
        if (!remaining.length) { setUsedIndices([]); return prompts[Math.floor(Math.random() * prompts.length)]; }
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        setUsedIndices(prev => [...prev, pick.i]);
        return pick.p;
    };

    const startGame = () => { setUsedIndices([]); setCurrentTheme(getTheme()); setVotes([0, 0, 0]); setLieIndex(null); setPhase('theme'); };
    const startVoting = () => setPhase('vote');
    const castVote = (i) => { setVotes(v => { const n = [...v]; n[i]++; return n; }); if (navigator.vibrate) navigator.vibrate(30); };
    const selectLie = (i) => { setLieIndex(i); setPhase('reveal'); if (navigator.vibrate) navigator.vibrate([100, 50, 200]); };
    const nextRound = () => { setCurrentTheme(getTheme()); setVotes([0, 0, 0]); setLieIndex(null); setPhase('theme'); };

    const COLOR = '#10B981';
    const labels = t('twolies.option_labels', { returnObjects: true });
    const totalVotes = votes.reduce((a, b) => a + b, 0);

    return (
        <div className="container flex-center" style={{ padding: '1rem', height: '100dvh', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer' }}>← {t('common.back')}</button>
            </div>
            <AnimatePresence mode="wait">
                {phase === 'start' && (
                    <motion.div key="start" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', borderColor: `${COLOR}44` }}>
                        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🃏</div>
                        <h2 className="title-main" style={{ fontSize: '2.5rem', background: `linear-gradient(135deg, ${COLOR}, #34d399)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{t('menu.game_twolies')}</h2>
                        <div style={{ width: '100%', marginBottom: '2rem' }}>
                            {t('twolies.rules', { returnObjects: true }).map((r, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                                    <span style={{ minWidth: '1.5rem', height: '1.5rem', borderRadius: '50%', background: `linear-gradient(135deg, ${COLOR}, #34d399)`, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>{r}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={startGame} style={{ background: `linear-gradient(135deg, ${COLOR}, #34d399)`, color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900 }}>{t('common.start')}</button>
                        {onSelectGame && <GameRecommendations currentGame="twolies" onSelectGame={onSelectGame} />}
                    </motion.div>
                )}
                {phase === 'theme' && (
                    <motion.div key="theme" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', gap: '1.5rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px', color: COLOR, textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>{t('twolies.theme_label')}</p>
                        <h2 style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', fontWeight: 900, color: 'var(--text-primary)', textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif" }}>{currentTheme}</h2>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem', lineHeight: 1.5 }}>Tell <b style={{ color: COLOR }}>2 truths</b> and <b style={{ color: '#EF4444' }}>1 lie</b> about this topic — in any order.</p>
                        <button onClick={startVoting} style={{ background: `linear-gradient(135deg, ${COLOR}, #34d399)`, color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900 }}>{t('twolies.vote_label')} →</button>
                    </motion.div>
                )}
                {phase === 'vote' && (
                    <motion.div key="vote" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', gap: '1rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px', color: COLOR, textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>{t('twolies.vote_label')}</p>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.85rem', margin: 0 }}>Each person taps their guess — then player reveals!</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                            {[0, 1, 2].map(i => (
                                <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => castVote(i)} style={{ background: votes[i] > 0 ? `${COLOR}22` : 'rgba(255,255,255,0.04)', border: `2px solid ${votes[i] > 0 ? COLOR : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', width: '100%', transition: 'all 0.2s' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: `${COLOR}33`, border: `1px solid ${COLOR}`, color: COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>{labels[i]}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Statement {i + 1}</span>
                                    </div>
                                    <span style={{ color: COLOR, fontWeight: 900, fontSize: '1.1rem', fontFamily: "'Space Grotesk', sans-serif" }}>{votes[i] > 0 ? votes[i] : ''}</span>
                                </motion.button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{totalVotes} votes cast</span>
                            <button onClick={() => setPhase('reveal_pick')} style={{ background: `linear-gradient(135deg, ${COLOR}, #34d399)`, color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, padding: '0.6rem 1.5rem', width: 'auto', fontSize: '0.85rem' }}>{t('twolies.reveal_btn')} →</button>
                        </div>
                    </motion.div>
                )}
                {phase === 'reveal_pick' && (
                    <motion.div key="reveal_pick" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', gap: '1rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px', color: '#EF4444', textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>PLAYER: TAP YOUR LIE</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                            {[0, 1, 2].map(i => (
                                <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => selectLie(i)} style={{ background: 'rgba(239,68,68,0.08)', border: '2px solid rgba(239,68,68,0.4)', borderRadius: '12px', padding: '1.1rem', color: '#EF4444', fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', cursor: 'pointer', width: '100%' }}>
                                    {labels[i]} was my LIE
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
                {phase === 'reveal' && lieIndex !== null && (
                    <motion.div key="reveal" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', gap: '1rem' }}>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} style={{ fontSize: '4rem' }}>🃏</motion.div>
                        <p style={{ fontWeight: 900, color: '#EF4444', fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', textAlign: 'center' }}>THE LIE WAS {labels[lieIndex]}!</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                            {[0, 1, 2].map(i => {
                                const wasWrong = i !== lieIndex && votes[i] > 0;
                                const wasRight = i === lieIndex && votes[i] > 0;
                                return (
                                    <div key={i} style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: i === lieIndex ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.1)', border: `1px solid ${i === lieIndex ? '#EF4444' : COLOR}44`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: i === lieIndex ? '#EF4444' : COLOR, fontWeight: 700 }}>{labels[i]} {i === lieIndex ? '❌ LIE' : '✓ TRUTH'}</span>
                                        <span style={{ color: wasWrong ? '#EF4444' : wasRight ? COLOR : 'var(--text-secondary)', fontWeight: 900 }}>{votes[i]} votes {wasWrong ? '🍺' : wasRight ? '🎉' : ''}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {votes[lieIndex] < votes.reduce((a, b, i) => i !== lieIndex ? a + b : a, 0) && (
                            <p style={{ color: '#EF4444', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{t('twolies.wrong_drink')}</p>
                        )}
                        <button onClick={nextRound} style={{ background: `linear-gradient(135deg, ${COLOR}, #34d399)`, color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900 }}>{t('twolies.next_prompt')} →</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
