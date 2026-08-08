#!/usr/bin/env python3
"""むくくん 1歳記念スライドショー動画ジェネレーター

使い方:
    python3 generate.py            # スライド画像 + BGM + MP4 を一括生成
    python3 generate.py --slides   # スライド画像だけ生成（デザイン確認用）

必要なもの: Python3 / Pillow / numpy / ffmpeg
写真は photos/ に「00.jpg 〜 12.jpg」（月齢の数字はじまり）の名前で置くと
自動で取り込まれます。無い月はかわいいプレースホルダーになります。
"""

import json
import math
import os
import random
import subprocess
import sys
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

try:  # iPhoneのHEIC写真対応（入っていなければjpg/pngのみ）
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

BASE = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(BASE, "assets", "fonts")
PHOTO_DIR = os.path.join(BASE, "photos")
OUT_DIR = os.path.join(BASE, "output")
SLIDE_DIR = os.path.join(OUT_DIR, "slides")

# ---------- パレット ----------
CREAM = (255, 246, 234)
PINK = (247, 178, 194)
PINK_SOFT = (252, 214, 222)
BLUE = (168, 214, 235)
BLUE_SOFT = (208, 233, 245)
YELLOW = (255, 216, 138)
YELLOW_SOFT = (255, 236, 190)
GREEN_SOFT = (205, 232, 197)
BROWN = (107, 79, 58)
BROWN_SOFT = (152, 122, 98)
WHITE = (255, 255, 255)

W, H = 1920, 1080


def font(weight, size):
    path = os.path.join(FONT_DIR, f"ZenMaruGothic-{weight}.ttf")
    if not os.path.exists(path):
        path = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
    return ImageFont.truetype(path, size)


def text_center(draw, cx, y, text, fnt, fill, anchor="ma"):
    draw.text((cx, y), text, font=fnt, fill=fill, anchor=anchor)


def rounded_shadow_card(img, box, radius=40, fill=WHITE, shadow_offset=10, shadow_alpha=60):
    """ふんわり影つきの角丸カードを描く"""
    x0, y0, x1, y1 = box
    shadow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle(
        (x0 + shadow_offset, y0 + shadow_offset, x1 + shadow_offset, y1 + shadow_offset),
        radius=radius, fill=(120, 90, 70, shadow_alpha))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    img.alpha_composite(shadow)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(box, radius=radius, fill=fill)


def draw_star(d, cx, cy, r, fill):
    pts = []
    for i in range(10):
        ang = math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.45
        pts.append((cx + rr * math.cos(ang), cy - rr * math.sin(ang)))
    d.polygon(pts, fill=fill)


def draw_heart(d, cx, cy, r, fill):
    d.ellipse((cx - r, cy - r, cx, cy), fill=fill)
    d.ellipse((cx, cy - r, cx + r, cy), fill=fill)
    d.polygon([(cx - r, cy - r * 0.35), (cx + r, cy - r * 0.35), (cx, cy + r)], fill=fill)


def draw_footprint(d, cx, cy, scale, fill):
    s = scale
    d.ellipse((cx - 22 * s, cy - 30 * s, cx + 22 * s, cy + 34 * s), fill=fill)
    for i, (dx, rr) in enumerate([(-16, 7), (-6, 8), (5, 8), (15, 7)]):
        d.ellipse((cx + dx * s - rr * s, cy - 52 * s - rr * s,
                   cx + dx * s + rr * s, cy - 52 * s + rr * s), fill=fill)


def base_canvas(seed=0, deco=True):
    """クリーム色ベース + パステルの水玉・星・ハートを散らした背景"""
    img = Image.new("RGBA", (W, H), CREAM + (255,))
    d = ImageDraw.Draw(img)
    if not deco:
        return img, d
    rng = random.Random(seed)
    colors = [PINK_SOFT, BLUE_SOFT, YELLOW_SOFT, GREEN_SOFT]
    for _ in range(26):
        x, y = rng.randint(0, W), rng.randint(0, H)
        c = rng.choice(colors)
        kind = rng.random()
        if kind < 0.5:
            r = rng.randint(8, 26)
            d.ellipse((x - r, y - r, x + r, y + r), fill=c)
        elif kind < 0.8:
            draw_star(d, x, y, rng.randint(14, 26), c)
        else:
            draw_heart(d, x, y, rng.randint(10, 18), c)
    return img, d


def draw_bunting(img, d):
    """上部の三角フラッグガーランド"""
    colors = [PINK, BLUE, YELLOW, GREEN_SOFT, PINK_SOFT]
    n = 12
    for i in range(n):
        x0 = i * W / n
        x1 = (i + 1) * W / n
        sag = 26 * math.sin(math.pi * (i + 0.5) / n)
        top = 8 + sag
        d.polygon([(x0, top), (x1, top), ((x0 + x1) / 2, top + 78)],
                  fill=colors[i % len(colors)])
    d.line([(0, 10), (W, 10)], fill=BROWN_SOFT, width=4)


def draw_baby_face(d, cx, cy, r):
    """シンプルな赤ちゃんの顔ドゥードル"""
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 228, 208), outline=BROWN, width=6)
    # 前髪
    d.arc((cx - r * 0.35, cy - r * 1.25, cx + r * 0.35, cy - r * 0.55), 200, 340, fill=BROWN, width=8)
    # 目
    for sx in (-1, 1):
        ex = cx + sx * r * 0.38
        d.arc((ex - r * 0.16, cy - r * 0.18, ex + r * 0.16, cy + r * 0.14), 20, 160, fill=BROWN, width=8)
    # ほっぺ
    for sx in (-1, 1):
        px = cx + sx * r * 0.55
        d.ellipse((px - r * 0.16, cy + r * 0.12, px + r * 0.16, cy + r * 0.38), fill=PINK_SOFT)
    # 口
    d.arc((cx - r * 0.14, cy + r * 0.18, cx + r * 0.14, cy + r * 0.42), 20, 160, fill=BROWN, width=7)


def find_photo(month):
    if not os.path.isdir(PHOTO_DIR):
        return None
    exts = (".jpg", ".jpeg", ".png", ".heic", ".webp")
    cands = sorted(
        f for f in os.listdir(PHOTO_DIR)
        if f.lower().endswith(exts) and f.startswith(f"{month:02d}"))
    return os.path.join(PHOTO_DIR, cands[0]) if cands else None


def paste_photo_cover(img, path, box, radius=28):
    """写真をトリミングして角丸で貼る"""
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    photo = Image.open(path)
    photo = ImageOps.exif_transpose(photo).convert("RGB")
    photo = ImageOps.fit(photo, (bw, bh), Image.LANCZOS)
    mask = Image.new("L", (bw, bh), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, bw, bh), radius=radius, fill=255)
    img.paste(photo, (x0, y0), mask)


# ---------- 各スライド ----------

def slide_title(cfg):
    img, d = base_canvas(seed=1)
    draw_bunting(img, d)
    t = cfg["title"]
    text_center(d, W / 2, 190, t["line1"], font("Black", 150), BROWN)
    text_center(d, W / 2, 400, t["line2"], font("Bold", 96), PINK)
    # 顔とケーキ
    draw_baby_face(d, W / 2 - 260, 690, 120)
    cake_x, cake_y = W / 2 + 240, 700
    d.rounded_rectangle((cake_x - 130, cake_y - 20, cake_x + 130, cake_y + 110), 24, fill=PINK_SOFT)
    d.rounded_rectangle((cake_x - 100, cake_y - 90, cake_x + 100, cake_y - 10), 20, fill=WHITE)
    d.rectangle((cake_x - 8, cake_y - 150, cake_x + 8, cake_y - 90), fill=YELLOW)
    d.ellipse((cake_x - 14, cake_y - 184, cake_x + 14, cake_y - 146), fill=(255, 160, 80))
    for i in range(5):
        d.ellipse((cake_x - 90 + i * 45 - 9, cake_y - 26, cake_x - 90 + i * 45 + 9, cake_y - 8), fill=PINK)
    text_center(d, W / 2, 900, t["line3"], font("Medium", 60), BROWN_SOFT)
    return img


def slide_month(cfg, entry):
    m = entry["month"]
    img, d = base_canvas(seed=100 + m)
    # 月齢バッジ
    badge = f"{m}か月" if m < 12 else "1さい"
    d.ellipse((90, 70, 400, 380), fill=[PINK_SOFT, BLUE_SOFT, YELLOW_SOFT, GREEN_SOFT][m % 4])
    text_center(d, 245, 165, "生後" if m < 12 else "ついに", font("Medium", 52), BROWN_SOFT)
    text_center(d, 245, 215, badge, font("Black", 96), BROWN)
    # 写真フレーム（ポラロイド風）
    fx0, fy0, fx1, fy1 = 560, 90, 1620, 890
    rounded_shadow_card(img, (fx0, fy0, fx1, fy1), radius=36)
    inner = (fx0 + 36, fy0 + 36, fx1 - 36, fy1 - 110)
    photo = find_photo(m)
    if photo:
        paste_photo_cover(img, photo, inner)
    else:
        d.rounded_rectangle(inner, radius=28, fill=(247, 238, 226))
        draw_baby_face(d, (inner[0] + inner[2]) / 2, (inner[1] + inner[3]) / 2 - 40, 130)
        text_center(d, (inner[0] + inner[2]) / 2, (inner[3] - 130),
                    "ここに むくくんの写真", font("Medium", 44), BROWN_SOFT)
    d = ImageDraw.Draw(img)
    draw_footprint(d, 250, 620, 1.2, PINK_SOFT)
    draw_footprint(d, 360, 780, 1.0, BLUE_SOFT)
    text_center(d, W / 2, 950, entry["caption"], font("Bold", 68), BROWN)
    return img


def slide_stats(cfg):
    img, d = base_canvas(seed=200)
    draw_bunting(img, d)
    s = cfg["stats"]
    text_center(d, W / 2, 130, s["heading"], font("Black", 84), BROWN)
    cards = s["cards"]
    cw, ch, gap = 820, 300, 60
    x_start = (W - 2 * cw - gap) / 2
    y_start = 300
    for i, card in enumerate(cards[:4]):
        cx0 = x_start + (i % 2) * (cw + gap)
        cy0 = y_start + (i // 2) * (ch + gap)
        rounded_shadow_card(img, (cx0, cy0, cx0 + cw, cy0 + ch), radius=36)
        d = ImageDraw.Draw(img)
        icon_cx, icon_cy = cx0 + 150, cy0 + ch / 2
        draw_stat_icon(d, card.get("icon", ""), icon_cx, icon_cy)
        text_center(d, cx0 + 150 + (cw - 150) / 2, cy0 + 62, card["label"], font("Medium", 52), BROWN_SOFT)
        text_center(d, cx0 + 150 + (cw - 150) / 2, cy0 + 132, card["value"], font("Black", 84), PINK if i % 2 == 0 else (120, 170, 200))
    return img


def draw_stat_icon(d, kind, cx, cy):
    if kind == "milk":
        d.rounded_rectangle((cx - 45, cy - 40, cx + 45, cy + 75), 22, fill=BLUE_SOFT, outline=BROWN, width=5)
        d.rounded_rectangle((cx - 28, cy - 68, cx + 28, cy - 40), 10, fill=YELLOW_SOFT, outline=BROWN, width=5)
        d.ellipse((cx - 14, cy - 92, cx + 14, cy - 62), fill=PINK_SOFT, outline=BROWN, width=5)
        for yy in (0, 26, 52):
            d.line((cx + 20, cy - 20 + yy, cx + 38, cy - 20 + yy), fill=BROWN, width=4)
    elif kind == "diaper":
        d.polygon([(cx - 60, cy - 35), (cx + 60, cy - 35), (cx + 40, cy + 45), (cx, cy + 70), (cx - 40, cy + 45)],
                  fill=WHITE, outline=BROWN, width=5)
        d.line([(cx - 60, cy - 12), (cx + 60, cy - 12)], fill=PINK_SOFT, width=8)
        draw_heart(d, cx, cy + 22, 14, PINK)
    elif kind == "sleep":
        d.ellipse((cx - 55, cy - 55, cx + 55, cy + 55), fill=YELLOW_SOFT, outline=BROWN, width=5)
        d.ellipse((cx - 30, cy - 62, cx + 62, cy + 30), fill=CREAM)
        draw_star(d, cx + 40, cy - 40, 16, YELLOW)
        draw_star(d, cx + 62, cy - 5, 10, YELLOW)
    elif kind == "laundry":
        d.polygon([(cx - 30, cy - 55), (cx + 30, cy - 55), (cx + 62, cy - 25), (cx + 40, cy - 2),
                   (cx + 28, cy - 14), (cx + 28, cy + 60), (cx - 28, cy + 60), (cx - 28, cy - 14),
                   (cx - 40, cy - 2), (cx - 62, cy - 25)],
                  fill=BLUE_SOFT, outline=BROWN, width=5)
        draw_heart(d, cx, cy + 18, 13, WHITE)
    else:
        draw_star(d, cx, cy, 45, YELLOW)


def slide_chart(cfg):
    img, d = base_canvas(seed=300, deco=False)
    s = cfg["stats"]["chart"]
    text_center(d, W / 2, 90, s["title"], font("Black", 80), BROWN)
    vals = s["monthly_values"]
    # グラフ領域
    gx0, gy0, gx1, gy1 = 200, 260, 1760, 840
    rounded_shadow_card(img, (gx0 - 60, gy0 - 60, gx1 + 60, gy1 + 100), radius=40)
    d = ImageDraw.Draw(img)
    vmax = max(vals) * 1.15
    n = len(vals)
    bw = (gx1 - gx0) / n * 0.62
    for i, v in enumerate(vals):
        cx = gx0 + (i + 0.5) * (gx1 - gx0) / n
        bh = (gy1 - gy0) * v / vmax
        col = PINK if v == max(vals) else PINK_SOFT
        d.rounded_rectangle((cx - bw / 2, gy1 - bh, cx + bw / 2, gy1), radius=int(bw / 2.4), fill=col)
        text_center(d, cx, gy1 - bh - 52, str(v), font("Bold", 40), BROWN)
        text_center(d, cx, gy1 + 16, f"{i}", font("Medium", 38), BROWN_SOFT)
    text_center(d, W / 2, gy1 + 62, "（月齢）", font("Medium", 34), BROWN_SOFT)
    text_center(d, W / 2, 975, s["subtitle"], font("Bold", 58), BROWN)
    return img


def slide_hug(cfg):
    img, d = base_canvas(seed=400)
    s = cfg["stats"]
    draw_heart(d, W / 2, 330, 150, PINK)
    draw_heart(d, W / 2 - 300, 260, 60, PINK_SOFT)
    draw_heart(d, W / 2 + 310, 420, 45, BLUE_SOFT)
    text_center(d, W / 2, 620, s["hug_line1"], font("Bold", 84), BROWN)
    text_center(d, W / 2, 760, s["hug_line2"], font("Black", 110), PINK)
    return img


def slide_message(cfg, lines, first):
    img, d = base_canvas(seed=500 + (0 if first else 1), deco=False)
    # 便箋風カード
    rounded_shadow_card(img, (260, 110, 1660, 970), radius=48)
    d = ImageDraw.Draw(img)
    for yy in range(340, 900, 130):
        d.line((380, yy, 1540, yy), fill=(240, 226, 210), width=3)
    if first:
        text_center(d, W / 2, 170, cfg["message"]["to"], font("Black", 76), PINK)
    y = 300
    for line in lines:
        text_center(d, W / 2, y, line, font("Bold", 64), BROWN)
        y += 130
    if not first:
        d.text((1500, 860), cfg["message"]["from"], font=font("Medium", 52), fill=BROWN_SOFT, anchor="ra")
    draw_heart(d, 360, 200, 34, PINK_SOFT)
    draw_heart(d, 1560, 900 if first else 190, 30, BLUE_SOFT)
    return img


def slide_ending(cfg):
    img, d = base_canvas(seed=600)
    draw_bunting(img, d)
    e = cfg["ending"]
    text_center(d, W / 2, 250, e["line1"], font("Black", 130), BROWN)
    text_center(d, W / 2, 470, e["line2"], font("Bold", 88), PINK)
    draw_footprint(d, W / 2 - 120, 760, 1.6, PINK_SOFT)
    draw_footprint(d, W / 2 + 120, 790, 1.6, BLUE_SOFT)
    text_center(d, W / 2, 930, e["line3"], font("Medium", 62), BROWN_SOFT)
    return img


# ---------- BGM（オルゴール風・オリジナル曲） ----------

SR = 44100

NOTE_FREQ = {}
_names = ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"]
for octv in range(2, 7):
    for i, nm in enumerate(_names):
        NOTE_FREQ[f"{nm}{octv}"] = 440.0 * 2 ** ((octv - 4) + (i - 9) / 12)

# やさしい8小節のオリジナル子守唄（4/4・C major）
MELODY = [
    ("E4", 1), ("G4", 1), ("A4", 1), ("G4", 1),
    ("E4", 1), ("G4", 1), ("C5", 2),
    ("A4", 1), ("C5", 1), ("D5", 1), ("C5", 1),
    ("G4", 2), ("E4", 2),
    ("F4", 1), ("A4", 1), ("G4", 1), ("E4", 1),
    ("D4", 1), ("E4", 1), ("G4", 2),
    ("E4", 1), ("G4", 1), ("D4", 1), ("E4", 1),
    ("C4", 4),
]
CHORDS = [
    ["C3", "G3", "E4"], ["C3", "G3", "E4"],
    ["A2", "E3", "C4"], ["A2", "E3", "C4"],
    ["F2", "C3", "A3"], ["G2", "D3", "B3"],
    ["G2", "D3", "B3"], ["C3", "G3", "E4"],
]


def music_box_note(freq, dur, vol=1.0):
    n = int(SR * dur)
    t = np.arange(n) / SR
    env = np.exp(-t / 0.55) * np.minimum(t / 0.004, 1.0)
    wavef = (np.sin(2 * np.pi * freq * t)
             + 0.32 * np.sin(2 * np.pi * freq * 2 * t)
             + 0.12 * np.sin(2 * np.pi * freq * 4.06 * t))
    return (wavef * env * vol).astype(np.float32)


def make_bgm(total_sec, path):
    bpm = 84
    beat = 60.0 / bpm
    loop_beats = sum(b for _, b in MELODY)
    loop_sec = loop_beats * beat
    n_total = int(SR * (total_sec + 2))
    audio = np.zeros(n_total, dtype=np.float32)

    def add(start_sec, samples):
        s = int(start_sec * SR)
        e = min(s + len(samples), n_total)
        if s < n_total:
            audio[s:e] += samples[: e - s]

    t0 = 0.0
    while t0 < total_sec:
        # メロディ
        t = t0
        for note, beats in MELODY:
            add(t, music_box_note(NOTE_FREQ[note], min(beats * beat * 1.8, 3.0), 0.55))
            t += beats * beat
        # 伴奏（分散和音）
        for bar, chord in enumerate(CHORDS):
            bar_t = t0 + bar * 4 * beat
            pattern = [chord[0], chord[1], chord[2], chord[1],
                       chord[0], chord[1], chord[2], chord[1]]
            for k, nm in enumerate(pattern):
                add(bar_t + k * beat / 2, music_box_note(NOTE_FREQ[nm], 1.2, 0.20))
        t0 += loop_sec

    # シンプルなディレイで残響感
    delay = int(0.23 * SR)
    audio[delay:] += 0.22 * audio[:-delay].copy()
    # フェード
    fade_in = int(1.2 * SR)
    audio[:fade_in] *= np.linspace(0, 1, fade_in)
    end = int(total_sec * SR)
    audio = audio[:end]
    fade_out = int(min(4.0, total_sec / 4) * SR)
    audio[-fade_out:] *= np.linspace(1, 0, fade_out)
    audio = audio / (np.max(np.abs(audio)) + 1e-9) * 0.82

    pcm = (audio * 32767).astype(np.int16)
    with wave.open(path, "wb") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(pcm.tobytes())


# ---------- 動画組み立て ----------

def build_video(cfg, slides, durations):
    v = cfg["video"]
    fps = v["fps"]
    xf = v["crossfade_sec"]
    total = sum(durations) - xf * (len(durations) - 1)
    bgm_path = os.path.join(OUT_DIR, "bgm.wav")
    print(f"BGMを生成中… (長さ {total:.1f}秒)")
    make_bgm(total, bgm_path)

    inputs = []
    for path, dur in zip(slides, durations):
        inputs += ["-loop", "1", "-t", f"{dur + xf:.3f}", "-i", path]
    inputs += ["-i", bgm_path]

    filters = []
    pans = ["center", "lr", "center", "rl"]
    for i, dur in enumerate(durations):
        frames = int((durations[i] + xf) * fps)
        pan = pans[i % 4]
        if pan == "lr":
            x = f"(iw-iw/zoom)*on/{frames}"
            y = "(ih-ih/zoom)/2"
        elif pan == "rl":
            x = f"(iw-iw/zoom)*(1-on/{frames})"
            y = "(ih-ih/zoom)/2"
        else:
            x = "(iw-iw/zoom)/2"
            y = "(ih-ih/zoom)/2"
        filters.append(
            f"[{i}:v]scale=3840:2160:flags=lanczos,"
            f"zoompan=z='1+0.07*on/{frames}':x='{x}':y='{y}'"
            f":d={frames}:s={W}x{H}:fps={fps},format=yuv420p[v{i}]")

    # xfadeチェーン
    cur = "v0"
    offset = 0.0
    for i in range(1, len(slides)):
        offset += durations[i - 1] - xf
        out = f"x{i}" if i < len(slides) - 1 else "vout"
        filters.append(
            f"[{cur}][v{i}]xfade=transition=fade:duration={xf}:offset={offset + xf:.3f}[{out}]")
        cur = out

    out_path = os.path.join(OUT_DIR, "muku_1st_birthday.mp4")
    cmd = (["ffmpeg", "-y"] + inputs + [
        "-filter_complex", ";".join(filters),
        "-map", "[vout]", "-map", f"{len(slides)}:a",
        "-c:v", "libx264", "-preset", "medium", "-crf", "21",
        "-c:a", "aac", "-b:a", "192k",
        "-t", f"{total:.3f}", "-movflags", "+faststart", out_path])
    print("ffmpegで動画を組み立て中…（数分かかります）")
    subprocess.run(cmd, check=True, capture_output=True)
    return out_path


def main():
    slides_only = "--slides" in sys.argv
    with open(os.path.join(BASE, "config.json"), encoding="utf-8") as f:
        cfg = json.load(f)
    os.makedirs(SLIDE_DIR, exist_ok=True)

    v = cfg["video"]
    slides, durations = [], []

    def emit(name, img, dur):
        path = os.path.join(SLIDE_DIR, f"{len(slides):02d}_{name}.png")
        img.convert("RGB").save(path)
        slides.append(path)
        durations.append(dur)
        print(f"  スライド生成: {os.path.basename(path)}")

    emit("title", slide_title(cfg), v["title_sec"])
    for entry in cfg["months"]:
        emit(f"month{entry['month']:02d}", slide_month(cfg, entry), v["month_sec"])
    emit("stats", slide_stats(cfg), v["stats_sec"])
    emit("chart", slide_chart(cfg), v["chart_sec"])
    emit("hug", slide_hug(cfg), v["hug_sec"])
    for i, lines in enumerate(cfg["message"]["slides"]):
        emit(f"message{i}", slide_message(cfg, lines, i == 0), v["message_sec"])
    emit("ending", slide_ending(cfg), v["ending_sec"])

    if slides_only:
        print(f"スライド画像を {SLIDE_DIR} に出力しました")
        return

    out = build_video(cfg, slides, durations)
    print(f"完成: {out}")


if __name__ == "__main__":
    main()
