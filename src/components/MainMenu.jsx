import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Flame, Hand, Users, Target, Club, Share2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const MainMenu = ({ onSelectGame }) => {
    const { t, i18n } = useTranslation();
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const menuRef = useRef(null);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'ko', label: '한국어' },
        { code: 'ja', label: '日本語' },
        { code: 'zh-CN', label: '简体中文' },
        { code: 'zh-TW', label: '繁體中文' }
    ];

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        setShowLanguageMenu(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowLanguageMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleShareApp = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Blitz - Party App',
                    url: window.location.origin,
                    text: 'Playing Blitz, the ultimate digital party game. Join in!'
                });
            } catch (err) {
                console.log('Share error or cancelled', err);
            }
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.origin);
            alert('Link copied!');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <div className="container flex-center" style={{ position: 'relative' }}>

            {/* Top Bar for Settings */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', zIndex: 10 }}
            >
                {/* Share App Button */}
                <button
                    onClick={handleShareApp}
                    style={{
                        padding: '0.75rem',
                        width: 'auto',
                        borderRadius: '50%',
                        aspectRatio: '1',
                        margin: 0,
                        background: 'var(--glass-bg)',
                        color: 'var(--neon-blue)',
                        borderColor: 'var(--neon-blue)',
                        boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
                    }}
                >
                    <Share2 size={24} />
                </button>

                {/* Language Menu Toggle */}
                <div ref={menuRef} style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                        style={{
                            padding: '0.75rem',
                            width: 'auto',
                            borderRadius: '50%',
                            aspectRatio: '1',
                            margin: 0,
                            background: showLanguageMenu ? 'var(--glass-highlight)' : 'var(--glass-bg)'
                        }}
                    >
                        <Globe size={24} color="var(--text-primary)" />
                    </button>

                    <AnimatePresence>
                        {showLanguageMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                style={{
                                    position: 'absolute',
                                    top: '110%',
                                    right: 0,
                                    background: 'var(--bg-gradient-1)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '16px',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            margin: 0,
                                            fontSize: '1rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: i18n.language === lang.code ? 'var(--accent-primary)' : 'transparent',
                                            whiteSpace: 'nowrap',
                                            justifyContent: 'flex-start'
                                        }}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* After Dark Toggle */}
                <div style={{
                    margin: 0,
                    background: 'var(--glass-bg)',
                    borderRadius: '32px',
                    padding: '0.5rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: i18n.options.afterDark ? '#ff1744' : 'var(--glass-border)',
                    boxShadow: i18n.options.afterDark ? '0 0 15px rgba(255, 23, 68, 0.3)' : 'none'
                }}
                    onClick={() => {
                        i18n.options.afterDark = !i18n.options.afterDark;
                        // Force re-render just by toggling a piece of local state
                        setShowLanguageMenu(prev => prev);
                    }}>
                    <div style={{
                        width: '40px',
                        height: '24px',
                        background: i18n.options.afterDark ? '#ff1744' : '#333',
                        borderRadius: '12px',
                        position: 'relative',
                        transition: 'background 0.3s ease'
                    }}>
                        <motion.div
                            animate={{ x: i18n.options.afterDark ? 16 : 0 }}
                            style={{
                                width: '20px',
                                height: '20px',
                                background: 'white',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '2px',
                                left: '2px'
                            }}
                        />
                    </div>
                    <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: i18n.options.afterDark ? '#ff1744' : 'var(--text-secondary)',
                        fontFamily: "'Space Grotesk', sans-serif"
                    }}>
                        AFTER DARK 18+
                    </span>
                </div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex-center"
                style={{ width: '100%', flex: 1 }}
            >
                <motion.h1 variants={itemVariants} className="title-main">
                    {t('menu.title')}
                </motion.h1>

                <motion.p variants={itemVariants} className="subtitle-main">
                    {t('menu.subtitle')}
                </motion.p>

                <motion.div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onSelectGame('bomb31')}
                        style={{ borderLeft: '6px solid var(--accent-primary)', fontSize: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                            <Flame size={32} color="var(--accent-primary)" style={{ filter: 'drop-shadow(0 0 10px var(--accent-primary))' }} />
                            <span style={{ flex: 1, textAlign: 'left', fontWeight: 900, textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>{t('menu.game_31bomb')}</span>
                            <span style={{ fontSize: '0.8rem', background: 'var(--accent-primary)', color: 'black', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: 900 }}>⚡ HYPER</span>
                        </div>
                    </motion.button>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onSelectGame('nunchitap')}
                        style={{ borderLeft: '6px solid var(--accent-secondary)', fontSize: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                            <Hand size={32} color="var(--accent-secondary)" style={{ filter: 'drop-shadow(0 0 10px var(--accent-secondary))' }} />
                            <span style={{ flex: 1, textAlign: 'left', fontWeight: 900, textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>{t('menu.game_nunchitap')}</span>
                            <span style={{ fontSize: '0.8rem', background: 'var(--accent-secondary)', color: 'black', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: 900 }}>🧊 ICE</span>
                        </div>
                    </motion.button>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onSelectGame('vibevote')}
                        style={{ borderLeft: '6px solid var(--accent-warn)', fontSize: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                            <Users size={32} color="var(--accent-warn)" style={{ filter: 'drop-shadow(0 0 10px var(--accent-warn))' }} />
                            <span style={{ flex: 1, textAlign: 'left', fontWeight: 900, textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>{t('menu.game_vibevote')}</span>
                            <span style={{ fontSize: '0.8rem', background: 'var(--accent-warn)', color: 'black', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: 900 }}>🗣️ ROAST</span>
                        </div>
                    </motion.button>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onSelectGame('neverhave')}
                        style={{ borderLeft: '6px solid var(--accent-success)', fontSize: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                            <Target size={32} color="var(--accent-success)" style={{ filter: 'drop-shadow(0 0 10px var(--accent-success))' }} />
                            <span style={{ flex: 1, textAlign: 'left', fontWeight: 900, textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>{t('menu.game_never_have_i_ever')}</span>
                            <span style={{ fontSize: '0.8rem', background: 'var(--accent-success)', color: 'black', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: 900 }}>⚠️ EXPOSE</span>
                        </div>
                    </motion.button>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onSelectGame('kingscup')}
                        style={{ borderLeft: '6px solid #FF3366', fontSize: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem', borderColor: 'var(--neon-pink)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                            <Club size={32} color="var(--neon-pink)" style={{ filter: 'drop-shadow(0 0 10px var(--neon-pink))' }} />
                            <span style={{ flex: 1, textAlign: 'left', fontWeight: 900, textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>{t('menu.game_kings_cup')}</span>
                            <span style={{ fontSize: '0.8rem', background: 'var(--neon-pink)', color: 'black', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: 900 }}>💀 FATAL</span>
                        </div>
                    </motion.button>

                </motion.div>
            </motion.div>
        </div>
    );
};
