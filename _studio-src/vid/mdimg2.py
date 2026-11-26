from PIL import Image, ImageDraw, ImageFilter, ImageFont
import json,re
O='/home/claude/dental-mbti/assets/hp-studio/modoo/'
C1=(246,243,238); C2=(235,229,220); TEAL=(30,174,159)
def bg(w,h,gx=.35,gy=.1,alpha=60):
  im=Image.new('RGB',(w,h),C1); d=ImageDraw.Draw(im)
  for y in range(h):
    t=y/h; d.line([(0,y),(w,y)],fill=tuple(int(C1[i]*(1-t)+C2[i]*t) for i in range(3)))
  g=Image.new('L',(w,h),0); ImageDraw.Draw(g).ellipse((int(w*gx),int(h*gy),int(w*(gx+.6)),int(h*(gy+.8))),fill=alpha); g=g.filter(ImageFilter.GaussianBlur(min(w,h)//6))
  return Image.composite(Image.new('RGB',(w,h),(200,236,231)),im,g)
def shadow(base,box,r=24,off=22,blur=34,alpha=70):
  s=Image.new('L',base.size,0); ImageDraw.Draw(s).rounded_rectangle((box[0],box[1]+off,box[2],box[3]+off),r,fill=alpha); s=s.filter(ImageFilter.GaussianBlur(blur))
  base.paste(Image.new('RGB',base.size,(60,50,45)),(0,0),s)
def paste_round(base,im,xy,r):
  m=Image.new('L',im.size,0); ImageDraw.Draw(m).rounded_rectangle((0,0,im.size[0]-1,im.size[1]-1),r,fill=255); base.paste(im,xy,m)
def laptop(base,shot,x,y,w):
  h=int(w*shot.size[1]/shot.size[0]); bez=max(6,int(w*.022))
  shadow(base,(x,y,x+w+2*bez,y+h+2*bez)); paste_round(base,Image.new('RGB',(w+2*bez,h+2*bez),(28,28,30)),(x,y),int(bez*1.2)); base.paste(shot.resize((w,h),Image.LANCZOS),(x+bez,y+bez))
  d=ImageDraw.Draw(base); bw=int(w*1.16); bx=x+bez+w//2-bw//2; by=y+h+2*bez
  d.rounded_rectangle((bx,by,bx+bw,by+max(8,int(w*.028))),int(w*.012),fill=(205,207,212)); d.rectangle((bx+bw//2-int(w*.08),by,bx+bw//2+int(w*.08),by+4),fill=(180,183,190))
def phone(base,shot,x,y,w):
  h=int(w*shot.size[1]/shot.size[0]); bez=max(5,int(w*.045))
  shadow(base,(x,y,x+w+2*bez,y+h+2*bez),r=int(w*.16)); paste_round(base,Image.new('RGB',(w+2*bez,h+2*bez),(28,28,30)),(x,y),int(w*.17)); paste_round(base,shot.resize((w,h),Image.LANCZOS),(x+bez,y+bez),int(w*.13))
def browser(base,shot,x,y,w):
  h=int(w*shot.size[1]/shot.size[0]); bar=max(16,int(w*.032))
  shadow(base,(x,y,x+w,y+h+bar),r=12,off=16,blur=26,alpha=60)
  win=Image.new('RGB',(w,h+bar),(250,250,251)); d=ImageDraw.Draw(win)
  for i,c in enumerate([(255,95,86),(255,189,46),(39,201,63)]): r=max(3,int(bar*.2)); cx=int(bar*.7)+i*int(bar*.6); d.ellipse((cx-r,bar//2-r,cx+r,bar//2+r),fill=c)
  win.paste(shot.resize((w,h),Image.LANCZOS),(0,bar)); paste_round(base,win,(x,y),12)
def S(n): return Image.open(f'shots/{n}.png').convert('RGB')
def blurlogo(im,box):
  r=im.crop(box).filter(ImageFilter.GaussianBlur(14)); im.paste(r,box); return im
def E(n):  # e-스타 화면: 로고 흐리게
  im=S(n); w,h=im.size
  box=(10,0,280,74) if w>=1000 else (8,0,240,78)
  return blurlogo(im,box)
d2a=S('d2v_0'); d2b=S('d2v_2'); d2c=S('d2v_5')
# ---- hero (오른쪽 58% 영역, 거의 정사각형) ----
W,H=1400,1300
im=bg(W,H,.15,.1); laptop(im,E('pf07_pc'),170,330,900); phone(im,E('pf07_m'),930,520,250); im.save(O+'h1.webp',quality=86)
im=bg(W,H,.15,.1); browser(im,S('pf06_pc'),120,210,760); browser(im,S('pf02_pc'),420,470,760); browser(im,d2a,240,760,640); phone(im,S('pf04_m'),1010,400,230); im.save(O+'h2.webp',quality=86)
h=open('export/index.html').read(); j=json.loads(re.findall(r'<script type="application/ld\+json">(.*?)</script>',h,re.S)[0])
types=[g.get('@type') for g in j['@graph']]
txt=json.dumps({"@type":"Dentist","name":"○○치과","areaServed":["신촌","홍대","이대"],"@graph":types},ensure_ascii=False,indent=2).split('\n')+['','{ "@type": "FAQPage",','  "mainEntity": [ … ] }']
im=bg(W,H,.15,.1); browser(im,E('ex_faq'),140,300,860)
px,py,pw,ph=760,700,500,480; shadow(im,(px,py,px+pw,py+ph)); paste_round(im,Image.new('RGB',(pw,ph),(32,28,26)),(px,py),16)
d=ImageDraw.Draw(im); fk=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',19,index=1)
yy=py+24
for line in txt[:20]: d.text((px+24,yy),line,font=fk,fill=(110,214,200) if '"@type"' in line else (226,220,212)); yy+=22
im.save(O+'h3.webp',quality=86)
# ---- 카드(1200x800) ----
def card(name,fn,w=1200,h=800):
  c=bg(w,h,.2,.0,50); fn(c); c.save(O+name+'.webp',quality=86)
card('cWeb',lambda c:(laptop(c,E('pf07_pc'),150,120,760),phone(c,E('pf07_m'),830,250,190)))
card('cSeo',lambda c:browser(c,E('ex_faq'),140,90,920))
card('cCare',lambda c:(browser(c,E('ex_lam2'),110,80,820),phone(c,E('ex_whM'),850,220,200)))
card('cProc',lambda c:(browser(c,E('ex_lam'),90,70,720),browser(c,E('ex_spe'),380,330,720)))
card('cCases',lambda c:(browser(c,S('pf06_pc'),70,60,640),browser(c,S('pf02_pc'),300,250,640),browser(c,d2a,520,430,600)))
card('cDiag',lambda c:browser(c,E('ex_con'),140,90,920))
card('cPoint',lambda c:(laptop(c,E('pf07_pc'),130,140,700),phone(c,E('ex_lamM'),760,220,180),phone(c,E('ex_whM'),960,260,170)))
# ---- 사례 갤러리 ----
cases=[('g01',lambda c:(laptop(c,E('pf07_pc'),150,130,760),phone(c,E('pf07_m'),830,250,190))),
 ('g02',lambda c:(browser(c,E('ex_lam'),110,70,780),phone(c,E('ex_lamM'),850,220,200))),
 ('g03',lambda c:(browser(c,E('ex_con'),90,70,720),browser(c,E('ex_spe'),390,330,720))),
 ('g04',lambda c:(browser(c,d2a,90,70,720),browser(c,d2b,390,330,720))),
 ('g05',lambda c:(laptop(c,S('pf06_pc'),150,130,760),phone(c,S('pf06_m'),830,250,190))),
 ('g06',lambda c:(laptop(c,S('pf02_pc'),150,130,760),phone(c,S('pf02_m'),830,250,190))),
 ('g07',lambda c:(laptop(c,S('pf03_pc'),150,130,760),phone(c,S('pf03_m'),830,250,190))),
 ('g08',lambda c:(laptop(c,S('pf01_pc'),150,130,760),phone(c,S('pf01_m'),830,250,190))),
 ('g09',lambda c:(laptop(c,S('pf04_pc'),150,130,760),phone(c,S('pf04_m'),830,250,190))),
 ('g10',lambda c:(laptop(c,S('pf05_pc'),150,130,760),phone(c,S('pf05_m'),830,250,190))),
 ('g11',lambda c:(browser(c,S('pg06_0_pc'),110,70,780),phone(c,S('pg06_0_m'),850,220,200))),
 ('g12',lambda c:(browser(c,d2c,140,90,920)))]
for n,fn in cases: card(n,fn)
# ---- 개선 전·후 (전 화면 준비 중 자리) ----
a=E('pf07_pc').resize((1440,900)); a.save(O+'baAfterPc.webp',quality=88)
ph=Image.new('RGB',(1440,900),(222,217,210)); d=ImageDraw.Draw(ph); fb=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc',44,index=1)
t='개선 전 화면 (준비 중)'; tw=d.textlength(t,font=fb); d.text(((1440-tw)/2,420),t,font=fb,fill=(120,112,104)); ph.save(O+'baBeforePc.webp',quality=88)
E('pf07_pc').save(O+'pf07.webp',quality=84)
print('ok')
