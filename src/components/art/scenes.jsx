import { useId } from 'react';
import { PottedPlant, HangingPlant, SPECIES, Leaf } from './plants';
import { PHOTOS } from '../../data/assets';

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, '');

/**
 * Renders a photo when one is configured in src/data/assets.js, otherwise the illustration.
 * `overlay` is an optional CSS background (e.g. a gradient) laid over the photo to keep text readable.
 */
export function Art({ photo, alt, className = '', children, label, overlay, imgClass = '' }) {
  if (!photo) return children;
  const img = <img src={photo} alt={alt || label || ''} loading="lazy" decoding="async" referrerPolicy="no-referrer" className={`${className} object-cover ${imgClass}`} />;
  if (!overlay) return img;
  return (
    <>
      {img}
      <div aria-hidden="true" className={className} style={{ background: overlay }} />
    </>
  );
}

const HERO_OVERLAY = 'linear-gradient(90deg, rgba(11,36,24,.78) 0%, rgba(11,36,24,.45) 45%, rgba(11,36,24,.1) 80%)';
const DARK_OVERLAY = 'rgba(11,36,24,.55)';

function Blur({ id, sd = 2.2 }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation={sd} />
    </filter>
  );
}

/** Sage-green interior: wall, window light, floor. */
function Room({ uid, w, h, wall = ['#9FB3A0', '#6E8873', '#4C6553'], floor = 0.8, windowX, light = 0.35, dark = false }) {
  return (
    <g>
      <defs>
        <linearGradient id={`wall-${uid}`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor={wall[0]} />
          <stop offset=".55" stopColor={wall[1]} />
          <stop offset="1" stopColor={wall[2]} />
        </linearGradient>
        <linearGradient id={`floor-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={dark ? '#3D4A3B' : '#B9AE97'} />
          <stop offset="1" stopColor={dark ? '#26301F' : '#8E826B'} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#FFF8E6" stopOpacity={light} />
          <stop offset="1" stopColor="#FFF8E6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#wall-${uid})`} />
      {windowX != null && (
        <g>
          <rect x={windowX} y={h * 0.06} width={w * 0.2} height={h * 0.62} fill="#E8EFE4" opacity=".55" />
          {[0.33, 0.66].map((t) => (
            <rect key={t} x={windowX + w * 0.2 * t - 3} y={h * 0.06} width="6" height={h * 0.62} fill={wall[1]} opacity=".9" />
          ))}
          <rect x={windowX} y={h * 0.36} width={w * 0.2} height="6" fill={wall[1]} opacity=".9" />
          <polygon points={`${windowX},${h * 0.68} ${windowX + w * 0.2},${h * 0.68} ${windowX + w * 0.36},${h} ${windowX - w * 0.1},${h}`} fill="#FFF6DC" opacity=".12" />
        </g>
      )}
      <ellipse cx={w * 0.55} cy={h * 0.35} rx={w * 0.5} ry={h * 0.5} fill={`url(#glow-${uid})`} />
      <rect y={h * floor} width={w} height={h * (1 - floor)} fill={`url(#floor-${uid})`} />
      <rect y={h * floor - 6} width={w} height="6" fill="#000" opacity=".08" />
    </g>
  );
}

/* ---------------- Hero ---------------- */
export function HeroScene({ className = '' }) {
  const uid = useUid();
  const W = 1440;
  const H = 760;
  const f = H * 0.84;
  return (
    <Art photo={PHOTOS.hero} className={className} overlay={HERO_OVERLAY} alt="Softly lit living room filled with potted plants">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMax slice" className={className} role="img" aria-label="Softly lit sage-green living room with hanging plants and lush potted foliage">
        <defs>
          <Blur id={`b1-${uid}`} sd={3} />
          <Blur id={`b2-${uid}`} sd={1.2} />
          <linearGradient id={`ov-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0B2418" stopOpacity=".72" />
            <stop offset=".42" stopColor="#0B2418" stopOpacity=".35" />
            <stop offset=".7" stopColor="#0B2418" stopOpacity="0" />
          </linearGradient>
        </defs>
        <Room uid={uid} w={W} h={H} floor={0.84} windowX={760} light={0.45} wall={['#A7B9A6', '#7D957F', '#56705C']} />
        {/* back plants (blurred) */}
        <g filter={`url(#b1-${uid})`} opacity=".8">
          <PottedPlant species="areca" pot="concrete" x={690} y={f - 30} s={1.4} uid={`${uid}a`} seed="h-areca" />
          <PottedPlant species="bird-of-paradise" pot="basket" x={1360} y={f - 26} s={1.7} uid={`${uid}b`} seed="h-bop" />
        </g>
        {/* shelf */}
        <rect x="1000" y={H * 0.44} width="440" height="10" fill="#6E5B42" />
        <PottedPlant species="peperomia" pot="white" potW={60} potH={48} x={1060} y={H * 0.44} s={1} uid={`${uid}c`} seed="h-pep" />
        <PottedPlant species="string-of-pearls" pot="terracotta" potW={56} potH={44} x={1180} y={H * 0.44} s={1.05} uid={`${uid}d`} seed="h-sop" />
        <PottedPlant species="snake" pot="cream" potW={56} potH={46} x={1300} y={H * 0.44} s={0.62} uid={`${uid}e`} seed="h-snake-s" />
        {/* hanging */}
        <HangingPlant x={880} drop={110} s={1.05} uid={`${uid}h1`} seed="h-hang1" pot="cream" />
        <HangingPlant x={1110} drop={40} s={0.95} uid={`${uid}h2`} seed="h-hang2" pot="white" />
        <HangingPlant x={1330} drop={90} s={0.9} uid={`${uid}h3`} seed="h-hang3" pot="terracotta" />
        {/* front plants */}
        <g filter={`url(#b2-${uid})`}>
          <PottedPlant species="snake" pot="basket" x={830} y={f + 40} s={1.15} uid={`${uid}f`} seed="h-snake" />
        </g>
        <PottedPlant species="monstera" pot="concrete" potW={120} potH={96} x={1020} y={f + 50} s={1.55} uid={`${uid}g`} seed="h-monstera" />
        <PottedPlant species="boston-fern" pot="white" x={1250} y={f + 58} s={1.3} uid={`${uid}i`} seed="h-fern" />
        <PottedPlant species="fiddle" pot="cream" x={1400} y={f + 70} s={1.55} uid={`${uid}j`} seed="h-fig" />
        <PottedPlant species="philodendron" pot="terracotta" x={640} y={f + 70} s={0.85} uid={`${uid}k`} seed="h-philo" />
        <rect width={W} height={H} fill={`url(#ov-${uid})`} />
      </svg>
    </Art>
  );
}

/* ---------------- Cut-out product image ---------------- */
const VIEW_FIT = { front: 1, detail: 2.1, pot: 1.45 };

export function plantFit(species) {
  const sp = SPECIES[species] || SPECIES.none;
  return { h: sp.h + 80 + (sp.below ? Math.max(0, sp.below - 80) : 0), w: Math.max(sp.w, 100) };
}

/**
 * Branded gift card artwork. The background fills whatever box it's given, and the card content is
 * drawn at a credit-card ratio and scaled to fit (never cropped), so it works as a wide card or a square thumbnail.
 */
export function GiftCardArt({ product, className = '', amount, design }) {
  const designs = { forest: ['#0B2418', '#2F6245', '#FFFFFF'], sage: ['#8FA88F', '#DDE8DC', '#0B2418'], terracotta: ['#B5663F', '#E9C2A6', '#FFFFFF'] };
  const [from, to, ink] = designs[design || product?.design] || designs.forest;
  const value = amount ?? product?.amount;
  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      role="img"
      aria-label={`Verdelle gift card${value ? ` worth $${value}` : ''}`}
    >
      <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M100 112C100 72 124 46 168 40c-3 42-28 68-68 72Z" fill={ink} opacity=".13" />
        <path d="M100 112C118 86 138 66 166 44" stroke={ink} strokeWidth=".8" fill="none" opacity=".3" />
        <text x="12" y="24" fill={ink} fontFamily="Playfair Display, Georgia, serif" fontStyle="italic" fontSize="15">
          Verdelle
        </text>
        <text x="12.5" y="34" fill={ink} opacity=".7" fontFamily="DM Sans, sans-serif" fontSize="4.6" letterSpacing="1.6">
          GIFT CARD
        </text>
        {value != null && (
          <text x="12" y="86" fill={ink} fontFamily="Playfair Display, Georgia, serif" fontWeight="600" fontSize="26">
            ${value}
          </text>
        )}
      </svg>
    </span>
  );
}

export function ProductImage({ product, view = 'front', className = '', bg = '#F2F3F0' }) {
  const uid = useUid();
  if (product.type === 'giftcard') return <GiftCardArt product={product} className={className} />;
  const front = PHOTOS.products[product.slug];
  const extra = PHOTOS.gallery?.[`${product.slug}-${view}`];
  const a = product.art;
  const label = `${product.name}${product.art.species !== 'none' ? ` in a ${a.pot} pot` : ''} — illustrated`;
  if (view === 'front' && front) return <Art photo={front} alt={product.imageAlt} className={className} />;
  if (extra) return <Art photo={extra} alt={product.imageAlt} className={className} />;
  // No dedicated gallery photo: reuse the main photo, zoomed for the leaf / pot close-ups.
  if (front && view !== 'room') {
    return (
      <span className={`block overflow-hidden ${className}`}>
        <img src={front} alt={product.imageAlt} loading="lazy" decoding="async" referrerPolicy="no-referrer" className={`h-full w-full scale-[1.8] object-cover ${view === 'detail' ? 'origin-top' : 'origin-bottom'}`} />
      </span>
    );
  }
  if (front && view === 'room' && PHOTOS.room) return <Art photo={PHOTOS.room} alt={`${product.name} styled in a living room`} className={className} />;

  if (view === 'room') {
    const W = 400;
    const H = 400;
    const fit = plantFit(a.species);
    const s = Math.min(300 / fit.h, 290 / fit.w) * 1.05;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={`${product.name} styled in a living room`}>
        <Room uid={uid} w={W} h={H} floor={0.82} windowX={30} light={0.4} />
        <rect x="250" y="250" width="160" height="80" rx="6" fill="#E9E1D0" opacity=".9" />
        <rect x="250" y="240" width="160" height="22" rx="8" fill="#F3EDE0" />
        <PottedPlant species={a.species} pot={a.pot} potShape={a.potShape} x={170} y={H * 0.82 + 22} s={s} uid={`${uid}p`} seed={product.slug} />
      </svg>
    );
  }

  const W = 400;
  const H = 400;
  const fit = plantFit(a.species);
  const zoom = VIEW_FIT[view] || 1;
  const base = Math.min(330 / fit.h, 320 / fit.w);
  const s = base * zoom;
  // detail = crop toward foliage; pot = crop toward lower plant + pot
  const y = view === 'detail' ? H * 0.5 + fit.h * s * 0.55 : view === 'pot' ? H * 0.98 + (SPECIES[a.species]?.below ? -40 : 0) : H - 32 - (SPECIES[a.species]?.below ? Math.max(0, SPECIES[a.species].below - 80) * s : 0);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={label}>
      <rect width={W} height={H} fill={bg} />
      <ellipse cx={W / 2} cy={H * 0.45} rx={W * 0.42} ry={H * 0.42} fill="#fff" opacity=".45" />
      {a.species === 'none' ? (
        <PottedPlant species="none" pot={a.pot} potW={150} potH={130} potShape={a.potShape} x={W / 2} y={H - 80} uid={`${uid}p`} />
      ) : (
        <PottedPlant species={a.species} pot={a.pot} potShape={a.potShape} x={W / 2} y={y} s={s} uid={`${uid}p`} seed={product.slug} />
      )}
    </svg>
  );
}

/* ---------------- Large standalone plant (benefits) ---------------- */
export function FeaturePlant({ className = '' }) {
  const uid = useUid();
  return (
    <Art photo={PHOTOS.featurePlant} className={className} alt="Aloe plant in a white pot">
      <svg viewBox="-170 -420 340 440" className={className} role="img" aria-label="Large leafy plant in a white ceramic pot">
        <ellipse cx="0" cy="8" rx="120" ry="12" fill="#173F2D" opacity=".08" />
        <PottedPlant species="yucca" pot="white" potW={120} potH={104} x={0} y={0} s={1.2} uid={uid} seed="feature-yucca" />
      </svg>
    </Art>
  );
}

/* ---------------- Collection band backdrop ---------------- */
export function GreenBandScene({ className = '' }) {
  const uid = useUid();
  const W = 1440;
  const H = 420;
  return (
    <Art photo={PHOTOS.collectionBand} className={className} overlay={DARK_OVERLAY} alt="">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
        <defs>
          <Blur id={`b-${uid}`} sd={4} />
        </defs>
        <Room uid={uid} w={W} h={H} floor={0.86} light={0.3} wall={['#506B53', '#3A5640', '#24402D']} dark />
        <g filter={`url(#b-${uid})`} opacity=".85">
          <PottedPlant species="areca" pot="concrete" x={80} y={H * 0.92} s={1.2} uid={`${uid}1`} seed="band-1" />
          <PottedPlant species="monstera" pot="basket" x={720} y={H * 0.95} s={1.1} uid={`${uid}2`} seed="band-2" />
          <PottedPlant species="bird-of-paradise" pot="white" x={1380} y={H * 0.95} s={1.3} uid={`${uid}3`} seed="band-3" />
          <PottedPlant species="boston-fern" pot="terracotta" x={1060} y={H * 0.96} s={1} uid={`${uid}4`} seed="band-4" />
        </g>
        <rect width={W} height={H} fill="#0B2418" opacity=".28" />
      </svg>
    </Art>
  );
}

/** Small framed plant photo used inside collection cards. */
export function FramedPlant({ species, pot, seed, className = '' }) {
  const uid = useUid();
  const fit = plantFit(species);
  const s = Math.min(250 / fit.h, 240 / fit.w);
  const photo = PHOTOS.species?.[species];
  if (photo) return <Art photo={photo} className={className} alt={`${species === 'none' ? 'Plant pot' : species.replace(/-/g, ' ')} ${species === 'none' ? '' : 'plant'}`.trim()} />;
  return (
    <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={`${species.replace(/-/g, ' ')} plant`}>
      <Room uid={uid} w={300} h={300} floor={0.84} light={0.5} wall={['#DCE4D9', '#C3D0C1', '#A9B9A7']} />
      <PottedPlant species={species} pot={pot} x={150} y={286} s={s} uid={`${uid}p`} seed={seed} />
    </svg>
  );
}

/* ---------------- Sale banner ---------------- */
export function SaleScene({ className = '' }) {
  const uid = useUid();
  const W = 900;
  const H = 360;
  return (
    <Art photo={PHOTOS.sale} className={className} alt="">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMax slice" className={className} role="img" aria-label="Group of potted foliage plants on a sunny shelf">
        <defs>
          <Blur id={`b-${uid}`} sd={2.5} />
        </defs>
        <Room uid={uid} w={W} h={H} floor={0.86} light={0.5} wall={['#C5D2C2', '#9DB09C', '#6F8A74']} />
        <g filter={`url(#b-${uid})`} opacity=".9">
          <PottedPlant species="areca" pot="concrete" x={560} y={H * 0.9} s={1} uid={`${uid}0`} seed="sale-0" />
        </g>
        <rect x="430" y={H * 0.5} width="470" height="9" fill="#7B6A50" />
        <PottedPlant species="aloe" pot="white" potW={70} potH={56} x={500} y={H * 0.5} s={0.85} uid={`${uid}1`} seed="sale-1" />
        <PottedPlant species="pothos" pot="terracotta" potW={70} potH={56} x={640} y={H * 0.5} s={0.9} uid={`${uid}2`} seed="sale-2" />
        <PottedPlant species="snake" pot="basket" x={700} y={H * 0.98} s={0.95} uid={`${uid}3`} seed="sale-3" />
        <PottedPlant species="monstera" pot="white" x={820} y={H * 1.0} s={1.05} uid={`${uid}4`} seed="sale-4" />
        <PottedPlant species="peace-lily" pot="cream" x={560} y={H * 1.0} s={0.85} uid={`${uid}5`} seed="sale-5" />
        <HangingPlant x={790} y={-20} drop={20} s={0.75} uid={`${uid}6`} seed="sale-6" pot="cream" />
      </svg>
    </Art>
  );
}

/* ---------------- Newsletter & footer backdrops ---------------- */
export function LeafyInteriorScene({ className = '', variant = 'newsletter' }) {
  const uid = useUid();
  const W = 1440;
  const H = 440;
  const dark = variant === 'footer';
  const photo = dark ? PHOTOS.footer : PHOTOS.newsletter;
  return (
    <Art photo={photo} className={className} overlay={dark ? 'rgba(11,36,24,.82)' : DARK_OVERLAY} alt="">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
        <defs>
          <Blur id={`b-${uid}`} sd={dark ? 3 : 2} />
        </defs>
        <Room uid={uid} w={W} h={H} floor={0.88} windowX={dark ? null : 80} light={dark ? 0.15 : 0.35} wall={dark ? ['#2F4A37', '#1F3A2A', '#132A1D'] : ['#93A895', '#6F8873', '#4E6754']} dark={dark} />
        <g filter={`url(#b-${uid})`} opacity={dark ? 0.75 : 0.9}>
          <PottedPlant species="monstera" pot="basket" x={120} y={H * 0.97} s={1.2} uid={`${uid}1`} seed={`${variant}-1`} />
          <PottedPlant species="areca" pot="concrete" x={330} y={H * 0.95} s={1} uid={`${uid}2`} seed={`${variant}-2`} />
          <PottedPlant species="snake" pot="cream" x={1110} y={H * 0.97} s={1} uid={`${uid}3`} seed={`${variant}-3`} />
          <PottedPlant species="bird-of-paradise" pot="white" x={1330} y={H * 0.98} s={1.15} uid={`${uid}4`} seed={`${variant}-4`} />
          <PottedPlant species="boston-fern" pot="terracotta" x={900} y={H * 0.98} s={0.9} uid={`${uid}5`} seed={`${variant}-5`} />
          {!dark && <HangingPlant x={1220} y={-10} drop={30} s={0.9} uid={`${uid}6`} seed="nl-hang" />}
          {!dark && <HangingPlant x={560} y={-10} drop={10} s={0.8} uid={`${uid}7`} seed="nl-hang2" pot="white" />}
        </g>
        <rect width={W} height={H} fill="#0B2418" opacity={dark ? 0.35 : 0.38} />
      </svg>
    </Art>
  );
}

/* ---------------- People (illustrated portraits) ---------------- */
const SKIN = ['#E8C1A0', '#C68E68', '#8D5A3E', '#F0CFB4'];
const HAIR = ['#3A2A1E', '#1E1712', '#6B4A2E', '#2B2018'];

export function PortraitScene({ variant = 0, plant = 'pothos', className = '', label }) {
  const uid = useUid();
  const skin = SKIN[variant % SKIN.length];
  const hair = HAIR[variant % HAIR.length];
  const shirt = ['#F5F1E8', '#8FA88F', '#2F6245', '#DCC497'][variant % 4];
  // Testimonials show the reviewer's plant, not a stock face (the reviews are illustrative).
  const photo = PHOTOS.species?.[plant];
  if (photo) return <Art photo={photo} className={className} alt={`${plant.replace(/-/g, ' ')} plant`} />;
  return (
    <svg viewBox="0 0 300 340" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={label || 'Illustrated customer holding a potted plant'}>
      <Room uid={uid} w={300} h={340} floor={1} light={0.5} wall={['#E4EBE1', '#CBD8C8', '#A9BCA8']} />
      <path d="M60 340 C 60 260, 100 236, 150 236 C 200 236, 240 260, 240 340 Z" fill={shirt} />
      <rect x="136" y="200" width="28" height="42" rx="10" fill={skin} />
      <path d="M102 128 C 102 70, 198 70, 198 128 C 198 176, 178 212, 150 212 C 122 212, 102 176, 102 128 Z" fill={skin} />
      {variant % 2 ? (
        <path d="M96 140 C 84 50, 216 46, 204 140 C 206 100, 186 82, 150 82 C 114 82, 96 98, 96 140 Z M96 140 C 92 190, 96 240, 112 262 L 116 170 Z M204 140 C 208 190, 204 240, 188 262 L 184 170 Z" fill={hair} />
      ) : (
        <path d="M98 132 C 90 56, 214 52, 202 132 C 200 98, 184 84, 150 86 C 118 86, 100 98, 98 132 Z" fill={hair} />
      )}
      <path d="M132 136 q7 -5 14 0 M158 136 q7 -5 14 0" stroke="#2A1E16" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M136 172 q14 11 28 0" stroke="#8E4E3C" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="128" cy="158" rx="8" ry="4.5" fill="#E79A86" opacity=".3" />
      <ellipse cx="176" cy="158" rx="8" ry="4.5" fill="#E79A86" opacity=".3" />
      <PottedPlant species={plant} pot={variant % 2 ? 'terracotta' : 'white'} potW={70} potH={58} x={variant % 2 ? 214 : 88} y={322} s={0.82} uid={`${uid}p`} seed={`portrait-${variant}`} />
      <ellipse cx={variant % 2 ? 214 : 88} cy="300" rx="34" ry="12" fill={skin} />
    </svg>
  );
}

/* ---------------- Editorial images (blog + care guides) ---------------- */
export function EditorialScene({ kind = 'shelf', className = '', label }) {
  const uid = useUid();
  const W = 480;
  const H = 360;
  const scenes = {
    beginner: (
      <>
        <Room uid={uid} w={W} h={H} floor={1} light={0.5} wall={['#E7DCC8', '#D6C5A6', '#BFA77F']} />
        <path d="M120 360 C 120 280, 170 260, 240 260 C 310 260, 360 280, 360 360 Z" fill="#E8DFCF" />
        <ellipse cx="190" cy="262" rx="40" ry="16" fill="#C68E68" />
        <ellipse cx="292" cy="262" rx="40" ry="16" fill="#C68E68" />
        <PottedPlant species="peperomia" pot="white" potW={110} potH={90} x={240} y={300} s={1.2} uid={`${uid}p`} seed="ed-beginner" />
      </>
    ),
    shelf: (
      <>
        <Room uid={uid} w={W} h={H} floor={0.86} light={0.45} wall={['#E2EAE0', '#C6D3C3', '#9FB39E']} />
        <rect x="0" y="198" width={W} height="8" fill="#8A7457" />
        <PottedPlant species="snake" pot="white" potW={66} potH={54} x={80} y={198} s={0.55} uid={`${uid}1`} seed="ed-s1" />
        <PottedPlant species="spider" pot="cream" potW={66} potH={54} x={200} y={198} s={0.62} uid={`${uid}2`} seed="ed-s2" />
        <PottedPlant species="peace-lily" pot="white" potW={66} potH={54} x={320} y={198} s={0.55} uid={`${uid}3`} seed="ed-s3" />
        <PottedPlant species="pothos" pot="terracotta" potW={66} potH={54} x={430} y={198} s={0.62} uid={`${uid}4`} seed="ed-s4" />
        <PottedPlant species="boston-fern" pot="white" x={140} y={H * 0.98} s={0.85} uid={`${uid}5`} seed="ed-s5" />
        <PottedPlant species="areca" pot="concrete" x={360} y={H * 1.0} s={0.7} uid={`${uid}6`} seed="ed-s6" />
      </>
    ),
    watering: (
      <>
        <Room uid={uid} w={W} h={H} floor={0.84} light={0.5} wall={['#E6E2D6', '#D2CBB8', '#B5AC94']} />
        <PottedPlant species="calathea" pot="white" x={180} y={H * 0.92} s={1.05} uid={`${uid}1`} seed="ed-w1" />
        <PottedPlant species="syngonium" pot="terracotta" x={370} y={H * 0.92} s={0.85} uid={`${uid}2`} seed="ed-w2" />
        <g transform="translate(270 60) rotate(-22)">
          <path d="M0 40 L90 40 L80 110 L10 110 Z" fill="#B5663F" />
          <path d="M-60 20 L5 60 L5 72 L-64 30 Z" fill="#9E5634" />
          <path d="M20 40 C 20 0, 70 0, 70 40" stroke="#9E5634" strokeWidth="7" fill="none" />
          <path d="M-64 26 q -20 30 -14 70 M-58 28 q -8 34 2 66 M-66 30 q -30 22 -32 60" stroke="#BFD6E0" strokeWidth="2" fill="none" strokeDasharray="3 6" />
        </g>
      </>
    ),
    lowlight: (
      <>
        <Room uid={uid} w={W} h={H} floor={0.84} light={0.12} wall={['#5C6E5E', '#455748', '#2F3F33']} dark />
        <rect x="40" y="40" width="80" height="170" fill="#C8D3C4" opacity=".22" />
        <PottedPlant species="zz" pot="white" x={140} y={H * 0.92} s={0.95} uid={`${uid}1`} seed="ed-l1" />
        <PottedPlant species="snake" pot="concrete" x={300} y={H * 0.92} s={0.9} uid={`${uid}2`} seed="ed-l2" />
        <PottedPlant species="chinese-evergreen" pot="black" x={410} y={H * 0.94} s={0.9} uid={`${uid}3`} seed="ed-l3" />
      </>
    ),
    repot: (
      <>
        <Room uid={uid} w={W} h={H} floor={0.7} light={0.4} wall={['#E7DCC8', '#D6C5A6', '#BFA77F']} />
        <rect y={H * 0.7} width={W} height={H * 0.3} fill="#A88C6A" />
        <ellipse cx="300" cy="300" rx="80" ry="18" fill="#5A4030" opacity=".8" />
        <PottedPlant species="none" pot="terracotta" potW={110} potH={90} x={140} y={320} uid={`${uid}1`} />
        <PottedPlant species="syngonium" pot="white" potW={80} potH={66} x={320} y={300} s={0.9} uid={`${uid}2`} seed="ed-r2" />
      </>
    ),
    problem: (
      <>
        <Room uid={uid} w={W} h={H} floor={1} light={0.4} wall={['#EEF1E8', '#DCE4D6', '#C1CFBE']} />
        {[0, 1, 2].map((i) => (
          <Leaf key={i} x={120 + i * 120} y={300} rot={-10 + i * 10} len={210} w={70} type="heart" color={['#C8B24A', '#7D9C4A', '#3F6E3B'][i]} light={0.2} />
        ))}
      </>
    ),
    propagate: (
      <>
        <Room uid={uid} w={W} h={H} floor={0.78} light={0.5} wall={['#E9EFE6', '#D2DECF', '#B3C4B0']} />
        <rect y={H * 0.78} width={W} height={H * 0.22} fill="#D9CFBD" />
        {[150, 250, 350].map((x, i) => (
          <g key={x}>
            <path d={`M${x - 26} 170 L${x + 26} 170 L${x + 20} 282 L${x - 20} 282 Z`} fill="#DCEAF0" opacity=".7" stroke="#B6CBD3" />
            <rect x={x - 21} y="210" width="42" height="70" fill="#BFD9E3" opacity=".6" />
            <path d={`M${x} 270 l -8 12 M${x} 270 l 7 12 M${x} 270 l 0 14`} stroke="#E8DDC4" strokeWidth="1.5" />
            <path d={`M${x} 272 L${x} 120`} stroke="#5E8040" strokeWidth="2" />
            <Leaf x={x} y={128} rot={-30 + i * 25} len={50} w={24} type="heart" color={i === 1 ? '#5E8C45' : '#3F6E3B'} light={0.2} />
          </g>
        ))}
      </>
    ),
    pests: (
      <>
        <Room uid={uid} w={W} h={H} floor={1} light={0.4} wall={['#EEF1E8', '#DCE4D6', '#C1CFBE']} />
        <Leaf x={240} y={340} rot={8} len={300} w={110} type="ovate" color="#3F6E3B" light={0.22} />
        <g transform="translate(300 150) rotate(-20)">
          <rect x="-8" y="-40" width="16" height="70" rx="6" fill="#E8EEE6" stroke="#9FB39E" />
          <rect x="-12" y="-56" width="24" height="18" rx="4" fill="#2F6245" />
          {[0, 1, 2, 3, 4].map((k) => (
            <circle key={k} cx={-30 - k * 10} cy={-60 + k * 4} r="2" fill="#CFE0EA" />
          ))}
        </g>
      </>
    ),
    fertilize: (
      <>
        <Room uid={uid} w={W} h={H} floor={0.82} light={0.45} wall={['#E7E2D3', '#D3CBB5', '#B9AE92']} />
        <PottedPlant species="anthurium" pot="white" x={170} y={H * 0.92} s={0.95} uid={`${uid}1`} seed="ed-f1" />
        <g transform="translate(330 220)">
          <rect x="-34" y="0" width="68" height="96" rx="10" fill="#F5F1E8" stroke="#C8BFA8" />
          <rect x="-34" y="26" width="68" height="34" fill="#2F6245" />
          <rect x="-16" y="-14" width="32" height="16" rx="3" fill="#173F2D" />
        </g>
      </>
    ),
    prune: (
      <>
        <Room uid={uid} w={W} h={H} floor={0.84} light={0.45} wall={['#E2EAE0', '#C6D3C3', '#9FB39E']} />
        <PottedPlant species="rubber" pot="cream" x={200} y={H * 0.94} s={1.05} uid={`${uid}1`} seed="ed-p1" />
        <g transform="translate(330 170) rotate(30)">
          <path d="M0 0 L40 -10 L44 -4 L4 6 Z M0 0 L40 10 L44 4 L4 -6 Z" fill="#B8BDB6" />
          <path d="M0 0 C -20 -20, -50 -14, -54 4 C -40 6, -20 4, 0 0 Z M0 0 C -20 20, -50 14, -54 -4" fill="#B5663F" />
        </g>
      </>
    ),
    light: (
      <>
        <Room uid={uid} w={W} h={H} floor={0.84} windowX={40} light={0.6} wall={['#EEF0E6', '#D8E0D2', '#B9C8B6']} />
        <PottedPlant species="bird-of-paradise" pot="white" x={150} y={H * 0.94} s={0.75} uid={`${uid}1`} seed="ed-li1" />
        <PottedPlant species="calathea" pot="sage" x={380} y={H * 0.94} s={0.85} uid={`${uid}2`} seed="ed-li2" />
      </>
    ),
  };
  const photo = PHOTOS.editorial?.[kind];
  if (photo) return <Art photo={photo} className={className} alt={label || 'Indoor plants'} />;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={label || 'Indoor plant illustration'}>
      {scenes[kind] || scenes.shelf}
    </svg>
  );
}

/* ---------------- Page banner ---------------- */
export function PageBannerScene({ className = '', plants = ['monstera', 'snake'] }) {
  const uid = useUid();
  const W = 1440;
  const H = 360;
  if (PHOTOS.banner) return <Art photo={PHOTOS.banner} className={className} overlay={HERO_OVERLAY} alt="" />;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMax slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`ov-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0B2418" stopOpacity=".75" />
          <stop offset=".5" stopColor="#0B2418" stopOpacity=".35" />
          <stop offset=".8" stopColor="#0B2418" stopOpacity="0" />
        </linearGradient>
        <Blur id={`b-${uid}`} sd={2.5} />
      </defs>
      <Room uid={uid} w={W} h={H} floor={0.86} light={0.45} windowX={900} wall={['#A7B9A6', '#7D957F', '#56705C']} />
      <g filter={`url(#b-${uid})`}>
        <PottedPlant species="areca" pot="concrete" x={1020} y={H * 0.94} s={1} uid={`${uid}0`} seed="pb-0" />
      </g>
      <HangingPlant x={1330} y={-10} drop={20} s={0.8} uid={`${uid}h`} seed="pb-hang" />
      <PottedPlant species={plants[0]} pot="basket" x={1200} y={H * 1.02} s={1.1} uid={`${uid}1`} seed="pb-1" />
      <PottedPlant species={plants[1]} pot="white" x={1380} y={H * 1.02} s={0.95} uid={`${uid}2`} seed="pb-2" />
      <rect width={W} height={H} fill={`url(#ov-${uid})`} />
    </svg>
  );
}
