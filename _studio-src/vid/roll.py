import sys,subprocess,math
from PIL import Image,ImageDraw,ImageFont,ImageFilter
U='/mnt/user-data/uploads/'; A='/home/claude/dental-mbti/assets/hp-studio/estar/'
LAMI=[('1e218a81-image.png','81f3fa49-image.png'),('7347e760-image.png','1778c04c-image.png'),('f2421ee0-image.png','901cdf84-image.png'),('ff3f4021-image.jpg','ec9a721b-image.jpg'),
 ('48493d5f-image.png','67328aa3-image.png'),('a76a7935-image.png','1ce80750-image.png'),('064dc086-image.png','b1a502bf-image.png'),('648a7dc3-image.png','e78f5ecc-image.png'),
 ('7fe51896-image.png','91b2d6a4-image.png'),('98b6aa03-image.png','b698c0cb-image.png')]
WHITE=[('lxW1B.webp','lxW1A.webp'),('lxW2B.webp','lxW2A.webp'),('lxW3B.webp','lxW3A.webp'),('whiteAB.webp','whiteAA.webp')]
BG=(35,27,23); GOLD=(201,168,118); FONT='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
def cover(im,w,h):
    im=im.convert('RGB'); r=max(w/im.width,h/im.height); im=im.resize((max(w,round(im.width*r)),max(h,round(im.height*r))),Image.LANCZOS)
    x=(im.width-w)//2; y=(im.height-h)//2; return im.crop((x,y,x+w,y+h))
def rounded(im,rad):
    m=Image.new('L',im.size,0); ImageDraw.Draw(m).rounded_rectangle((0,0,im.width-1,im.height-1),rad,fill=255); return m
def chip(d,xy,txt,fill,fg):
    f=ImageFont.truetype(FONT,22); x,y=xy; tw=d.textlength(txt,font=f); d.rounded_rectangle((x,y,x+tw+28,y+38),19,fill=fill); d.text((x+14,y+5),txt,font=f,fill=fg)
def case_card(b,a,W,H,layout):
    c=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(c)
    if layout=='wide': pw,ph=588,400; pos=[(24,24),(W-24-pw,24)]
    else: pw,ph=672,448; pos=[(24,24),(24,24+ph+32)]
    for (img,lab,fill,fg),(x,y) in zip([(b,'BEFORE',(20,16,14),(240,232,220)),(a,'AFTER',GOLD,(35,27,23))],pos):
        p=cover(img,pw,ph); c.paste(p,(x,y),rounded(p,22)); chip(d,(x+16,y+16),lab,fill,fg)
    if layout=='wide':
        cx=W//2; d.polygon([(cx-9,H//2-14),(cx+7,H//2),(cx-9,H//2+14)],fill=GOLD)
    else:
        cy=24+ph+16; d.polygon([(W//2-14,cy-8),(W//2+14,cy-8),(W//2,cy+8)],fill=GOLD)
    return c
def build(cases,src,layout,out,hold=2.6,move=0.7,fps=30):
    W,H=(1248,448) if layout=='wide' else (720,1000)
    cards=[case_card(Image.open(src+b),Image.open(src+a),W,H,layout) for b,a in cases]
    n=len(cards); total=int(n*(hold+move)*fps)
    p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(fps),'-i','-','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',out],stdin=subprocess.PIPE)
    seg=(hold+move)*fps
    for f in range(total):
        i=int(f//seg); t=(f-i*seg)/fps
        if t<hold: fr=cards[i]
        else:
            k=(t-hold)/move; e=k*k*(3-2*k); nxt=cards[(i+1)%n]; fr=Image.new('RGB',(W,H),BG)
            if layout=='wide': off=int(e*W); fr.paste(cards[i],(-off,0)); fr.paste(nxt,(W-off,0))
            else: off=int(e*W); fr.paste(cards[i],(-off,0)); fr.paste(nxt,(W-off,0))
        p.stdin.write(fr.tobytes())
    p.stdin.close(); p.wait()
    cards[0].save(out.replace('.mp4','_poster.webp'),'WEBP',quality=82)
    return n
D=A
print(build(LAMI,U,'wide',D+'rollLamiW.mp4'),build(WHITE,A,'wide',D+'rollWhiteW.mp4'))
