from PIL import Image, ImageDraw, ImageFont

REG = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
BOLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"

def F(path, size):
    return ImageFont.truetype(path, size)

sat_stops = [
    {"t":"10:00","name":"노팅힐북샵","note":"영화 노팅힐 실제 서점, 포토벨로 로드"},
    {"t":"10:50","name":"패딩턴 베어샵","note":"패딩턴역 The Lawn · 기념품"},
    {"t":"11:30","name":"리버티 백화점 4층","note":"Oxford Circus 도보 2분"},
    {"t":"11:45","name":"Hamleys","note":"젤리캣 매대 있음"},
    {"t":"12:05","name":"디즈니 스토어","note":"Oxford St"},
    {"t":"13:00","name":"소호 점심/디저트","note":"B Bagel · Maison Bertaux · Italian Bear 중 택1-2"},
    {"t":"14:45","name":"로얄발레&오페라 샵","note":"에코백 여기!"},
    {"t":"15:15","name":"Neal's Yard","note":"포토스팟"},
    {"t":"저녁","name":"Flat Iron / 버거앤랍스터","note":"저녁 옵션 (소호·코벤트가든)"},
]

sun_stops = [
    {"t":"09:30","name":"캠든락마켓","note":"컬러풀 마켓 + 운하"},
    {"t":"11:00","name":"빅벤 · 국회의사당","note":"Northern선 Embankment 하차"},
    {"t":"11:40","name":"버킹엄궁전","note":"세인트제임스파크 경유 도보"},
    {"t":"12:20","name":"웨스트민스터대성당","note":"Victoria역 인근"},
    {"t":"13:00","name":"런던아이","note":"강 건너 사진"},
    {"t":"13:50","name":"내셔널갤러리 · 트라팔가광장","note":"루트 마무리"},
]

W = 1080
PAD_X = 64
ROW_TOP = 300
ROW_H = 158
FOOTER_H = 90

def render(stops, color_hex, day_label, title, subtitle, outpath):
    color = tuple(int(color_hex[i:i+2], 16) for i in (1, 3, 5))
    H = ROW_TOP + ROW_H * len(stops) + FOOTER_H
    img = Image.new("RGB", (W, H), "#f7f7f5")
    d = ImageDraw.Draw(img)

    f_day   = F(BOLD, 30)
    f_title = F(BOLD, 44)
    f_sub   = F(REG, 24)
    f_time  = F(BOLD, 24)
    f_name  = F(BOLD, 32)
    f_note  = F(REG, 23)
    f_num   = F(BOLD, 26)
    f_foot  = F(REG, 20)

    # header band
    d.rectangle([0, 0, W, 210], fill=color)
    d.text((PAD_X, 40), day_label, font=f_day, fill="#ffffff")
    d.text((PAD_X, 84), title, font=f_title, fill="#ffffff")
    d.text((PAD_X, 150), subtitle, font=f_sub, fill="#ffffff")

    # timeline
    line_x = PAD_X + 26
    top_y = ROW_TOP + ROW_H * 0.5
    bot_y = ROW_TOP + ROW_H * (len(stops) - 1) + ROW_H * 0.5
    d.line([(line_x, top_y), (line_x, bot_y)], fill=color, width=4)

    for i, s in enumerate(stops):
        cy = ROW_TOP + ROW_H * i + ROW_H * 0.5
        r = 27
        d.ellipse([line_x - r, cy - r, line_x + r, cy + r], fill=color, outline="#ffffff", width=4)
        num = str(i + 1)
        bbox = d.textbbox((0, 0), num, font=f_num)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        d.text((line_x - tw / 2 - bbox[0], cy - th / 2 - bbox[1]), num, font=f_num, fill="#ffffff")

        tx = line_x + 60
        d.text((tx, cy - 46), s["t"], font=f_time, fill=color_hex)
        d.text((tx, cy - 14), s["name"], font=f_name, fill="#1f2430")
        d.text((tx, cy + 26), s["note"], font=f_note, fill="#8a8f98")

        if i < len(stops) - 1:
            sep_y = ROW_TOP + ROW_H * (i + 1)
            d.line([(tx, sep_y), (W - PAD_X, sep_y)], fill="#e6e6e2", width=2)

    d.text((PAD_X, H - FOOTER_H + 26), "런던 계획 · 순서대로 진행 · 자세한 길찾기는 지도 파일 참고",
            font=f_foot, fill="#9aa0aa")

    img.save(outpath, optimize=True)
    print("saved", outpath, img.size)

render(sat_stops, "#2563eb", "SATURDAY", "쇼핑 위주", "노팅힐 → 패딩턴 → 리젠트/옥스퍼드St → 소호 → 코벤트가든",
       "/tmp/london_sat.png")
render(sun_stops, "#e11d48", "SUNDAY", "사진 위주", "캠든 → 웨스트민스터 → 사우스뱅크 → 트라팔가광장",
       "/tmp/london_sun.png")
