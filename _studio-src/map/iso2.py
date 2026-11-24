import math,random
random.seed(7)
S=2.0; OX,OY=-300,470
U=(1.0,0.24); V=(-0.46,0.74)   # +x east along 신촌로, +y south
def P(x,y,z=0): return (OX+(x*U[0]+y*V[0])*S, OY+(x*U[1]+y*V[1])*S - z*S)
def pts(l): return ' '.join(f'{a:.1f},{b:.1f}' for a,b in l)
def poly(l,fill,extra=''): return f'<polygon points="{pts(l)}" fill="{fill}" {extra}/>'
def quad(x0,y0,x1,y1,fill,z=0,extra=''): return poly([P(x0,y0,z),P(x1,y0,z),P(x1,y1,z),P(x0,y1,z)],fill,extra)
G=[]  # ground layer
L0=[]
B=[]  # (depth, svg) objects
def box(x0,y0,x1,y1,h,top,south,east,extra_s='',extra_e=''):
    st='stroke="#ffffff" stroke-width="2" stroke-linejoin="round"'
    sh=poly([P(x0+4,y0+6,0),P(x1+10,y0+6,0),P(x1+10,y1+8,0),P(x0+4,y1+8,0)],'rgba(70,80,110,.13)','filter="url(#blur)"')
    s=[sh,poly([P(x0,y1,0),P(x1,y1,0),P(x1,y1,h),P(x0,y1,h)],south,st),
       poly([P(x1,y0,0),P(x1,y1,0),P(x1,y1,h),P(x1,y0,h)],east,st),
       poly([P(x0,y0,h),P(x1,y0,h),P(x1,y1,h),P(x0,y1,h)],top,st)]
    return ''.join(s)+extra_s+extra_e
def depth(x,y): return y*0.74+x*0.24
def tree(x,y,r=9):
    bx,by=P(x,y,0); tx,ty=P(x,y,9)
    g=random.choice([('#5fbf4a','#86d860'),('#55b347','#7ccf55'),('#6cc653','#98e070')])
    R=r*S*.62
    B.append((depth(x,y)+.1,f'<ellipse cx="{bx+4:.1f}" cy="{by+2:.1f}" rx="{R*1.1:.1f}" ry="{R*.45:.1f}" fill="rgba(50,80,40,.16)"/><rect x="{tx-2.2:.1f}" y="{ty-R*.3:.1f}" width="4.4" height="{9*S+R*.3:.1f}" rx="2" fill="#9a6a44"/>'
      f'<circle cx="{tx-R*.45:.1f}" cy="{ty-R*.7:.1f}" r="{R*.72:.1f}" fill="{g[0]}"/><circle cx="{tx+R*.45:.1f}" cy="{ty-R*.75:.1f}" r="{R*.72:.1f}" fill="{g[0]}"/><circle cx="{tx:.1f}" cy="{ty-R*1.25:.1f}" r="{R*.8:.1f}" fill="{g[0]}"/>'
      f'<circle cx="{tx-R*.25:.1f}" cy="{ty-R*1.45:.1f}" r="{R*.38:.1f}" fill="{g[1]}" opacity=".85"/><circle cx="{tx-R*.6:.1f}" cy="{ty-R*.95:.1f}" r="{R*.25:.1f}" fill="{g[1]}" opacity=".7"/>'))
# --- ground
G.append(f'<rect width="1600" height="1000" fill="#edf3ea"/>')
RN,RS=-38,38   # 신촌로 edges (y)
X0,X1=-600,1700
# sidewalks
G.append(quad(X0,RN-16,X1,RN,'#f6e4dc')); G.append(quad(X0,RS,X1,RS+16,'#f6e4dc'))
# side roads north: alley(405-418), 연세로(585-618); south: 서강로(600-635)
def vroad(xa,xb,ya,yb,col='#8790a3'): G.append(quad(xa,ya,xb,yb,col))
vroad(403,419,-800,RN-16,'#a1a8b6'); vroad(583,620,-900,RN-16); vroad(592,628,RS+16,900)
G.append(quad(X0,RN,X1,RS,'#8790a3'))
# lane dashes
for x in range(-200,1300,34): G.append(quad(x,-1.5,x+18,1.5,'#f5d76e'))
for yy in (-19,19):
    for x in range(-200,1300,30): G.append(quad(x,yy-1,x+14,yy+1,'#ffffff'))
for y in range(-900,-60,26): G.append(quad(600,y,602.5,y+13,'#ffffff'))
# crosswalks
def cw_x(x0,x1,ya,yb,n=7):  # stripes across vertical road (stripes along x)
    w=(yb-ya)/(2*n)
    for k in range(n): G.append(quad(x0,ya+2*k*w,x1,ya+2*k*w+w,'#ffffff'))
def cw_y(xa,xb,y0,y1,n=8):
    w=(xb-xa)/(2*n)
    for k in range(n): G.append(quad(xa+2*k*w,y0,xa+2*k*w+w,y1,'#ffffff'))
cw_x(403,419,-70,-56,1); cw_y(583,620,-72,-56,6); cw_y(640,690,RN+2,RS-2,7); cw_y(500,545,RN+2,RS-2,6)
# station underground glow
G.append(quad(520,-14,880,14,'rgba(0,168,77,.28)'))
G.append(quad(X0,-3,X1,3,'rgba(0,168,77,.55)'))
# --- blocks (north side y<-54)
grey=('#fbfcff','#e6e9f3','#d3d8e6'); lav=('#f7f4ff','#e6e0f6','#d4cbee'); beige=('#fffaf3','#f1e6d6','#e2d3be'); mint=('#f6fbf8','#e2efe8','#cfe3d8')
blocks=[];grass=[]
avoid=[(320,-140,420,-50),(403,-800,419,-50),(415,-265,585,-50),(583,-900,620,-50),(625,-480,765,-320),(592,50,628,900)]
def free(x0,y0,x1,y1):
    for a0,b0,a1,b1 in avoid:
        if x0<a1 and x1>a0 and y0<b1 and y1>b0: return False
    return True
rows=[(-110,-60),(-160,-116),(-240,-172),(-300,-246),(-380,-315),(-450,-386),(-530,-465),(-600,-536),(-680,-615),(-760,-686),(60,105),(111,158),(172,236),(242,300),(315,380),(386,450),(465,530),(536,600)]
for y0,y1 in rows:
    x=-600
    while x<1700:
        w=random.uniform(40,95)
        if free(x,y0,x+w,y1):
            if random.random()<0.22: G.append(quad(x,y0,x+w,y1,'#dcebd3')); grass.append((x,y0,x+w,y1))
            else: blocks.append((x,y0,x+w,y1,random.uniform(8,24),random.choice([grey,grey,lav,beige,mint])))
        x+=w+20
blocks.append((345,-150,398,-140,0.1,grey))
for gx0,gy0,gx1,gy1 in grass:
    for _ in range(2): tree(random.uniform(gx0+10,gx1-10),random.uniform(gy0+10,gy1-8),14)
for x0,y0,x1,y1,h,c in blocks: B.append((depth(x1,y1),box(x0,y0,x1,y1,h,*c)))
# KFC / e-star building (corner, 5F)
KX0,KY0,KX1,KY1,KH=330,-135,401,-58,86
fl=KH/5
def sface(x0,x1,y,za,zb,fill,ex=''): return poly([P(x0,y,za),P(x1,y,za),P(x1,y,zb),P(x0,y,zb)],fill,ex)
def eface(x,y0,y1,za,zb,fill,ex=''): return poly([P(x,y0,za),P(x,y1,za),P(x,y1,zb),P(x,y0,zb)],fill,ex)
k=[box(KX0,KY0,KX1,KY1,KH,'#ffffff','#eaf4fa','#d6e7f1')]
# glass windows
for f in range(1,5):
    za,zb=f*fl+2,f*fl+fl-2
    for i in range(5):
        xa=KX0+3+i*12.4; k.append(sface(xa,xa+9.5,KY1,za,zb,'#a8d0ea' if f!=2 else '#ffd98a'))
    for i in range(5):
        ya=KY0+4+i*13.6; k.append(eface(KX1,ya,ya+10,za,zb,'#8dbcd9' if f!=2 else '#f2c467'))
# 1F red KFC band
k.append(sface(KX0,KX1,KY1,0,fl,'#d7192e')); k.append(eface(KX1,KY0,KY1,0,fl,'#b5121f'))
a,b=P((KX0+KX1)/2,KY1,fl*.62)
k.append(f'<text x="{a:.1f}" y="{b+8:.1f}" font-size="25" font-weight="800" fill="#fff" text-anchor="middle" transform="skewY(13.5)" style="transform-box:fill-box;transform-origin:center">KFC</text>')
# 3F glow ring

B.append((depth(KX1,KY1),''.join(k)))
# Hyundai
HX0,HY0,HX1,HY1,HH=422,-250,578,-70,84
h=[box(HX0,HY0,HX1,HY1,HH,'#fbf2e8','#f3e2d0','#e5cfb8')]
h.append(sface(HX0+16,HX1-16,HY1,14,HH-26,'#8fb8d6'))
for i in range(1,12): xx=HX0+16+i*(HX1-HX0-32)/12; h.append(f'<path d="M{P(xx,HY1,14)[0]:.1f} {P(xx,HY1,14)[1]:.1f}L{P(xx,HY1,HH-26)[0]:.1f} {P(xx,HY1,HH-26)[1]:.1f}" stroke="#5d84a3" stroke-width="2"/>')
for j in range(1,6): zz=14+j*(HH-40)/6; h.append(f'<path d="M{P(HX0+16,HY1,zz)[0]:.1f} {P(HX0+16,HY1,zz)[1]:.1f}L{P(HX1-16,HY1,zz)[0]:.1f} {P(HX1-16,HY1,zz)[1]:.1f}" stroke="#a9c6dc" stroke-width="1.5"/>')
h.append(sface(HX0+16,HX1-16,HY1,14,46,'#ffe2a6',' opacity=".6"'))
h.append(eface(HX1,HY0+20,HY1-14,14,HH-26,'#6f95b2'))
B.append((depth(HX1,HY1),''.join(h)))
# U-PLEX across 연세로
B.append((depth(760,-330),box(630,-470,760,-330,70,'#f1eefb','#ddd6f2','#c5bce6')))
# station entrances (glass canopies) on sidewalks
def canopy(x,y,n,main=False):
    c=box(x-10,y-6,x+10,y+6,13,'#d4f1fa','#a5dcef','#86c9e2')
    a,b=P(x,y,30 if main else 24); r=19 if main else 13
    c+=f'<line x1="{a:.1f}" y1="{b:.1f}" x2="{P(x,y,14)[0]:.1f}" y2="{P(x,y,14)[1]:.1f}" stroke="#555" stroke-width="2"/>'
    c+=f'<circle cx="{a:.1f}" cy="{b:.1f}" r="{r}" fill="#ffd400" stroke="#333" stroke-width="2"/><text x="{a:.1f}" y="{b+r*.38:.1f}" font-size="{r*1.15:.0f}" font-weight="800" text-anchor="middle" fill="#222">{n}</text>'
    B.append((depth(x,y)+.2,c.split('<line')[0])); L0.append('<line'+c.split('<line')[1])
canopy(630,-47,1,True); canopy(692,-47,2); canopy(800,-47,4); canopy(548,47,8); canopy(880,47,5)
# trees along sidewalks
for x in [v for v in range(-560,330,48) if v<300]+list(range(760,1650,56)): tree(x,-47,15)
for x in [v for v in list(range(-560,590,56))+list(range(650,1650,56)) if not 520<v<580]: tree(x,47,15)
for y in range(-850,-100,60): tree(628,y-10,12)
for x in range(440,575,45): tree(x,-47,13)

# walking route: from exit1 west along north sidewalk to KFC front
r=[P(624,-46,1),P(560,-46,1),P(410,-46,1),P(372,-46,1)]
route=f'<path d="M{r[0][0]:.1f} {r[0][1]:.1f}L{r[3][0]:.1f} {r[3][1]:.1f}" stroke="#e8336d" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 11" fill="none"/>'
ax,ay=r[3]; route+=f'<path d="M{ax+14:.1f} {ay-10:.1f}L{ax:.1f} {ay:.1f}L{ax+17:.1f} {ay+5:.1f}" stroke="#e8336d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
B.append((depth(600,-46)+.3,route))
B.sort(key=lambda t:t[0])
L=[]
# labels
def pill(x,y,z,text,bg,fg,size=24,pad=16,extra=''):
    a,b=P(x,y,z); w=len(text)*size*0.92+pad*2
    return f'<g transform="translate({a:.1f} {b:.1f})" {extra}><rect x="{-w/2:.1f}" y="{-size*1.1:.1f}" width="{w:.1f}" height="{size*2.2:.1f}" rx="{size*1.1:.1f}" fill="{bg}"/><text y="{size*.38:.1f}" font-size="{size}" font-weight="800" text-anchor="middle" fill="{fg}">{text}</text></g>'
a,b=P(500,-155,HH+6)
L.append(f'<text x="{a:.1f}" y="{b:.1f}" font-size="38" font-weight="800" text-anchor="middle" fill="#3b3330">현대백화점</text><text x="{a:.1f}" y="{b+44:.1f}" font-size="30" font-weight="800" text-anchor="middle" fill="#3b3330">신촌점</text>')
a,b=P(695,-400,72); 0 and L.append(f'<text x="{a:.1f}" y="{b:.1f}" font-size="20" font-weight="700" text-anchor="middle" fill="#6d5fa0">현대유플렉스</text>')
a,b=P(215,22,0); L.append(f'<text x="{a:.1f}" y="{b+9:.1f}" font-size="30" font-weight="800" text-anchor="middle" fill="#fff" transform="rotate(13.5 {a:.1f} {b:.1f})" stroke="#5f6573" stroke-width="5" paint-order="stroke">신촌로</text>')
a,b=P(601,-330,0); L.append(f'<g transform="translate({a:.1f} {b:.1f}) rotate(-58)"><rect x="-58" y="-17" width="116" height="34" rx="17" fill="#2f5fa8"/><text y="8" font-size="20" font-weight="800" text-anchor="middle" fill="#fff">연세로</text></g>')
# station label
a,b=P(720,30,0); L.append(f'<g transform="translate({a-170:.1f} {b-10:.1f})"><rect width="270" height="74" rx="37" fill="#00a84d" stroke="#fff" stroke-width="4"/><circle cx="40" cy="37" r="24" fill="#fff"/><text x="40" y="46" font-size="26" font-weight="900" text-anchor="middle" fill="#00a84d">2</text><text x="76" y="49" font-size="32" font-weight="800" fill="#fff">신촌역</text><text x="186" y="47" font-size="20" font-weight="700" fill="#d9f5e4">2호선</text></g>')
a,b=P(630,-47,30); L.append(f'<g transform="translate({a+26:.1f} {b-6:.1f})"><rect y="-20" width="122" height="40" rx="20" fill="#222"/><text x="61" y="7" font-size="20" font-weight="800" text-anchor="middle" fill="#ffd400">1번 출구</text></g>')
# route caption
a,b=P(470,0,0); L.append(f'<g transform="translate({a:.1f} {b:.1f}) rotate(13.5)"><rect x="-150" y="-19" width="300" height="38" rx="19" fill="#fff" stroke="#e8336d" stroke-width="2.5"/><text y="7" font-size="18" font-weight="800" text-anchor="middle" fill="#e8336d">현대백화점 지나 KFC 건물</text></g>')
# main pin + logo label
a,b=P((KX0+KX1)/2,(KY0+KY1)/2,KH)
L.append(f'<g transform="translate({a:.1f} {b-6:.1f})"><path d="M0 0C-20-26-32-40-32-58a32 32 0 0 1 64 0c0 18-12 32-32 58z" fill="#d7192e" stroke="#fff" stroke-width="4"/><circle cy="-58" r="12" fill="#fff"/></g>')
L.append(f'<g transform="translate({a-300:.1f} {b-250:.1f})" filter="url(#sh)"><rect width="380" height="140" rx="26" fill="#fff" stroke="#1f5fb8" stroke-width="4"/><image href="elogo.png" x="26" y="20" width="328" height="79"/><rect x="236" y="104" width="144" height="50" rx="25" fill="#1f5fb8" stroke="#fff" stroke-width="4"/><text x="308" y="138" font-size="25" font-weight="900" text-anchor="middle" fill="#fff">3층</text></g>')
L.append(f'<path d="M{a-110:.1f} {b-110:.1f}Q{a-30:.1f} {b-110:.1f} {a:.1f} {b-84:.1f}" stroke="#1f5fb8" stroke-width="4" fill="none"/>')
# info card
L.append('''<g transform="translate(36 800)" filter="url(#sh)"><rect width="520" height="168" rx="20" fill="#fff"/>
<text x="28" y="50" font-size="27" font-weight="900" fill="#222">신촌역 1번 출구 → 현대백화점 지나</text>
<text x="28" y="92" font-size="23" font-weight="700" fill="#444">KFC 건물 <tspan fill="#1f5fb8">3층 e-스타치과</tspan></text>
<text x="28" y="132" font-size="19" fill="#777">서울 서대문구 신촌로 79, 3층</text></g>''')
L.append('<g transform="translate(1540 70)"><circle r="32" fill="#fff" filter="url(#sh)"/><path d="M0-21l9 25H-9z" fill="#d7192e"/><text y="21" text-anchor="middle" font-size="14" font-weight="800" fill="#555">N</text></g>')
0 and L.append('<text x="1580" y="988" text-anchor="end" font-size="15" fill="#8a8f99">약도는 이해를 돕기 위한 그림으로 실제 축척과 다릅니다</text>')
html=f'''<!doctype html><meta charset="utf-8"><style>
@font-face{{font-family:KS;font-weight:700;src:url(node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-700-normal.woff2)}}
@font-face{{font-family:KS;font-weight:800;src:url(node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-800-normal.woff2),url(node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-700-normal.woff2)}}
@font-face{{font-family:KS;font-weight:900;src:url(node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-900-normal.woff2)}}
@font-face{{font-family:KS;font-weight:400;src:url(node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-400-normal.woff2)}}
@font-face{{font-family:KS;font-weight:700 900;src:url(node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-latin-800-normal.woff2);unicode-range:U+0000-00FF}}
body{{margin:0}}text{{font-family:KS,sans-serif}}</style>
<svg id="m" width="1600" height="1000" viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg"><defs><filter id="blur"><feGaussianBlur stdDeviation="4"/></filter><filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity=".18"/></filter></defs>
{''.join(G)}{''.join(s for _,s in B)}{''.join(L0)}{''.join(L)}</svg>'''
open('iso2.html','w').write(html)
