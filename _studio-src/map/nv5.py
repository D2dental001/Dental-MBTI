import re
import math,random
random.seed(11)
K=2.5; X0,Y0=205,95; SQ=.78; OYS=215
def P(x,y,z=0): return ((x-X0)*K, (y-Y0)*K*SQ+OYS - z*K)
def pts(l): return ' '.join(f'{a:.1f},{b:.1f}' for a,b in l)
def poly(l,fill,ex=''): return f'<polygon points="{pts(l)}" fill="{fill}" {ex}/>'
def path(l,stroke,w,ex=''):
    q=[P(*p) for p in l]; d='M'+' L'.join(f'{a:.1f} {b:.1f}' for a,b in q)
    return f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{w*K:.1f}" stroke-linecap="round" stroke-linejoin="round" {ex}/>'
G=[];B=[];L=[]
def W(p0,p1,t0,t1,z0,z1):
    (xa,ya),(xb,yb)=p0,p1
    f=lambda t,z:P(xa+(xb-xa)*t,ya+(yb-ya)*t,z)
    return [f(t0,z0),f(t1,z0),f(t1,z1),f(t0,z1)]
def inset(fp,d):
    cx=sum(x for x,_ in fp)/len(fp); cy=sum(y for _,y in fp)/len(fp)
    return [(x+(cx-x)*d,y+(cy-y)*d) for x,y in fp]

G.append('<rect width="1600" height="1000" fill="#e4e2cf"/>')
# ---------- roads (traced from naver map, original px)
SR=[(-40,108),(0,128),(230,245),(400,312),(520,358),(650,390),(800,380),(983,325),(1040,300)]
roads=[ (SR,92),
 ([(343,262),(371,190),(398,128),(418,0),(424,-20)],30),            # 연세로 (KFC와 현대백화점 사이)
 ([(516,330),(522,150),(528,-20)],14),                     # 현대백화점 동쪽 보행로
 ([(652,350),(655,150),(660,-20)],18),                     # 동쪽 골목
 ([(470,380),(400,470),(330,640)],22),                     # 남서쪽 길
 ([(585,410),(612,520),(640,660)],26),                     # 서강로
 ([(690,410),(660,520),(650,660)],20),                     # 백범로
 ([(230,240),(180,330),(150,420),(130,640)],18),           # 서쪽 남북길
 ([(230,250),(250,120),(262,-20)],16),
 ([(780,380),(790,200),(800,-20)],16),
 ([(-40,330),(150,360),(330,420)],14),([(600,170),(980,140)],14),([(150,170),(345,190)],12),([(0,520),(330,520)],14),([(700,520),(1000,500)],14)]
for l,w in roads: G.append(path(l,'#ece0cc',w+14))
for l,w in roads: G.append(path(l,'#f3dfd5' if w==14 and l[0]==(516,330) else ('#f5eee2' if w<30 else '#9a938c'),w))
G.append(path(SR,'#9a938c',92))
G.append(path(SR,'#eccb7e',1.6,'stroke-dasharray="14 16"'))
for off in (-24,24):
    q=[(x,y+off) for x,y in SR]; G.append(path(q,'#ffffff',1.2,'stroke-dasharray="8 12" opacity=".9"'))
G.append(path([(343,262),(371,190),(398,128),(418,0),(424,-20)],'#a29b93',30)); G.append(path([(343,262),(371,190),(398,128),(418,0),(424,-20)],'#ffffff',1.2,'stroke-dasharray="8 12"'))
# subway line 2 + station platform
G.append(path([(0,150),(230,262),(460,372),(560,400),(650,412),(760,405),(880,385),(983,340)],'#00a84d',4,'opacity=".55"'))
for l,w in [([(495,404),(560,412),(650,420),(760,412),(840,396)],16),([(590,404),(600,370),(574,352)],8),([(612,408),(630,360),(636,326)],8),
 ([(700,412),(720,375),(742,358)],8),([(760,414),(800,418),(820,428)],8),([(770,416),(772,470)],7),([(520,408),(500,410)],8)]:
    G.append(path(l,'#2fb768',w,'opacity=".33"')); G.append(path(l,'#ffffff',w*.25,'opacity=".25"'))

# crosswalks
def cw(cx,cy,dx,dy,ln,wd):
    m=math.hypot(dx,dy); dx,dy=dx/m,dy/m
    a=P(cx-dx*ln/2,cy-dy*ln/2); b=P(cx+dx*ln/2,cy+dy*ln/2)
    G.append(f'<path d="M{a[0]:.1f} {a[1]:.1f}L{b[0]:.1f} {b[1]:.1f}" stroke="#fff" stroke-width="{wd*K:.1f}" stroke-dasharray="{1.6*K:.1f} {1.6*K:.1f}" fill="none" opacity=".95"/>')
cw(345,270,1,.4,32,11); cw(518,334,1,.3,15,9); cw(652,356,1,.1,20,10); cw(438,318,-.36,1,90,12); cw(606,382,-.22,1,90,12)
# ---------- buildings (footprint polygons, height)
def bld(fp,h,wall,roof,win=None,ex_roof='',key=None):
    q0=[P(x,y,0) for x,y in fp]; q1=[P(x,y,h) for x,y in fp]
    s=[poly([(a+14,b+10) for a,b in q0],'rgba(80,55,40,.18)','filter="url(#blur)"')]
    n=len(fp)
    # signed area to know orientation
    A=sum(fp[i][0]*fp[(i+1)%n][1]-fp[(i+1)%n][0]*fp[i][1] for i in range(n))
    walls=[]
    for i in range(n):
        (xa,ya),(xb,yb)=fp[i],fp[(i+1)%n]
        nx,ny=(yb-ya),-(xb-xa)
        if A<0: nx,ny=-nx,-ny
        if ny>0.15*abs(nx) or (ny>0):
            shade=max(.82,min(1.0,0.9+0.1*(nx/(abs(nx)+abs(ny)+1e-9))))
            walls.append(((ya+yb)/2,i,shade))
    walls.sort()
    for _,i,shade in walls:
        a0,b0=q0[i],q0[(i+1)%n]; a1,b1=q1[i],q1[(i+1)%n]
        s.append(poly([a0,b0,b1,a1],wall,f'stroke="#fff" stroke-width="2.5" stroke-linejoin="round" style="filter:brightness({shade:.2f})"'))
        if win:
            (xa,ya),(xb,yb)=fp[i],fp[(i+1)%n]; L_=math.hypot(xb-xa,yb-ya)
            nw=max(1,int(L_/9)); fl=max(1,int(h/5.5))
            for f in range(fl):
                for j in range(nw):
                    t0=(j+.22)/nw; t1=(j+.78)/nw; z0=f*h/fl+1.3; z1=(f+1)*h/fl-1.3
                    c=win(f) if callable(win) else win
                    pa=lambda t,z:P(xa+(xb-xa)*t,ya+(yb-ya)*t,z)
                    s.append(poly([pa(t0,z0),pa(t1,z0),pa(t1,z1),pa(t0,z1)],c,'rx="2"'))
    s.append(poly(q1,roof,'stroke="#fff" stroke-width="3" stroke-linejoin="round"'+ex_roof))
    B.append((key if key is not None else max(y for _,y in fp),''.join(s)))
pal=[('#efd8c9','#f7ebe1','#c4896d'),('#d7e0cc','#ecf1e4','#7d9e80'),('#d6dfe3','#ebf0f1','#7d98ab'),('#e8dccb','#f5eee2','#b3905f'),('#e7d3cf','#f4e9e6','#ad7d78'),('#ede4d3','#f9f4eb','#a2845a')]
_old=[('#ffe6dc','#fff4ef','#ff9f8a'),('#dff3ea','#f2fbf6','#5cc4a0'),('#e3ecfb','#f4f8ff','#7aa7e8'),('#eee6fb','#f8f4ff','#a98be0'),('#fff3d6','#fffaee','#ffc24d'),('#f4f1ec','#ffffff','#f28a6b')]
def cute(fp,h,wall,roof,acc):
    q0=[P(x,y,0) for x,y in fp]; q1=[P(x,y,h) for x,y in fp]
    s=[poly([(a+14,b+10) for a,b in q0],'rgba(80,55,40,.16)','filter="url(#blur)"')]
    (x0,y0),(x1,_),(_,y1)=fp[0],fp[1],fp[2]
    # east wall
    s.append(poly(W((x1,y1),(x1,y0),0,1,0,h),wall,'stroke="#fff" stroke-width="2" stroke-linejoin="round" style="filter:brightness(.9)"'))
    s.append(poly(W((x0,y1),(x1,y1),0,1,0,h),wall,'stroke="#fff" stroke-width="2" stroke-linejoin="round"'))
    S0,S1=(x0,y1),(x1,y1); n=max(2,int((x1-x0)/8)); fl=max(1,int((h-5)/5))
    # storefront
    s.append(poly(W(S0,S1,.06,.94,.6,4.2),'#f0dcb4'))
    s.append(poly(W(S0,S1,.38,.52,.6,4.2),'#7c8aa0'))
    aw=W(S0,S1,.02,.98,4.2,5.4); s.append(poly(aw,acc,'stroke="#fff" stroke-width="1.2"'))
    for k in range(1,9,2): s.append(poly(W(S0,S1,.02+.96*k/9,.02+.96*(k+1)/9,4.2,5.4),'#ffffff',' opacity=".55"'))
    for f in range(fl):
        z0=6.4+f*5; z1=z0+3.2
        if z1>h-1: break
        for j in range(n):
            t0=(j+.25)/n; t1=(j+.75)/n
            s.append(poly(W(S0,S1,t0-.02,t1+.02,z0-.5,z1+.5),'#ffffff'))
            s.append(poly(W(S0,S1,t0,t1,z0,z1),random.choice(['#f2d593','#f6e0a8','#bccbd2']) if random.random()<.3 else '#c3d0d6'))
    s.append(poly(q1,roof,'stroke="#fff" stroke-width="2.5" stroke-linejoin="round"'))
    s.append(poly([P(x,y,h) for x,y in inset(fp,.14)],wall,' opacity=".55"'))
    if random.random()<.55:
        cx,cy=(x0+x1)/2+random.uniform(-3,3),(y0+y1)/2+random.uniform(-2,2); w=random.uniform(4,7)
        u=[(cx-w,cy-w*.7),(cx+w,cy-w*.7),(cx+w,cy+w*.7),(cx-w,cy+w*.7)]
        s.append(poly(W((cx-w,cy+w*.7),(cx+w,cy+w*.7),0,1,h,h+3),'#e9edf2','stroke="#fff" stroke-width="1"'))
        s.append(poly([P(x,y,h+3) for x,y in u],'#ffffff','stroke="#dfe5ec" stroke-width="1"'))
    B.append((y1,''.join(s)))
avoid_roads=[]
def near_road(x,y,pad):
    for l,w in roads:
        for (xa,ya),(xb,yb) in zip(l,l[1:]):
            dx,dy=xb-xa,yb-ya; t=max(0,min(1,((x-xa)*dx+(y-ya)*dy)/(dx*dx+dy*dy)))
            if math.hypot(x-(xa+dx*t),y-(ya+dy*t))<w/2+7+pad: return True
    return False
special=[(270,195,345,258),(350,120,530,312),(540,-10,650,50),(470,350,900,440)]
def in_special(x0,y0,x1,y1):
    return any(x0<c and x1>a and y0<d and y1>b for a,b,c,d in special)
trees=[]
for gy in range(-10,640,46):
    for gx in range(60,960,44):
        w=random.uniform(26,38); d=random.uniform(22,34)
        x0,y0=gx+random.uniform(-3,3),gy+random.uniform(-3,3); x1,y1=x0+w,y0+d
        if any(near_road(x,y,0) for x,y in [(x0,y0),(x1,y0),(x0,y1),(x1,y1),((x0+x1)/2,(y0+y1)/2)]) or in_special(x0,y0,x1,y1): continue
        if random.random()<.2:
            G.append(poly([P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)],'#cbd8b0','stroke="#b9c79c" stroke-width="1"')); trees.append(((x0+x1)/2,(y0+y1)/2,12)); continue
        wall,roof,acc=random.choice(pal); h=random.uniform(11,21)
        cute([(x0,y0),(x1,y0),(x1,y1),(x0,y1)],h,wall,roof,acc)
# U-PLEX
cute([(548,-8),(640,-8),(640,48),(548,48)],34,'#eee6fb','#f8f4ff','#a98be0')
# 올리브영 block
cute([(550,240),(634,240),(634,312),(550,312)],24,'#fff3d6','#fffaee','#ffc24d')

SW_='stroke="rgba(90,60,40,.18)" stroke-width="1.2" stroke-linejoin="round"'
# ---------- 현대백화점 (stone + glass atrium, plaza)
HF=[(415,130),(522,180),(497,295),(362,245)]; HH=46
hs=[poly([(a+18,b+12) for a,b in [P(x,y) for x,y in HF]],'rgba(80,55,40,.2)','filter="url(#blur)"')]
plaza=[(362,247),(497,297),(494,306),(358,256)]
hs.append(poly([P(x,y) for x,y in plaza],'#f2d9cf','stroke="#fff" stroke-width="2"'))
for (p0,p1,base) in [((HF[3]),(HF[2]),'url(#stoneS)'),((HF[2]),(HF[1]),'url(#stoneE)')]:
    hs.append(poly(W(p0,p1,0,1,0,HH),base,SW_))
    for k in range(1,6): hs.append(poly(W(p0,p1,0,1,k*HH/6-0.35,k*HH/6+0.35),'rgba(150,120,95,.25)'))
# south atrium glass
S0,S1=HF[3],HF[2]
hs.append(poly(W(S0,S1,.16,.84,3,HH-7),'url(#glass)','stroke="#4d6f92" stroke-width="3" stroke-linejoin="round"'))
hs.append(poly(W(S0,S1,.16,.84,3,12),'url(#warm)'))
for k in range(1,12):
    t=.16+.68*k/12; hs.append(poly(W(S0,S1,t-.003,t+.003,3,HH-7),'#5b7fa3'))
for k in range(1,5):
    z=3+k*(HH-10)/5; hs.append(poly(W(S0,S1,.16,.84,z-.25,z+.25),'#b9d4ea'))
hs.append(poly(W(S0,S1,.12,.16,0,HH-4),'#4d6f92')); hs.append(poly(W(S0,S1,.84,.88,0,HH-4),'#4d6f92'))
# east side narrow windows
E0,E1=HF[2],HF[1]
for k in range(8):
    t0=.08+k*.11; hs.append(poly(W(E0,E1,t0,t0+.06,6,HH-8),'#8fb0cc'))
# roof + parapet
top=[P(x,y,HH) for x,y in HF]; hs.append(poly(top,'#fbf3e8',SW_))
hs.append(poly([P(x,y,HH) for x,y in inset(HF,.07)],'#efe2d0'))
hs.append(poly([P(x,y,HH) for x,y in inset(HF,.1)],'#f7ecdf'))
B.append((238,''.join(hs)))
for x,y in [(374+k*16.5,262+k*6.1) for k in (0,1,6,7)]: trees.append((x,y,9))
# U-PLEX
cute([(548,-8),(640,-8),(640,48),(548,48)],34,'#eee6fb','#f8f4ff','#a98be0')
cute([(550,240),(634,240),(634,312),(550,312)],24,'#fff3d6','#fffaee','#ffc24d')
# ---------- KFC / e-스타 building (glass corner, red sign band)
KF=[(284,208),(332,214),(337,250),(288,243)]; KH=64
ks=[poly([(a+18,b+12) for a,b in [P(x,y) for x,y in KF]],'rgba(80,55,40,.22)','filter="url(#blur)"')]
for (p0,p1,gl) in [(KF[3],KF[2],'url(#kglassS)'),(KF[2],KF[1],'url(#kglassE)')]:
    ks.append(poly(W(p0,p1,0,1,0,KH),'#ffffff',SW_))
    fl=KH/5
    for f in range(5):
        z0,z1=f*fl+1.4,(f+1)*fl-1.2
        c='url(#lit)' if f==2 else (gl if f else 'url(#shop)')
        ks.append(poly(W(p0,p1,.05,.95,z0,z1),c))
        for k in range(1,5):
            t=.05+.9*k/5; ks.append(poly(W(p0,p1,t-.006,t+.006,z0,z1),'rgba(255,255,255,.85)'))
    # red sign band on 2F wrapping
    ks.append(poly(W(p0,p1,-.01,1.01,fl*.95,fl*1.85),'#e3192f','stroke="#fff" stroke-width="2"'))
    ks.append(poly(W(p0,p1,-.01,1.01,fl*.95,fl*1.05),'#b30f20'))
# corner pillar highlight (SE corner)
ks.append(poly(W(KF[3],KF[2],.95,1,0,KH),'#ffffff')); ks.append(poly(W(KF[2],KF[1],0,.05,0,KH),'#eef4f8'))
# KFC text on south band
q=W(KF[3],KF[2],.2,.8,KH/5*.95,KH/5*1.85); cxk=(q[0][0]+q[1][0])/2; cyk=(q[0][1]+q[3][1])/2
ang=math.degrees(math.atan2(q[1][1]-q[0][1],q[1][0]-q[0][0]))
ks.append(f'<text x="{cxk:.1f}" y="{cyk+8:.1f}" font-size="22" font-weight="900" font-style="italic" fill="#fff" text-anchor="middle" transform="rotate({ang:.1f} {cxk:.1f} {cyk:.1f})" letter-spacing="1">KFC</text>')
q=W(KF[2],KF[1],.2,.8,KH/5*.95,KH/5*1.85); cxk=(q[0][0]+q[1][0])/2; cyk=(q[0][1]+q[3][1])/2
ks.append(f'<text x="{cxk:.1f}" y="{cyk+7:.1f}" font-size="18" font-weight="900" font-style="italic" fill="#fff" text-anchor="middle" transform="translate({cxk:.1f} {cyk:.1f}) skewY(-80) translate({-cxk:.1f} {-cyk:.1f})">KFC</text>')
# 3F tag
q=W(KF[3],KF[2],.06,.36,KH/5*2+1.4,KH/5*3-1.2); 
# roof with parapet and rooftop unit
ks.append(poly([P(x,y,KH) for x,y in KF],'#ffffff',SW_))
ks.append(poly([P(x,y,KH) for x,y in inset(KF,.12)],'#e7edf2'))
ks.append(poly([P(x,y,KH) for x,y in inset(KF,.16)],'#f6f9fb'))
B.append((262,''.join(ks)))
# street trees along 신촌로 sidewalks
def along(l,off,step,skip=lambda x,y:False):
    out=[]
    for (xa,ya),(xb,yb) in zip(l,l[1:]):
        L_=math.hypot(xb-xa,yb-ya); nx,ny=-(yb-ya)/L_,(xb-xa)/L_
        for t in [i*step/L_ for i in range(int(L_/step)+1)]:
            x,y=xa+(xb-xa)*t+nx*off,ya+(yb-ya)*t+ny*off
            if not skip(x,y): out.append((x,y))
    return out
for x,y in along(SR[1:],-56,34,lambda x,y: 280<x<365 or 495<x<545 or 555<x<600 or 630<x<680 or x<40 or x>960): trees.append((x,y,10))
for x,y in along(SR[1:],56,36,lambda x,y: 455<x<520 or 560<x<720 or x<40 or x>960): trees.append((x,y,10))
for x,y in along([(516,330),(522,150),(528,0)],13,46,lambda x,y:y>300): trees.append((x,y,8))
for x,y in along([(371,190),(398,128),(418,0)],-24,44): trees.append((x,y,9))
def tree(x,y,r):
    bx,by=P(x,y,0); tx,ty=P(x,y,5)
    g=random.choice([('#6f9a5b','#a6c47f'),('#5d8a52','#93b46e'),('#7ba566','#b3cf8c')]); R=r*K*.55
    B.append((y+.5,f'<ellipse cx="{bx+5:.1f}" cy="{by+2:.1f}" rx="{R*1.05:.1f}" ry="{R*.42:.1f}" fill="rgba(70,60,30,.2)"/><rect x="{tx-2.5:.1f}" y="{ty:.1f}" width="5" height="{by-ty:.1f}" rx="2.5" fill="#8a6448"/>'
     f'<circle cx="{tx-R*.45:.1f}" cy="{ty-R*.55:.1f}" r="{R*.7:.1f}" fill="{g[0]}"/><circle cx="{tx+R*.45:.1f}" cy="{ty-R*.6:.1f}" r="{R*.7:.1f}" fill="{g[0]}"/><circle cx="{tx:.1f}" cy="{ty-R*1.1:.1f}" r="{R*.78:.1f}" fill="{g[0]}"/>'
     f'<circle cx="{tx-R*.25:.1f}" cy="{ty-R*1.3:.1f}" r="{R*.36:.1f}" fill="{g[1]}"/><circle cx="{tx-R*.6:.1f}" cy="{ty-R*.75:.1f}" r="{R*.22:.1f}" fill="{g[1]}" opacity=".8"/>'))
for x,y,r in trees: tree(x,y,r)
B.sort(key=lambda t:t[0])
# ---------- route
R_=[(566,342),(530,324),(470,300),(410,278),(360,258),(326,250)]
q=[P(*p) for p in R_]; d='M'+' L'.join(f'{a:.1f} {b:.1f}' for a,b in q)
L.append(f'<path d="{d}" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/><path d="{d}" fill="none" stroke="#c9932f" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 13"/>')
ax,ay=q[-1]; L.append(f'<path d="M{ax+20:.1f} {ay-6:.1f}L{ax:.1f} {ay:.1f}L{ax+15:.1f} {ay+15:.1f}" stroke="#c9932f" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
# exits (naver style yellow numbered)
def entrance(x,y,n,big=False,face=1):
    # small glass entrance pavilion: footprint 16x9, opening faces south(face=1) or north(-1)
    w,d,h=(13,7,12) if big else (11,6,10)
    fp=[(x-w,y-d),(x+w,y-d),(x+w,y+d),(x-w,y+d)]
    o=[poly([(a+12,b+9) for a,b in [P(*p) for p in fp]],'rgba(80,55,40,.24)','filter="url(#blur)"')]
    o.append(poly(W((x+w,y+d),(x+w,y-d),0,1,0,h),'url(#exglass)','stroke="#fff" stroke-width="1.5" style="filter:brightness(.88)"'))
    o.append(poly(W((x-w,y+d),(x+w,y+d),0,1,0,h),'url(#exglass)','stroke="#fff" stroke-width="1.5"'))
    if face==1:
        o.append(poly(W((x-w,y+d),(x+w,y+d),.22,.78,0,h-1.5),'#3d4b45'))
        for k in range(4): o.append(poly(W((x-w,y+d),(x+w,y+d),.22,.78,k*1.4+.3,k*1.4+.8),'#8a9a92'))
    o.append(poly([P(a,b,h) for a,b in [(x-w-1.5,y-d-1.5),(x+w+1.5,y-d-1.5),(x+w+1.5,y+d+1.5),(x-w-1.5,y+d+1.5)]],'#1f9a57','stroke="#fff" stroke-width="2"'))
    o.append(poly(W((x-w-1.5,y+d+1.5),(x+w+1.5,y+d+1.5),0,1,h-1.4,h),'#15824a'))
    # sign on roof front
    sx,sy=P(x,y+d+1.5,h); r=17 if big else 13
    o.append(f'<g transform="translate({sx:.1f} {sy-r-10:.1f})"><rect x="{-r*2.2:.1f}" y="{-r*.9:.1f}" width="{r*4.4:.1f}" height="{r*1.8:.1f}" rx="{r*.9:.1f}" fill="#fff" stroke="#00a84d" stroke-width="2.5"/>'
             f'<circle cx="{-r*1.25:.1f}" cy="0" r="{r*.68:.1f}" fill="#00a84d"/><text x="{-r*1.25:.1f}" y="{r*.27:.1f}" font-size="{r*.8:.0f}" font-weight="900" fill="#fff" text-anchor="middle">2</text>'
             f'<circle cx="{r*1.25:.1f}" cy="0" r="{r*.72:.1f}" fill="#ffd21f" stroke="#333" stroke-width="1.6"/><text x="{r*1.25:.1f}" y="{r*.3:.1f}" font-size="{r*.95:.0f}" font-weight="900" fill="#222" text-anchor="middle">{n}</text></g>')
    B.append((y+d+2,''.join(o)))
entrance(571,340,1,True); entrance(640,314,2); entrance(742,350,4); entrance(821,432,5,face=-1); entrance(495,412,8,face=-1)
a,b=P(571,350,0); L.append(f'<g transform="translate({a-170:.1f} {b+14:.1f})"><rect y="-21" width="124" height="42" rx="21" fill="#3b2a22"/><text x="62" y="8" font-size="21" font-weight="800" text-anchor="middle" fill="#ffd21f">1번 출구</text></g>')
# labels
def roadlabel(x,y,txt,ang,size=30,bg='#5d6678'):
    a,b=P(x,y,0); return f'<text x="{a:.1f}" y="{b+size*.35:.1f}" font-size="{size}" font-weight="900" fill="#fff" text-anchor="middle" stroke="{bg}" stroke-width="7" paint-order="stroke" transform="rotate({ang} {a:.1f} {b:.1f})">{txt}</text>'
L.append(roadlabel(236,272,'신촌로',22,28,'#7a6f66'))
a,b=P(392,140,0); L.append(f'<g transform="translate({a:.1f} {b:.1f}) rotate(-71)"><rect x="-62" y="-19" width="124" height="38" rx="19" fill="#5a4436"/><text y="8" font-size="21" font-weight="800" text-anchor="middle" fill="#fff">연세로</text></g>')
a,b=P(452,212,44); L.append(f'<text x="{a:.1f}" y="{b:.1f}" font-size="38" font-weight="900" text-anchor="middle" fill="#4a3d36">현대백화점</text><text x="{a:.1f}" y="{b+42:.1f}" font-size="28" font-weight="800" text-anchor="middle" fill="#4a3d36">신촌점</text>')
a,b=P(594,48,34); L.append(f'<text x="{a:.1f}" y="{b+6:.1f}" font-size="19" font-weight="800" text-anchor="middle" fill="#5a4436" stroke="#fff8ee" stroke-width="5" paint-order="stroke">현대유플렉스</text>')
a,b=P(690,420,0); L.append(f'<g transform="translate({a-140:.1f} {b+4:.1f})" filter="url(#sh)"><rect width="280" height="72" rx="36" fill="#00a84d" stroke="#fff" stroke-width="4"/><circle cx="38" cy="36" r="23" fill="#fff"/><text x="38" y="45" font-size="26" font-weight="900" text-anchor="middle" fill="#00a84d">2</text><text x="74" y="48" font-size="32" font-weight="900" fill="#fff">신촌역</text><text x="186" y="46" font-size="20" font-weight="800" fill="#d6f5e2">2호선</text></g>')
# pin + logo label
a,b=P(310,229,64)
L.append(f'<g transform="translate({a:.1f} {b-4:.1f})"><path d="M0 0C-22-28-34-42-34-62a34 34 0 0 1 68 0c0 20-12 34-34 62z" fill="url(#pin)" stroke="#fff" stroke-width="4"/><circle cy="-62" r="14" fill="#d8b46a"/><circle cy="-62" r="7" fill="#fff8e8"/></g>')
L.append(f'<g transform="translate({a-205:.1f} {b-270:.1f})" filter="url(#sh)"><rect width="410" height="132" rx="30" fill="#fff" stroke="#c9a35b" stroke-width="3"/><image href="elogo.png" x="28" y="18" width="354" height="86"/><rect x="133" y="104" width="144" height="50" rx="25" fill="#3b2a22" stroke="#fff" stroke-width="4"/><text x="205" y="138" font-size="25" font-weight="900" text-anchor="middle" fill="#fff">3층</text></g>')
L.append(f'<path d="M{a:.1f} {b-116:.1f}L{a:.1f} {b-100:.1f}" stroke="#c9a35b" stroke-width="3"/>')
L.append('''<g transform="translate(34 822)" filter="url(#sh)"><rect width="540" height="150" rx="22" fill="#fff"/>
<text x="28" y="50" font-size="26" font-weight="900" fill="#3b2a22">신촌역 1번 출구 → 현대백화점 앞 지나</text>
<text x="28" y="90" font-size="23" font-weight="800" fill="#5a4436">연세로 건너 KFC 건물 <tspan fill="#a67c2e">3층</tspan></text>
<text x="28" y="126" font-size="18" fill="#8a7a6e">서울 서대문구 신촌로 79, 3층</text></g>''')
L.append('<g transform="translate(1548 60)"><circle r="30" fill="#fff" filter="url(#sh)"/><path d="M0-20l9 24H-9z" fill="#3b2a22"/><text y="20" text-anchor="middle" font-size="13" font-weight="800" fill="#555">N</text></g>')
def soft(t):
    t=re.sub(r'stroke="#fff(?:fff)?" stroke-width="[0-9.]+"','stroke="rgba(90,60,40,.16)" stroke-width="1"',t)
    # 벽면마다 위는 밝고 아래는 어두운 빛 그라데이션
    t=re.sub(r'(<polygon points="([^"]+)" fill="(?!url)[^"]+" stroke="rgba\(90,60,40,.16\)" stroke-width="1"( stroke-linejoin="round")? style="filter:brightness[^"]*"/>)',lambda m:m.group(1)+f'<polygon points="{m.group(2)}" fill="url(#wl)"/>',t)
    return t
html=f'''<!doctype html><meta charset="utf-8"><style>
@font-face{{font-family:KS;font-weight:400;src:url(node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-400-normal.woff2)}}
@font-face{{font-family:KS;font-weight:800;src:url(node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-800-normal.woff2)}}
@font-face{{font-family:KS;font-weight:900;src:url(node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-900-normal.woff2)}}
@font-face{{font-family:KS;font-weight:800 900;src:url(node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-latin-900-normal.woff2);unicode-range:U+0000-00FF}}
body{{margin:0}}text{{font-family:KS,sans-serif}}</style>
<svg id="m" width="1600" height="1000" viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="stoneS" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f6e7d6"/><stop offset="1" stop-color="#e9d2bb"/></linearGradient>
<linearGradient id="stoneE" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e6cfb7"/><stop offset="1" stop-color="#d6bb9f"/></linearGradient>
<linearGradient id="glass" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#cfe6f7"/><stop offset=".45" stop-color="#8fb9dc"/><stop offset="1" stop-color="#6d98c2"/></linearGradient>
<linearGradient id="warm" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffe9b8" stop-opacity=".95"/><stop offset="1" stop-color="#ffd27a" stop-opacity=".95"/></linearGradient>
<linearGradient id="kglassS" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#d9effc"/><stop offset=".5" stop-color="#a6d1ef"/><stop offset="1" stop-color="#82b7e0"/></linearGradient>
<linearGradient id="kglassE" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#9cc6e6"/><stop offset="1" stop-color="#6fa3cf"/></linearGradient>
<linearGradient id="lit" x1="0" x2="1"><stop offset="0" stop-color="#fff1c4"/><stop offset="1" stop-color="#ffd36b"/></linearGradient>
<linearGradient id="shop" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e3f2fb"/><stop offset="1" stop-color="#bcdcf0"/></linearGradient><linearGradient id="exglass" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#e4f6ff"/><stop offset="1" stop-color="#9fd3ee"/></linearGradient><linearGradient id="pin" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5a4030"/><stop offset="1" stop-color="#2e2019"/></linearGradient>
<radialGradient id="sun" cx="12%" cy="0%" r="95%"><stop offset="0" stop-color="#ffd79a" stop-opacity=".38"/><stop offset=".55" stop-color="#ffe2b0" stop-opacity=".1"/><stop offset="1" stop-color="#6b4a35" stop-opacity=".16"/></radialGradient>
<linearGradient id="wl" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff4dc" stop-opacity=".28"/><stop offset="1" stop-color="#5a3c28" stop-opacity=".16"/></linearGradient>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="4" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .18  0 0 0 1.4 -.55"/></filter>
<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="9"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .45  0 0 0 0 .3  0 0 0 .9 -.3"/></filter>
<filter id="blur"><feGaussianBlur stdDeviation="5"/></filter><filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity=".18"/></filter></defs>
{''.join(G)}{''.join(soft(s) for _,s in B)}<rect width="1600" height="1000" fill="url(#sun)" style="mix-blend-mode:soft-light"/><rect width="1600" height="1000" filter="url(#paper)" opacity=".35" style="mix-blend-mode:multiply"/><rect width="1600" height="1000" filter="url(#grain)" opacity=".5" style="mix-blend-mode:multiply"/>{''.join(L)}</svg>'''
open('nv5.html','w').write(html)
