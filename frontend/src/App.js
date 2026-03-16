import { useState, useEffect } from "react";
import "@/App.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaInstagram, 
  FaTiktok, 
  FaYoutube, 
  FaTwitter, 
  FaTwitch,
  FaDiscord,
  FaSpotify,
  FaTelegram,
  FaHeart,
  FaChevronRight
} from "react-icons/fa";
import { SiThreads } from "react-icons/si";

// Heart Particles Component
const HeartParticles = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const createHeart = () => {
      const id = Date.now() + Math.random();
      const left = Math.random() * 100;
      const size = Math.random() * 16 + 10;
      const duration = Math.random() * 8 + 8;
      const delay = Math.random() * 2;

      setHearts(prev => [...prev, { id, left, size, duration, delay }]);

      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== id));
      }, (duration + delay) * 1000);
    };

    // Create initial hearts
    for (let i = 0; i < 5; i++) {
      setTimeout(createHeart, i * 500);
    }

    // Continue creating hearts
    const interval = setInterval(createHeart, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart-particle"
          style={{
            left: `${heart.left}%`,
            bottom: '-20px',
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            color: '#ff0033',
            opacity: 0.6
          }}
        >
          <FaHeart />
        </div>
      ))}
    </>
  );
};

// Profile Header Component
const ProfileHeader = ({ name, bio, avatarUrl }) => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="profile-avatar-wrapper mb-4">
        <div className="profile-avatar-ring">
          <div className="profile-avatar-inner">
            <img 
              src={avatarUrl} 
              alt={name}
              className="profile-avatar-img"
              data-testid="profile-avatar"
            />
          </div>
        </div>
      </div>
      
      <motion.h1 
        className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight"
        style={{ fontFamily: '"Outfit", sans-serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        data-testid="profile-name"
      >
        <span className="gradient-text">{name}</span>
      </motion.h1>
      
      <motion.p 
        className="text-white/60 text-sm max-w-[80%] leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        data-testid="profile-bio"
      >
        {bio}
      </motion.p>
    </motion.div>
  );
};

// Link Card Component
const LinkCard = ({ icon: Icon, label, url, index }) => {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-testid={`link-${label.toLowerCase().replace(/\s/g, '-')}`}
    >
      <Icon className="link-card-icon" />
      <span className="link-card-text">{label}</span>
      <FaChevronRight className="link-card-arrow" />
    </motion.a>
  );
};

// Main App Component
function App() {
  const profileData = {
    name: "Urheberrechtslos",
    bio: "Kreativ • Rechtslos • Frei ♡ Folge mir auf allen Plattformen!",
    avatarUrl: "https://images.unsplash.com/photo-1518706016428-64215811367b?crop=entropy&cs=srgb&fm=jpg&q=85&w=400"
  };

  const socialLinks = [
    { icon: FaInstagram, label: "Instagram", url: "https://instagram.com/Urheberrechtslos" },
    { icon: FaTiktok, label: "TikTok", url: "https://tiktok.com/@Rechtslos" },
    { icon: FaYoutube, label: "YouTube", url: "https://youtube.com/@KeinUrheber" },
    { icon: FaTwitter, label: "Twitter / X", url: "https://twitter.com/Urheberrechtslos" },
    { icon: SiThreads, label: "Threads", url: "https://threads.net/@Urheberrechtslos" },
    { icon: FaTwitch, label: "Twitch", url: "https://twitch.tv/Rechtslos" },
    { icon: FaDiscord, label: "Discord", url: "https://discord.gg/KeinUrheber" },
    { icon: FaSpotify, label: "Spotify", url: "https://open.spotify.com/user/Urheberrechtslos" },
    { icon: FaTelegram, label: "Telegram", url: "https://t.me/Urheberrechtslos" },
  ];

  return (
    <div className="link-page" data-testid="link-page">
      {/* Background Layer */}
      <div className="background-layer">
        <div className="background-gradient" />
        <div className="background-noise" />
        <HeartParticles />
      </div>

      {/* Content */}
      <div className="content-container">
        <ProfileHeader 
          name={profileData.name}
          bio={profileData.bio}
          avatarUrl={profileData.avatarUrl}
        />

        {/* Links */}
        <motion.div 
          className="w-full flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          data-testid="links-container"
        >
          {socialLinks.map((link, index) => (
            <LinkCard
              key={link.label}
              icon={link.icon}
              label={link.label}
              url={link.url}
              index={index}
            />
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer 
          className="footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="footer-text" data-testid="footer">
            Made with <FaHeart className="footer-heart" /> by Urheberrechtslos
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
