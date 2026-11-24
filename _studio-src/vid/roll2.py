import subprocess,math
from PIL import Image,ImageDraw,ImageFont,ImageEnhance,ImageFilter,ImageChops
exec(open('roll.py').read().split('def build(')[0])   # 케이스 목록·공통 함수 재사용
def tone(im):
    # 치료 전·후에 똑같이 적용하는 밝기·색감 보정 (값 동일)
    im=im.convert('RGB'); im=ImageEnhance.Brightness(im).enhance(1.08); im=ImageEnhance.Contrast(im).enhance(1.06)
    im=ImageEnhance.Color(im).enhance(1.04); im=ImageEnhance.Sharpness(im).enhance(1.15); return im
def ease(k): k=max(0,min(1,k)); return k*k*(3-2*k)
FONTB=ImageFont.truetype(FONT,22)
def chip2(d,xy,txt,fill,fg,scale=1.0):
    f=ImageFont.truetype(FONT,int(22*scale)); x,y=xy; tw=d.textlength(txt,font=f); h=int(38*scale)
    d.rounded_rectangle((x,y,x+tw+28*scale,y+h),h//2,fill=fill); d.text((x+14*scale,y+5*scale),txt,font=f,fill=fg)
def layout(W,H,lay):
    if lay=='wide': pw,ph=588,400; return pw,ph,[(24,24),(W-24-pw,24)]
    pw,ph=672,448; return pw,ph,[(24,24),(24,24+ph+32)]
def make_case(b,a,W,H,lay):
    pw,ph,pos=layout(W,H,lay)
    B=cover(tone(b),pw,ph); Abig=cover(tone(a),int(pw*1.08),int(ph*1.08))  # 확대용 여유
    base=Image.new('RGB',(W,H),BG); base.paste(B,pos[0],rounded(B,22)); d=ImageDraw.Draw(base); chip2(d,(pos[0][0]+16,pos[0][1]+16),'BEFORE',(20,16,14),(240,232,220))
    if lay=='wide': cx=W//2; d.polygon([(cx-9,H//2-14),(cx+7,H//2),(cx-9,H//2+14)],fill=GOLD)
    else: cy=24+ph+16; d.polygon([(W//2-14,cy-8),(W//2+14,cy-8),(W//2,cy+8)],fill=GOLD)
    return dict(base=base,A=Abig,pw=pw,ph=ph,pos=pos[1])
def frame_case(c,t,hold):
    fr=c['base'].copy(); pw,ph=c['pw'],c['ph']; x,y=c['pos']
    z=1.0+0.08*ease(t/hold)                                   # 시술 후만 천천히 줌인
    A=c['A']; w,h=int(pw*z),int(ph*z); Az=A.resize((w,h),Image.BILINEAR) if (w,h)!=A.size else A
    ox=(w-pw)//2; oy=(h-ph)//2; P=Az.crop((ox,oy,ox+pw,oy+ph))
    k=(t-0.45)/0.85                                           # 빛 한 줄기 지나가기
    if 0<=k<=1:
        L=Image.new('L',(pw,ph),0); ld=ImageDraw.Draw(L); cx=int(-pw*0.4+k*pw*1.8); bw=int(pw*0.22)
        for i in range(bw):
            a=int(70*math.sin(math.pi*i/bw)); ld.line([(cx+i-ph*0.5,0),(cx+i,ph)],fill=a,width=2)
        L=L.filter(ImageFilter.GaussianBlur(6)); P=Image.composite(Image.new('RGB',(pw,ph),(255,252,240)),P,L)
    g=ease((t-0.3)/0.7)                                       # 금색 테두리 빛
    if g>0:
        glow=Image.new('RGBA',fr.size,(0,0,0,0)); gd=ImageDraw.Draw(glow)
        gd.rounded_rectangle((x-6,y-6,x+pw+5,y+ph+5),28,outline=GOLD+(int(220*g),),width=5); glow=glow.filter(ImageFilter.GaussianBlur(5*g+0.1))
        fr.paste(glow,(0,0),glow)
    fr.paste(P,(x,y),rounded(P,22)); d=ImageDraw.Draw(fr)
    s=1.0+0.18*ease((t-0.3)/0.5)-0.08*ease((t-0.8)/0.4)       # AFTER 표시 강조
    chip2(d,(x+16,y+16),'AFTER',GOLD,(35,27,23),s)
    return fr
def build2(cases,src,lay,out,hold=3.0,move=0.7,fps=30):
    W,H=(1248,448) if lay=='wide' else (720,1000)
    cs=[make_case(Image.open(src+b),Image.open(src+a),W,H,lay) for b,a in cases]; n=len(cs); seg=hold+move
    p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(fps),'-i','-','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',out],stdin=subprocess.PIPE)
    for f in range(int(n*seg*fps)):
        tt=f/fps; i=int(tt//seg); t=tt-i*seg
        if t<hold: fr=frame_case(cs[i],t,hold)
        else:
            e=ease((t-hold)/move); a=frame_case(cs[i],hold,hold); b=frame_case(cs[(i+1)%n],0,hold); off=int(e*W)
            fr=Image.new('RGB',(W,H),BG); fr.paste(a,(-off,0)); fr.paste(b,(W-off,0))
        p.stdin.write(fr.tobytes())
    p.stdin.close(); p.wait(); frame_case(cs[0],2.2,hold).save(out.replace('.mp4','_poster.webp'),'WEBP',quality=84); return n
import sys
D='/home/claude/dental-mbti/assets/hp-studio/estar/'; job=sys.argv[1]
if job=='lw': print(build2(LAMI,U,'wide',D+'rollLamiW.mp4'))
if job=='lt': print(build2(LAMI,U,'tall',D+'rollLamiT.mp4'))
if job=='ww': print(build2(WHITE,A,'wide',D+'rollWhiteW.mp4'))
if job=='wt': print(build2(WHITE,A,'tall',D+'rollWhiteT.mp4'))
