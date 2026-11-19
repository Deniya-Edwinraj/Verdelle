// Species-specific plant illustrations drawn as SVG.
// Every plant is drawn in local coordinates with (0,0) at the bottom-centre of its pot.
// Used for product cut-outs, galleries and the room scenes, so the same plant looks
// identical everywhere. Swap in photography via src/data/assets.js when available.

/* ---------------- deterministic randomness ---------------- */
export function rngFrom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------- leaf geometry ---------------- */
// Left edges as cubic segments from base (0,0) to tip (0,-1), in units of (half-width, length).
const SHAPES = {
  ovate: [[-1, -0.12, -0.95, -0.72, 0, -1]],
  lance: [[-1, -0.22, -0.55, -0.8, 0, -1]],
  narrow: [[-1, -0.3, -0.35, -0.85, 0, -1]],
  heart: [
    [-0.3, 0.14, -1.05, 0.08, -0.98, -0.32],
    [-0.9, -0.72, -0.25, -0.92, 0, -1],
  ],
  arrow: [
    [-0.5, 0.25, -1.1, 0.2, -0.95, -0.1],
    [-0.6, -0.4, -0.3, -0.85, 0, -1],
  ],
  fiddle: [
    [-0.55, -0.04, -0.8, -0.3, -0.6, -0.46],
    [-0.45, -0.58, -1.08, -0.7, -0.86, -0.92],
    [-0.62, -1.04, -0.12, -1.02, 0, -1],
  ],
  paddle: [[-1, -0.05, -1.02, -0.9, 0, -1]],
  round: [[-1.05, 0.05, -1.1, -0.95, 0, -1]],
  sword: [[-1, -0.55, -0.55, -0.92, 0, -1]],
};

function leafPaths(type, w, len) {
  const segs = SHAPES[type] || SHAPES.ovate;
  const P = (x, y) => `${(x * w).toFixed(1)} ${(y * len).toFixed(1)}`;
  let left = 'M0 0';
  segs.forEach((s) => (left += ` C${P(s[0], s[1])} ${P(s[2], s[3])} ${P(s[4], s[5])}`));
  // mirrored, reversed right edge
  let right = '';
  const pts = [[0, 0], ...segs.map((s) => [s[4], s[5]])];
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i];
    const start = pts[i];
    right += ` C${P(-s[2], s[3])} ${P(-s[0], s[1])} ${P(-start[0], start[1])}`;
  }
  return { full: `${left}${right} Z`, half: `${left} L0 0 Z` };
}

const shadeHex = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v));
  return `#${((c((n >> 16) + amt) << 16) | (c(((n >> 8) & 255) + amt) << 8) | c((n & 255) + amt)).toString(16).padStart(6, '0')}`;
};

/** A single leaf. (x,y) is the attachment point; rot in degrees (0 = pointing up). */
export function Leaf({ x = 0, y = 0, rot = 0, len = 60, w = 24, type = 'ovate', color = '#3F6B3A', vein = true, light = 0.16, pattern, edge, curl = 1 }) {
  const { full, half } = leafPaths(type, w, len);
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${curl} 1)`}>
      <path d={full} fill={color} />
      <path d={half} fill="#fff" opacity={light} />
      {pattern}
      {edge && <path d={full} fill="none" stroke={edge} strokeWidth={Math.max(1.2, w * 0.12)} opacity=".9" />}
      {vein && <path d={`M0 0 Q ${w * 0.08} ${-len * 0.5} 0 ${-len * 0.96}`} stroke={shadeHex(color, 45)} strokeOpacity=".55" strokeWidth={Math.max(0.8, w * 0.05)} fill="none" />}
    </g>
  );
}

function Stem({ x1 = 0, y1 = 0, x2, y2, bend = 0, color = '#4D6B37', width = 2.2 }) {
  const mx = (x1 + x2) / 2 + bend;
  const my = (y1 + y2) / 2;
  return <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />;
}

const pt = (len, deg) => {
  const r = (deg * Math.PI) / 180;
  return [Math.sin(r) * len, -Math.cos(r) * len];
};

/* ---------------- pots ---------------- */
export const POTS = {
  white: { body: ['#D9DCD6', '#FFFFFF', '#E6E8E3'], rim: '#F4F5F2' },
  cream: { body: ['#D8D0BF', '#F6F1E6', '#E3DACA'], rim: '#EFE8DA' },
  terracotta: { body: ['#9A4E2C', '#D88A5E', '#B9673F'], rim: '#C97650' },
  basket: { body: ['#A98A5B', '#DCC497', '#BFA070'], rim: '#C9AE7F', ribbed: true },
  concrete: { body: ['#8F938D', '#C9CCC6', '#A9ADA7'], rim: '#B8BBB5' },
  forest: { body: ['#0F2E20', '#2F6245', '#1B4532'], rim: '#24543B' },
  black: { body: ['#1D211E', '#4A504B', '#2D322E'], rim: '#3A403B' },
  sage: { body: ['#71876F', '#B6C8B3', '#8FA88F'], rim: '#A3B8A1' },
};

export function Pot({ type = 'white', w = 92, h = 78, uid, shape = 'taper' }) {
  const p = POTS[type] || POTS.white;
  const gid = `pot-${uid}`;
  const top = w / 2;
  const bot = shape === 'bowl' ? w * 0.3 : shape === 'cylinder' ? w * 0.47 : w * 0.38;
  const body =
    shape === 'bowl'
      ? `M${-top} ${-h} C ${-top} ${-h * 0.2}, ${-bot * 1.2} 0, ${-bot} 0 L ${bot} 0 C ${bot * 1.2} 0, ${top} ${-h * 0.2}, ${top} ${-h} Z`
      : `M${-top} ${-h} L ${-bot} ${-4} Q ${-bot} 0 ${-bot + 5} 0 L ${bot - 5} 0 Q ${bot} 0 ${bot} ${-4} L ${top} ${-h} Z`;
  return (
    <g>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={p.body[0]} />
          <stop offset=".35" stopColor={p.body[1]} />
          <stop offset=".75" stopColor={p.body[2]} />
          <stop offset="1" stopColor={p.body[0]} />
        </linearGradient>
      </defs>
      <ellipse cx="4" cy="1" rx={w * 0.62} ry="6" fill="#0B2418" opacity=".14" />
      <path d={body} fill={`url(#${gid})`} />
      {p.ribbed &&
        Array.from({ length: 9 }).map((_, i) => {
          const t = (i + 1) / 10;
          const xt = -top + t * w;
          const xb = -bot + t * bot * 2;
          return <path key={i} d={`M${xt} ${-h + 6} L${xb} -3`} stroke="#8A6D42" strokeWidth="1.3" opacity=".45" />;
        })}
      <rect x={-top - 2} y={-h - 5} width={w + 4} height={shape === 'bowl' ? 6 : 10} rx="3" fill={p.rim} />
      <ellipse cx="0" cy={-h - 4} rx={top - 2} ry="4" fill="#3B2A1C" opacity=".85" />
    </g>
  );
}

/* ---------------- species ---------------- */
const G = { deep: '#2C5233', mid: '#3F6E3B', fresh: '#5E8C45', light: '#86AD5D', lime: '#A8C46A', olive: '#53703A' };

function philodendron(r) {
  const out = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = -70 + (140 * i) / (n - 1) + (r() - 0.5) * 12;
    const L = 70 + r() * 50 - Math.abs(a) * 0.25;
    const [x, y] = pt(L, a);
    out.push(<Stem key={`s${i}`} x2={x} y2={y} bend={a * 0.15} color="#5A7A3C" width={2.4} />);
    out.push(<Leaf key={`l${i}`} x={x} y={y} rot={a * 1.25} len={62 + r() * 16} w={30 + r() * 6} type="heart" color={i % 3 ? G.mid : G.deep} light={0.2} />);
  }
  return out;
}

function peaceLily(r) {
  const out = [];
  for (let i = 0; i < 13; i++) {
    const a = -62 + (124 * i) / 12 + (r() - 0.5) * 10;
    out.push(<Leaf key={`l${i}`} rot={a} len={100 + r() * 45 - Math.abs(a) * 0.5} w={17 + r() * 4} type="lance" color={i % 2 ? G.deep : '#24472C'} light={0.22} />);
  }
  [-14, 6, 22].forEach((a, i) => {
    const [x, y] = pt(150 + i * 8, a * 0.5);
    out.push(
      <g key={`f${i}`}>
        <Stem x2={x} y2={y} bend={a * 0.4} color="#4F7A3E" width={2} />
        <Leaf x={x} y={y + 6} rot={a * 0.9} len={42} w={15} type="ovate" color="#FBFBF5" light={0} vein={false} />
        <path d={`M${x} ${y + 4} q ${a * 0.06} -12 ${a * 0.1} -20`} stroke="#E8D98A" strokeWidth="5" strokeLinecap="round" />
      </g>,
    );
  });
  return out;
}

function caladium(r) {
  const out = [];
  for (let i = 0; i < 9; i++) {
    const a = -62 + (124 * i) / 8 + (r() - 0.5) * 10;
    const [x, y] = pt(50 + r() * 45, a);
    const len = 52 + r() * 14;
    const w = 26 + r() * 5;
    out.push(<Stem key={`s${i}`} x2={x} y2={y} bend={a * 0.2} color="#9BB27B" width={2} />);
    out.push(
      <Leaf
        key={`l${i}`}
        x={x}
        y={y}
        rot={a * 1.2}
        len={len}
        w={w}
        type="heart"
        color="#EEF2E5"
        edge="#4E7D45"
        light={0}
        vein={false}
        pattern={
          <g stroke="#5E8C45" strokeWidth="1.6" fill="none" opacity=".85">
            <path d={`M0 0 L0 ${-len * 0.95}`} />
            {[0.3, 0.5, 0.7].map((t) => (
              <g key={t}>
                <path d={`M0 ${-len * t} q ${-w * 0.4} ${-len * 0.05} ${-w * 0.8} ${-len * 0.14}`} />
                <path d={`M0 ${-len * t} q ${w * 0.4} ${-len * 0.05} ${w * 0.8} ${-len * 0.14}`} />
              </g>
            ))}
          </g>
        }
      />,
    );
  }
  return out;
}

function zz(r) {
  const out = [];
  for (let i = 0; i < 8; i++) {
    const a = -32 + (64 * i) / 7 + (r() - 0.5) * 8;
    const L = 120 + r() * 60 - Math.abs(a);
    const [x, y] = pt(L, a);
    out.push(<Stem key={`s${i}`} x2={x} y2={y} bend={a * 0.25} color="#3E5E2C" width={3.4} />);
    for (let k = 0; k < 7; k++) {
      const t = 0.28 + (k / 7) * 0.72;
      const [px, py] = pt(L * t, a);
      [-1, 1].forEach((side) =>
        out.push(<Leaf key={`l${i}${k}${side}`} x={px} y={py} rot={a + side * (58 - k * 4)} len={22 - k * 1.4} w={8.5 - k * 0.5} type="ovate" color={k % 2 ? '#2F5A2C' : '#3D6E33'} light={0.32} vein={false} />),
      );
    }
    out.push(<Leaf key={`t${i}`} x={x} y={y} rot={a} len={16} w={6} type="ovate" color="#3D6E33" light={0.32} vein={false} />);
  }
  return out;
}

function fiddle(r) {
  const out = [<path key="trunk" d="M0 0 C 2 -60, -6 -120, 2 -190" stroke="#6B5640" strokeWidth="6" fill="none" strokeLinecap="round" />];
  for (let k = 0; k < 11; k++) {
    const y = -78 - k * 13;
    const side = k % 2 ? 1 : -1;
    const a = side * (40 + r() * 25) * (1 - k / 16);
    out.push(<Leaf key={k} x={side * 2} y={y} rot={a} len={58 - k * 2} w={28 - k * 0.6} type="fiddle" color={k % 3 ? '#2E5A2E' : '#3E6E36'} light={0.22} />);
  }
  out.push(<Leaf key="top" x={2} y={-190} rot={-4} len={34} w={15} type="fiddle" color="#4E7D3F" light={0.25} />);
  return out;
}

function anthurium(r) {
  const out = [];
  for (let i = 0; i < 8; i++) {
    const a = -60 + (120 * i) / 7 + (r() - 0.5) * 10;
    const [x, y] = pt(55 + r() * 40, a);
    out.push(<Stem key={`s${i}`} x2={x} y2={y} bend={a * 0.2} color="#4D6E35" />);
    out.push(<Leaf key={`l${i}`} x={x} y={y} rot={a * 1.3} len={58 + r() * 12} w={26} type="heart" color={i % 2 ? '#24472C' : '#2E5733'} light={0.25} />);
  }
  [-30, 8, 34].forEach((a, i) => {
    const [x, y] = pt(108 + (i % 2) * 18, a);
    out.push(
      <g key={`f${i}`}>
        <Stem x2={x} y2={y} bend={a * 0.3} color="#4F6E35" width={1.8} />
        <Leaf x={x} y={y} rot={a * 1.1} len={34} w={19} type="heart" color="#C4253A" light={0.25} vein={false} />
        <path d={`M${x} ${y} l ${Math.sin((a * Math.PI) / 180) * 26} ${-Math.cos((a * Math.PI) / 180) * 26}`} stroke="#EBCB65" strokeWidth="4" strokeLinecap="round" />
      </g>,
    );
  });
  return out;
}

const varPattern = (len, w, tone = '#D9DE8C') => (
  <g fill={tone} opacity=".75">
    <path d={`M${-w * 0.15} ${-len * 0.2} q ${-w * 0.35} ${-len * 0.3} ${-w * 0.15} ${-len * 0.6} q ${w * 0.1} ${len * 0.2} ${w * 0.1} ${len * 0.55} z`} />
    <path d={`M${w * 0.3} ${-len * 0.35} q ${w * 0.25} ${-len * 0.2} ${w * 0.1} ${-len * 0.42} q ${-w * 0.2} ${len * 0.2} ${-w * 0.25} ${len * 0.4} z`} />
  </g>
);

function pothos(r, { hanging = false } = {}) {
  const out = [];
  // trailing vines
  const vines = hanging ? 6 : 4;
  for (let v = 0; v < vines; v++) {
    const side = v % 2 ? 1 : -1;
    const x0 = side * (34 + r() * 10);
    const drop = (hanging ? 120 : 50) + r() * (hanging ? 80 : 50);
    const sway = side * (6 + r() * 12);
    out.push(<path key={`v${v}`} d={`M${x0} -4 C ${x0 + sway * 1.6} ${drop * 0.25}, ${x0 + sway} ${drop * 0.6}, ${x0 + sway * 0.6} ${drop}`} stroke="#5E7E3A" strokeWidth="1.6" fill="none" />);
    for (let k = 0; k < 6; k++) {
      const t = (k + 1) / 6.3;
      const lx = x0 + sway * (1.2 - t * 0.5) * Math.sin(t * 2.8);
      const ly = drop * t;
      const len = 22 - k * 1.2;
      out.push(<Leaf key={`vl${v}${k}`} x={lx} y={ly} rot={180 + side * (40 + r() * 40)} len={len} w={len * 0.48} type="heart" color={k % 2 ? G.fresh : G.mid} light={0.2} pattern={varPattern(len, len * 0.48)} />);
    }
  }
  // crown
  for (let i = 0; i < 12; i++) {
    const a = -80 + (160 * i) / 11 + (r() - 0.5) * 14;
    const [x, y] = pt(18 + r() * 34, a);
    const len = 34 + r() * 12;
    out.push(<Leaf key={`c${i}`} x={x} y={y} rot={a * 1.1} len={len} w={len * 0.5} type="heart" color={i % 2 ? G.fresh : G.mid} light={0.2} pattern={varPattern(len, len * 0.5)} />);
  }
  return out;
}

function rubber(r) {
  const out = [<path key="trunk" d="M0 0 C -3 -50, 4 -110, 0 -168" stroke="#5B4632" strokeWidth="5" fill="none" />];
  for (let k = 0; k < 12; k++) {
    const y = -36 - k * 11.5;
    const side = k % 2 ? 1 : -1;
    const a = side * (58 - k * 2.5 + r() * 10);
    out.push(<Leaf key={k} x={side} y={y} rot={a} len={50 - k * 1.3} w={18 - k * 0.4} type="ovate" color={k % 2 ? '#2A3F2A' : '#3A3329'} light={0.24} />);
  }
  out.push(<path key="sheath" d="M0 -168 q 4 -14 2 -26" stroke="#B4463F" strokeWidth="5" strokeLinecap="round" />);
  return out;
}

function monsteraLeaf(key, x, y, rot, len, w, color, mid) {
  const { full, half } = leafPaths('heart', w, len);
  const slits = [];
  [0.22, 0.38, 0.54, 0.7].forEach((t, k) => {
    [-1, 1].forEach((side) => {
      const yy = -len * t;
      slits.push(<path key={`${k}${side}`} d={`M${side * w * (0.42 + k * 0.03)} ${yy + len * 0.04} L${side * w * 1.2} ${yy - len * 0.08} L${side * w * 1.2} ${yy - len * 0.02} Z`} fill="#000" />);
      if (k === 1 || k === 2) slits.push(<ellipse key={`h${k}${side}`} cx={side * w * 0.24} cy={yy - len * 0.05} rx={w * 0.045} ry={len * 0.05} transform={`rotate(${side * -35} ${side * w * 0.24} ${yy - len * 0.05})`} fill="#000" />);
    });
  });
  return (
    <g key={key} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`}>
      <defs>
        <mask id={mid} maskUnits="userSpaceOnUse" x={-w * 1.4} y={-len * 1.1} width={w * 2.8} height={len * 1.4}>
          <path d={full} fill="#fff" />
          {slits}
        </mask>
      </defs>
      <g mask={`url(#${mid})`}>
        <path d={full} fill={color} />
        <path d={half} fill="#fff" opacity=".18" />
        <path d={`M0 0 Q ${w * 0.06} ${-len * 0.5} 0 ${-len * 0.95}`} stroke={shadeHex(color, 45)} strokeOpacity=".6" strokeWidth="1.6" fill="none" />
      </g>
    </g>
  );
}

function monstera(r) {
  const out = [];
  const base = Math.floor(r() * 1e8);
  for (let i = 0; i < 7; i++) {
    const a = -66 + (132 * i) / 6 + (r() - 0.5) * 10;
    const L = 60 + r() * 55 - Math.abs(a) * 0.2;
    const [x, y] = pt(L, a);
    out.push(<Stem key={`s${i}`} x2={x} y2={y} bend={a * 0.2} color="#58773A" width={3} />);
    out.push(monsteraLeaf(`l${i}`, x, y, a * 1.3, 70 + r() * 18, 40 + r() * 8, i % 2 ? '#2C5530' : '#376536', `mst${base}${i}`));
  }
  return out;
}

function snake(r) {
  const out = [];
  for (let i = 0; i < 9; i++) {
    const a = -22 + (44 * i) / 8 + (r() - 0.5) * 6;
    const len = 130 + r() * 70 - Math.abs(a) * 1.5;
    const w = 12 + r() * 4;
    out.push(
      <Leaf
        key={i}
        x={(i - 4) * 5}
        rot={a}
        len={len}
        w={w}
        type="sword"
        color={i % 2 ? '#2D4A2A' : '#38582F'}
        edge="#C9C566"
        light={0.12}
        vein={false}
        pattern={
          <g stroke="#7E9A62" strokeWidth="2.2" opacity=".55" fill="none">
            {Array.from({ length: 9 }).map((_, k) => (
              <path key={k} d={`M${-w * 0.8} ${-len * (0.08 + k * 0.1)} q ${w * 0.8} ${-6} ${w * 1.6} 0`} />
            ))}
          </g>
        }
      />,
    );
  }
  return out;
}

function spider(r) {
  const out = [];
  for (let i = 0; i < 26; i++) {
    const a = -82 + (164 * i) / 25 + (r() - 0.5) * 8;
    const len = 70 + r() * 40;
    const curl = Math.abs(a) > 40 ? 1 : 0.9;
    out.push(
      <g key={i} transform={`rotate(${a})`}>
        <path d={`M0 0 C ${a * 0.2} ${-len * 0.4}, ${a * 0.9} ${-len * 0.7}, ${a * 1.5 * curl} ${-len * 0.55 + Math.abs(a) * 0.6}`} stroke={i % 3 ? '#4E7F3E' : '#5C8E46'} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d={`M0 0 C ${a * 0.2} ${-len * 0.4}, ${a * 0.9} ${-len * 0.7}, ${a * 1.5 * curl} ${-len * 0.55 + Math.abs(a) * 0.6}`} stroke="#F1F3DC" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>,
    );
  }
  // plantlets
  [-1, 1].forEach((s) => {
    out.push(<path key={`r${s}`} d={`M0 -10 C ${s * 50} -60, ${s * 90} -10, ${s * 96} 50`} stroke="#9AAE70" strokeWidth="1.4" fill="none" />);
    for (let k = 0; k < 6; k++) out.push(<Leaf key={`p${s}${k}`} x={s * 96} y={50} rot={-60 + k * 24} len={20} w={3.5} type="narrow" color="#5C8E46" light={0.2} vein={false} />);
  });
  return out;
}

function frond(key, a, len, r, color = '#4D7F3F', leaflets = 16, lw = 0.36) {
  const items = [];
  const bend = Math.sign(a) * 0.45;
  const end = [Math.sin((a * Math.PI) / 180) * len, -Math.cos((a * Math.PI) / 180) * len * 0.82 + Math.abs(a) * 0.7];
  const ctrl = [end[0] * 0.35, -len * 0.9];
  const at = (t) => [2 * (1 - t) * t * ctrl[0] + t * t * end[0], 2 * (1 - t) * t * ctrl[1] + t * t * end[1]];
  items.push(<path key="rib" d={`M0 0 Q ${ctrl[0]} ${ctrl[1]} ${end[0]} ${end[1]}`} stroke="#5E7A3A" strokeWidth="1.8" fill="none" />);
  for (let k = 1; k < leaflets; k++) {
    const t = k / leaflets;
    const [x, y] = at(t);
    const [x2, y2] = at(Math.min(1, t + 0.02));
    const dir = (Math.atan2(x2 - x, -(y2 - y)) * 180) / Math.PI;
    const L = len * lw * (1 - t * 0.6);
    [-1, 1].forEach((s) => items.push(<Leaf key={`${k}${s}`} x={x} y={y} rot={dir + s * (62 + bend * 10)} len={L} w={L * 0.18} type="lance" color={k % 2 ? color : shadeHex(color, 14)} light={0.18} vein={false} />));
  }
  return <g key={key}>{items}</g>;
}

function areca(r) {
  const out = [];
  [-10, -3, 4, 11].forEach((a, i) => {
    const [x, y] = pt(80 + i * 12, a);
    out.push(<Stem key={`c${i}`} x2={x} y2={y} color="#8C9B56" width={3} />);
  });
  for (let i = 0; i < 9; i++) {
    const a = -70 + (140 * i) / 8 + (r() - 0.5) * 10;
    const base = pt(70 + r() * 40, a * 0.2);
    out.push(<g key={`f${i}`} transform={`translate(${base[0]} ${base[1]})`}>{frond('x', a, 120 + r() * 40, r, i % 2 ? '#5E8D44' : '#6E9C4A', 18, 0.42)}</g>);
  }
  return out;
}

function birdOfParadise(r) {
  const out = [];
  for (let i = 0; i < 7; i++) {
    const a = -34 + (68 * i) / 6 + (r() - 0.5) * 8;
    const L = 110 + r() * 60 - Math.abs(a) * 0.8;
    const [x, y] = pt(L, a * 0.8);
    const len = 80 + r() * 18;
    const w = 23 + r() * 4;
    out.push(<Stem key={`s${i}`} x2={x} y2={y} bend={a * 0.1} color="#5D7B42" width={3.2} />);
    out.push(
      <Leaf
        key={`l${i}`}
        x={x}
        y={y}
        rot={a * 1.3}
        len={len}
        w={w}
        type="paddle"
        color={i % 2 ? '#2F5A35' : '#3B6A3E'}
        light={0.2}
        pattern={
          <g stroke="#E6EEDD" strokeWidth="1.4" opacity=".5">
            {[0.35, 0.55, 0.72].map((t, k) => (
              <path key={k} d={`M${k % 2 ? w * 0.98 : -w * 0.98} ${-len * t} l ${k % 2 ? -w * 0.4 : w * 0.4} ${len * 0.04}`} />
            ))}
          </g>
        }
      />,
    );
  }
  return out;
}

function chineseEvergreen(r) {
  const out = [];
  for (let i = 0; i < 14; i++) {
    const a = -70 + (140 * i) / 13 + (r() - 0.5) * 10;
    const [x, y] = pt(20 + r() * 25, a * 0.6);
    const len = 62 + r() * 18;
    const w = 16 + r() * 4;
    out.push(
      <Leaf
        key={i}
        x={x}
        y={y}
        rot={a}
        len={len}
        w={w}
        type="lance"
        color="#3F6B42"
        light={0.15}
        pattern={
          <g>
            <path d={`M0 ${-len * 0.05} C ${-w * 0.6} ${-len * 0.3}, ${-w * 0.4} ${-len * 0.75}, 0 ${-len * 0.9} C ${w * 0.4} ${-len * 0.75}, ${w * 0.6} ${-len * 0.3}, 0 ${-len * 0.05} Z`} fill="#C9D7C2" opacity=".85" />
            <path d={`M0 0 L0 ${-len * 0.92}`} stroke="#D88E9A" strokeWidth="2" />
          </g>
        }
      />,
    );
  }
  return out;
}

function bostonFern(r) {
  const out = [];
  for (let i = 0; i < 14; i++) {
    const a = -84 + (168 * i) / 13 + (r() - 0.5) * 8;
    out.push(frond(`f${i}`, a * 1.05, 95 + r() * 30, r, i % 2 ? '#5E9244' : '#6EA14E', 22, 0.2));
  }
  return out;
}

function aloe(r) {
  const out = [];
  for (let i = 0; i < 13; i++) {
    const a = -72 + (144 * i) / 12 + (r() - 0.5) * 8;
    const len = 70 + r() * 30 - Math.abs(a) * 0.3;
    const w = 11 + r() * 3;
    out.push(
      <Leaf
        key={i}
        rot={a}
        len={len}
        w={w}
        type="sword"
        color={i % 2 ? '#7E9C78' : '#8DAA84'}
        light={0.18}
        vein={false}
        pattern={
          <g fill="#E8EFE2" opacity=".75">
            {Array.from({ length: 6 }).map((_, k) => (
              <ellipse key={k} cx={(k % 2 ? 1 : -1) * w * 0.3} cy={-len * (0.15 + k * 0.12)} rx="1.6" ry="0.9" />
            ))}
          </g>
        }
      />,
    );
  }
  return out;
}

function jade(r) {
  const out = [];
  const branches = [
    [-30, 70],
    [-8, 95],
    [18, 85],
    [38, 60],
  ];
  branches.forEach(([a, L], i) => {
    const [x, y] = pt(L, a);
    out.push(<path key={`b${i}`} d={`M0 0 Q ${x * 0.2} ${y * 0.6} ${x} ${y}`} stroke="#7A6A48" strokeWidth={6 - i * 0.5} fill="none" strokeLinecap="round" />);
    for (let k = 0; k < 9; k++) {
      const ang = -150 + k * 37 + r() * 10;
      const [ox, oy] = pt(10 + r() * 6, ang);
      out.push(<Leaf key={`l${i}${k}`} x={x + ox * 0.6} y={y + oy * 0.6} rot={ang} len={16 + r() * 4} w={8} type="round" color={k % 2 ? '#4E8244' : '#5F9550'} edge="#8E6A3E" light={0.3} vein={false} />);
    }
  });
  return out;
}

function stringOfPearls(r) {
  const out = [];
  for (let s = 0; s < 9; s++) {
    const x0 = -36 + s * 9 + (r() - 0.5) * 4;
    const drop = 60 + r() * 90;
    const sway = (r() - 0.5) * 24;
    out.push(<path key={`s${s}`} d={`M${x0} -2 Q ${x0 + sway} ${drop * 0.5} ${x0 + sway * 0.5} ${drop}`} stroke="#7C8F57" strokeWidth="1" fill="none" />);
    const beads = Math.floor(drop / 9);
    for (let k = 0; k < beads; k++) {
      const t = k / beads;
      const bx = x0 + sway * 2 * t * (1 - t) + sway * 0.5 * t * t;
      out.push(<circle key={`b${s}${k}`} cx={bx + (k % 2 ? 2.2 : -2.2)} cy={drop * t + 4} r="3.6" fill={k % 3 ? '#7FA96A' : '#8DB876'} />);
    }
  }
  for (let k = 0; k < 18; k++) out.push(<circle key={`top${k}`} cx={-40 + k * 4.7} cy={-4 - (k % 3) * 3} r="3.8" fill="#86B070" />);
  return out;
}

function syngonium(r) {
  const out = [];
  for (let i = 0; i < 10; i++) {
    const a = -64 + (128 * i) / 9 + (r() - 0.5) * 10;
    const [x, y] = pt(40 + r() * 40, a);
    const len = 44 + r() * 10;
    out.push(<Stem key={`s${i}`} x2={x} y2={y} bend={a * 0.2} color="#B98E8E" width={1.8} />);
    out.push(
      <Leaf
        key={`l${i}`}
        x={x}
        y={y}
        rot={a * 1.25}
        len={len}
        w={len * 0.55}
        type="arrow"
        color={i % 2 ? '#C98C8F' : '#7FA36A'}
        light={0.2}
        pattern={i % 2 ? null : <path d={`M0 ${-len * 0.1} C ${-len * 0.25} ${-len * 0.4}, ${-len * 0.1} ${-len * 0.8}, 0 ${-len * 0.85} C ${len * 0.1} ${-len * 0.8}, ${len * 0.25} ${-len * 0.4}, 0 ${-len * 0.1}`} fill="#E3C6C6" opacity=".7" />}
      />,
    );
  }
  return out;
}

function dracaena(r) {
  const out = [];
  const canes = [
    [-10, 120],
    [4, 165],
    [14, 95],
  ];
  canes.forEach(([a, L], i) => {
    const [x, y] = pt(L, a);
    out.push(<path key={`c${i}`} d={`M${i * 4 - 4} 0 Q ${x * 0.4} ${y * 0.5} ${x} ${y}`} stroke="#8B7656" strokeWidth="4.5" fill="none" strokeLinecap="round" />);
    for (let k = 0; k < 18; k++) {
      const ang = -120 + k * 13.5 + (r() - 0.5) * 8;
      out.push(<Leaf key={`l${i}${k}`} x={x} y={y} rot={ang} len={42 + r() * 14 - Math.abs(ang) * 0.06} w={2.6} type="narrow" color={k % 2 ? '#3E6B36' : '#4C7D3F'} edge="#A1424A" light={0.1} vein={false} />);
    }
  });
  return out;
}

function yucca(r) {
  const out = [];
  const canes = [
    [-12, 70],
    [-3, 120],
    [9, 95],
    [16, 55],
  ];
  canes.forEach(([a, L], i) => {
    const [x, y] = pt(L, a);
    out.push(<path key={`c${i}`} d={`M${i * 5 - 7} 0 Q ${x * 0.4} ${y * 0.5} ${x} ${y}`} stroke="#8B7656" strokeWidth="5" fill="none" strokeLinecap="round" />);
    for (let k = 0; k < 24; k++) {
      const ang = -150 + k * 12.5 + (r() - 0.5) * 8;
      const droop = Math.abs(ang) > 90 ? 0.75 : 1;
      out.push(<Leaf key={`l${i}${k}`} x={x} y={y} rot={ang} len={(62 + r() * 22 - Math.abs(ang) * 0.08) * droop} w={5.2} type="lance" color={k % 3 === 0 ? '#2F5A30' : k % 3 === 1 ? '#3F6E3B' : '#4F8044'} light={0.22} vein={false} />);
    }
  });
  return out;
}

function calathea(r) {
  const out = [];
  for (let i = 0; i < 11; i++) {
    const a = -66 + (132 * i) / 10 + (r() - 0.5) * 10;
    const [x, y] = pt(46 + r() * 40, a);
    const len = 52 + r() * 12;
    const w = 20;
    out.push(<Stem key={`s${i}`} x2={x} y2={y} bend={a * 0.2} color="#6F6A47" width={1.8} />);
    out.push(
      <Leaf
        key={`l${i}`}
        x={x}
        y={y}
        rot={a * 1.2}
        len={len}
        w={w}
        type="ovate"
        color={i % 4 === 0 ? '#6A3B57' : '#2E4F30'}
        light={0.14}
        pattern={
          i % 4 ? (
            <g fill="#A9C38A" opacity=".75">
              {[0.22, 0.42, 0.62, 0.8].map((t) => (
                <g key={t}>
                  <ellipse cx={-w * 0.42} cy={-len * t} rx={w * 0.3} ry="3" transform={`rotate(-28 ${-w * 0.42} ${-len * t})`} />
                  <ellipse cx={w * 0.42} cy={-len * t} rx={w * 0.3} ry="3" transform={`rotate(28 ${w * 0.42} ${-len * t})`} />
                </g>
              ))}
            </g>
          ) : null
        }
      />,
    );
  }
  return out;
}

function peperomia(r) {
  const out = [];
  for (let i = 0; i < 22; i++) {
    const a = -80 + (160 * i) / 21 + (r() - 0.5) * 10;
    const [x, y] = pt(12 + r() * 30, a);
    out.push(<Stem key={`s${i}`} x2={x} y2={y} color="#8A5E4F" width={1.4} />);
    out.push(<Leaf key={`l${i}`} x={x} y={y} rot={a * 1.1} len={22 + r() * 6} w={11} type="round" color={i % 2 ? '#2F5A30' : '#3E6E38'} light={0.35} />);
  }
  return out;
}

export const SPECIES = {
  philodendron: { draw: philodendron, h: 160, w: 255 },
  'peace-lily': { draw: peaceLily, h: 175, w: 190 },
  caladium: { draw: caladium, h: 135, w: 230 },
  zz: { draw: zz, h: 195, w: 160 },
  fiddle: { draw: fiddle, h: 225, w: 150 },
  anthurium: { draw: anthurium, h: 150, w: 215 },
  pothos: { draw: pothos, h: 80, w: 190, below: 110 },
  'pothos-hanging': { draw: (r) => pothos(r, { hanging: true }), h: 60, w: 180, below: 210 },
  rubber: { draw: rubber, h: 205, w: 140 },
  monstera: { draw: monstera, h: 180, w: 270 },
  snake: { draw: snake, h: 200, w: 120 },
  spider: { draw: spider, h: 115, w: 250 },
  areca: { draw: areca, h: 230, w: 230 },
  'bird-of-paradise': { draw: birdOfParadise, h: 230, w: 200 },
  'chinese-evergreen': { draw: chineseEvergreen, h: 115, w: 170 },
  'boston-fern': { draw: bostonFern, h: 120, w: 230, below: 40 },
  aloe: { draw: aloe, h: 100, w: 150 },
  jade: { draw: jade, h: 120, w: 140 },
  'string-of-pearls': { draw: stringOfPearls, h: 20, w: 110, below: 160 },
  syngonium: { draw: syngonium, h: 120, w: 170 },
  dracaena: { draw: dracaena, h: 225, w: 150 },
  calathea: { draw: calathea, h: 125, w: 180 },
  yucca: { draw: yucca, h: 215, w: 200 },
  peperomia: { draw: peperomia, h: 70, w: 120 },
  none: { draw: () => [], h: 0, w: 0 },
};

/** A complete potted plant. (x,y) = floor contact point. */
export function PottedPlant({ species, pot = 'white', potW = 92, potH = 78, potShape = 'taper', x = 0, y = 0, s = 1, uid, seed, flip = false, opacity = 1, filter }) {
  const sp = SPECIES[species] || SPECIES.none;
  const r = rngFrom(seed || species);
  const parts = sp.draw(r);
  const front = sp.below ? parts : null; // trailing plants draw in front of the pot
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} opacity={opacity} filter={filter}>
      {!front && <g transform={`translate(0 ${-potH + 2})`}>{parts}</g>}
      <Pot type={pot} w={potW} h={potH} uid={uid} shape={potShape} />
      {front && <g transform={`translate(0 ${-potH + 2})`}>{front}</g>}
    </g>
  );
}

/** Hanging planter on cords: (x,y) = ceiling attach point, drop = cord length. */
export function HangingPlant({ species = 'pothos-hanging', x, y = 0, drop = 120, s = 1, uid, seed, pot = 'cream' }) {
  const r = rngFrom(seed || species);
  const parts = (SPECIES[species] || SPECIES['pothos-hanging']).draw(r);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-34, 0, 34].map((dx, i) => (
        <path key={i} d={`M0 0 L${dx} ${drop}`} stroke="#E9E4D6" strokeOpacity=".7" strokeWidth="1.2" />
      ))}
      <g transform={`translate(0 ${drop + 50})`}>
        <Pot type={pot} w={76} h={50} uid={uid} shape="bowl" />
        <g transform="translate(0 -48)">{parts}</g>
      </g>
    </g>
  );
}
