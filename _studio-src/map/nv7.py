import re
import math,random
random.seed(11)
K=2.5; X0,Y0=205,95; SQ=.78; OYS=300
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

G.append('<rect width="1600" height="1000" fill="#ecebe6"/>')
# ---------- roads (traced from naver map, original px)
SR=[(-40,108),(0,128),(230,245),(400,312),(520,358),(650,390),(800,380),(983,325),(1040,300)]
def srpt(x,off):
    for (xa,ya),(xb,yb) in zip(SR,SR[1:]):
        if xa<=x<=xb:
            t=(x-xa)/(xb-xa); L_=math.hypot(xb-xa,yb-ya); nx,ny=-(yb-ya)/L_,(xb-xa)/L_
            return (xa+(xb-xa)*t+nx*off, ya+(yb-ya)*t+ny*off)
EX1=srpt(571,-58)
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
for l,w in roads: G.append(path(l,'#ead7cc',w+14))
for l,w in roads: G.append(path(l,'#f3dfd5' if w==14 and l[0]==(516,330) else ('#f7f3ee' if w<30 else '#8f94a1'),w))
G.append(path(SR,'#8f94a1',92))
G.append(path(SR,'#eccb7e',1.6,'stroke-dasharray="14 16"'))
for off in (-24,24):
    q=[(x,y+off) for x,y in SR]; G.append(path(q,'#ffffff',1.2,'stroke-dasharray="8 12" opacity=".9"'))
G.append(path([(343,262),(371,190),(398,128),(418,0),(424,-20)],'#979cab',30)); G.append(path([(343,262),(371,190),(398,128),(418,0),(424,-20)],'#ffffff',1.2,'stroke-dasharray="8 12"'))
# subway line 2 + station platform
G.append(path([(0,150),(230,262),(460,372),(560,400),(650,412),(760,405),(880,385),(983,340)],'#00a84d',3,'opacity=".35"'))

# crosswalks
def cw(cx,cy,dx,dy,ln,wd):
    m=math.hypot(dx,dy); dx,dy=dx/m,dy/m
    a=P(cx-dx*ln/2,cy-dy*ln/2); b=P(cx+dx*ln/2,cy+dy*ln/2)
    G.append(f'<path d="M{a[0]:.1f} {a[1]:.1f}L{b[0]:.1f} {b[1]:.1f}" stroke="#fff" stroke-width="{wd*K:.1f}" stroke-dasharray="{1.6*K:.1f} {1.6*K:.1f}" fill="none" opacity=".95"/>')
cw(352,246,1,.38,36,10); cw(518,334,1,.3,15,9); cw(652,356,1,.1,20,10); cw(438,318,-.36,1,90,12); cw(606,382,-.22,1,90,12)
# ---------- buildings (footprint polygons, height)
def bld(fp,h,wall,roof,win=None,ex_roof='',key=None):
    q0=[P(x,y,0) for x,y in fp]; q1=[P(x,y,h) for x,y in fp]
    s=[poly([(a+14,b+10) for a,b in q0],'rgba(70,80,100,.18)','filter="url(#blur)"')]
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
pal=[('#eef0f3','#fafbfc','#9fb3c8'),('#e9ecef','#f7f8fa','#a7b5a0'),('#f1efec','#fbfaf8','#c9a98f'),('#e6e9ee','#f6f7f9','#8fa6bf'),('#f2eee8','#fcfaf7','#b9a387'),('#ebeef2','#f9fafb','#a3aec2')]
_old=[('#ffe6dc','#fff4ef','#ff9f8a'),('#dff3ea','#f2fbf6','#5cc4a0'),('#e3ecfb','#f4f8ff','#7aa7e8'),('#eee6fb','#f8f4ff','#a98be0'),('#fff3d6','#fffaee','#ffc24d'),('#f4f1ec','#ffffff','#f28a6b')]
def cute(fp,h,wall,roof,acc):
    q0=[P(x,y,0) for x,y in fp]; q1=[P(x,y,h) for x,y in fp]
    s=[poly([(a+14,b+10) for a,b in q0],'rgba(70,80,100,.16)','filter="url(#blur)"')]
    (x0,y0),(x1,_),(_,y1)=fp[0],fp[1],fp[2]
    # east wall
    s.append(poly(W((x1,y1),(x1,y0),0,1,0,h),wall,'stroke="#fff" stroke-width="2" stroke-linejoin="round" style="filter:brightness(.9)"'))
    s.append(poly(W((x0,y1),(x1,y1),0,1,0,h),wall,'stroke="#fff" stroke-width="2" stroke-linejoin="round"'))
    S0,S1=(x0,y1),(x1,y1); n=max(2,int((x1-x0)/8)); fl=max(1,int((h-5)/5))
    # storefront
    s.append(poly(W(S0,S1,.06,.94,.6,4.2),'#dcecf6'))
    s.append(poly(W(S0,S1,.38,.52,.6,4.2),'#7c8aa0'))
    aw=W(S0,S1,.02,.98,4.2,5.4); s.append(poly(aw,acc,'stroke="#fff" stroke-width="1.2"'))
    for k in range(1,9,2): s.append(poly(W(S0,S1,.02+.96*k/9,.02+.96*(k+1)/9,4.2,5.4),'#ffffff',' opacity=".55"'))
    for f in range(fl):
        z0=6.4+f*5; z1=z0+3.2
        if z1>h-1: break
        for j in range(n):
            t0=(j+.25)/n; t1=(j+.75)/n
            s.append(poly(W(S0,S1,t0-.02,t1+.02,z0-.5,z1+.5),'#ffffff'))
            s.append(poly(W(S0,S1,t0,t1,z0,z1),random.choice(['#f6dfa6','#cfe4f2']) if random.random()<.3 else '#b9d4e8'))
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
special=[(262,148,352,240),(350,120,530,312),(540,-10,650,50),(470,350,900,440)]
def in_special(x0,y0,x1,y1):
    return any(x0<c and x1>a and y0<d and y1>b for a,b,c,d in special)
trees=[]
for gy in range(-10,640,46):
    for gx in range(60,960,44):
        w=random.uniform(26,38); d=random.uniform(22,34)
        x0,y0=gx+random.uniform(-3,3),gy+random.uniform(-3,3); x1,y1=x0+w,y0+d
        if any(near_road(x,y,0) for x,y in [(x0,y0),(x1,y0),(x0,y1),(x1,y1),((x0+x1)/2,(y0+y1)/2)]) or in_special(x0,y0,x1,y1): continue
        if random.random()<.2:
            G.append(poly([P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)],'#d3e6c0','stroke="#c2d8ac" stroke-width="1"')); trees.append(((x0+x1)/2,(y0+y1)/2,12)); continue
        wall,roof,acc=random.choice(pal); h=random.uniform(11,21)
        cute([(x0,y0),(x1,y0),(x1,y1),(x0,y1)],h,wall,roof,acc)
# U-PLEX
cute([(548,-8),(640,-8),(640,48),(548,48)],34,'#ece9f3','#f8f7fb','#a99bc8')
# 올리브영 block
cute([(552,238),(634,238),(634,292),(552,292)],24,'#f1efec','#fbfaf8','#c9a98f')

SW_='stroke="rgba(90,60,40,.18)" stroke-width="1.2" stroke-linejoin="round"'
# ---------- 현대백화점: 연회색 타일 외벽 + 검은 화강석 포털 + 세로 유리띠 + 동쪽 유리 커튼월
HF=[(415,130),(522,180),(497,295),(362,245)]; HH=70
hs=[poly([(a+18,b+12) for a,b in [P(x,y) for x,y in HF]],'rgba(70,80,100,.22)','filter="url(#blur)"')]
plaza=[(362,247),(497,297),(494,306),(358,256)]
hs.append(poly([P(x,y) for x,y in plaza],'#e6d3c8'))
S0,S1=HF[3],HF[2]; E0_,E1_=HF[2],HF[1]
def tiles(p0,p1,base,dark):
    o=[poly(W(p0,p1,0,1,0,HH),base)]
    for k in range(1,int(HH/4.4)): z=k*4.4; o.append(poly(W(p0,p1,0,1,z-.07,z+.07),dark))
    n=int(math.hypot(p1[0]-p0[0],p1[1]-p0[1])/5.5)
    for k in range(1,n): t=k/n; o.append(poly(W(p0,p1,t-.0015,t+.0015,0,HH),dark))
    return o
hs+=tiles(S0,S1,'url(#tileS)','rgba(120,128,138,.2)')
hs+=tiles(E0_,E1_,'url(#tileE)','rgba(100,108,118,.22)')
# 정면 세로 유리띠(사선 돌출창)
for t in (.12,.27,.73,.88):
    hs.append(poly(W(S0,S1,t-.012,t+.012,HH*.42,HH*.9),'url(#vglass)'))
    hs.append(poly(W(S0,S1,t+.008,t+.014,HH*.42,HH*.9),'#ffffff',' opacity=".7"'))
# 꼭대기 유리 띠
hs.append(poly(W(S0,S1,.38,.92,HH*.9,HH*.985),'url(#vglass)'))
for k in range(1,12): t=.38+.54*k/12; hs.append(poly(W(S0,S1,t-.002,t+.002,HH*.9,HH*.985),'#ffffff',' opacity=".6"'))
# 검은 화강석 포털 + 안쪽 유리 + 회색 석재 입구
hs.append(poly(W(S0,S1,.2,.8,0,HH*.4),'#2a2c30'))
hs.append(poly(W(S0,S1,.24,.76,0,HH*.36),'url(#portal)'))
hs.append(poly(W(S0,S1,.36,.66,0,HH*.29),'#c3c6ca'))
for zz in (HH*.08,HH*.15,HH*.22):
    for k in range(6): t=.39+k*.05; hs.append(poly(W(S0,S1,t,t+.006,zz,zz+.5),'#4a4d52'))
hs.append(poly(W(S0,S1,.42,.6,0,HH*.12),'#1f2124'))
hs.append(poly(W(S0,S1,.44,.58,0,HH*.095),'url(#warm)'))
for k in range(1,5): t=.44+.14*k/5; hs.append(poly(W(S0,S1,t-.002,t+.002,0,HH*.095),'#3a3530'))
# 동쪽 면: 모서리 청록 유리 커튼월 + 1층 검은 차양
hs.append(poly(W(E0_,E1_,.8,1,0,HH),'url(#teal)'))
for k in range(1,14): z=k*HH/14; hs.append(poly(W(E0_,E1_,.8,1,z-.12,z+.12),'#ffffff',' opacity=".35"'))
for t0 in (.25,.45): hs.append(poly(W(E0_,E1_,t0,t0+.15,HH*.07,HH*.11),'#2a2c30'))
# 옥상
top=[P(x,y,HH) for x,y in HF]; hs.append(poly(top,'#e9eaec'))
hs.append(poly([P(x,y,HH) for x,y in inset(HF,.06)],'#dcdee1'))
hs.append(poly([P(x,y,HH) for x,y in inset(HF,.09)],'#eceef0'))
B.append((238,''.join(hs)))

# U-PLEX
cute([(548,-8),(640,-8),(640,48),(548,48)],34,'#ece9f3','#f8f7fb','#a99bc8')
cute([(552,238),(634,238),(634,292),(552,292)],24,'#f1efec','#fbfaf8','#c9a98f')
# ---------- e-스타 건물: 회색 기단 + 빨간 테두리 KFC층 + e-스타치과 간판 + 삼각 패턴 유리 외벽
KF=[(289.5,162.3),(343.5,182.3),(334,226),(280,206)]; KH=86
ks=[poly([(a+20,b+12) for a,b in [P(x,y) for x,y in KF]],'rgba(70,80,100,.26)','filter="url(#blur)"')]
Z1,Z2,Z3=7,26,36
faces=[(KF[3],KF[2],1.0),(KF[2],KF[1],.86)]
random.seed(5)
for p0,p1,br in faces:
    g=[]
    # 1층 회색 석재 기단
    g.append(poly(W(p0,p1,0,1,0,Z1),'#c8cacd'))
    g.append(poly(W(p0,p1,0,1,Z1-.5,Z1),'#9ea2a7'))
    # KFC 매장층: 짙은 회색 벽 + 모서리 유리창
    g.append(poly(W(p0,p1,0,1,Z1,Z2),'#3b3c40'))
    for k in range(1,9): g.append(poly(W(p0,p1,0,1,Z1+k*2.1-.06,Z1+k*2.1+.06),'#2f3034'))
    cor=(.5,.97) if p0==KF[3] else (.03,.5)
    for z0,z1 in ((Z1+1.2,Z1+8),(Z1+11,Z2-1.2)):
        g.append(poly(W(p0,p1,cor[0],cor[1],z0,z1),'url(#kwin)'))
        for k in range(1,4): t=cor[0]+(cor[1]-cor[0])*k/4; g.append(poly(W(p0,p1,t-.004,t+.004,z0,z1),'#2a2b2e'))
    g.append(poly(W(p0,p1,cor[0],cor[1],Z1+8,Z1+11),'#2c2d31'))
    # 빨간 테두리(위·양옆)
    g.append(poly(W(p0,p1,0,1,Z2-1,Z2+.2),'#e1251b'))
    g.append(poly(W(p0,p1,0,.025,Z1,Z2),'#e1251b'))
    g.append(poly(W(p0,p1,.975,1,Z1,Z2),'#e1251b'))
    # 3층 이상: 삼각형 패턴 유리 외벽
    nt,nz=6,8; zh=(KH-Z2)/nz
    pal_=['#e8f0f4','#d3e1ea','#f3f7f9','#bfd2df','#dce8ef','#a9c2d4']
    for a_ in range(nt):
        for b_ in range(nz):
            t0,t1=a_/nt,(a_+1)/nt; z0,z1=Z2+.2+b_*zh,Z2+.2+(b_+1)*zh
            pa=lambda t,z:P(p0[0]+(p1[0]-p0[0])*t,p0[1]+(p1[1]-p0[1])*t,z)
            tm=(t0+t1)/2
            tris=[[pa(t0,z0),pa(t1,z0),pa(tm,z1)],[pa(t0,z0),pa(tm,z1),pa(t0,z1)],[pa(t1,z0),pa(t1,z1),pa(tm,z1)]]
            for tr in tris: g.append(poly(tr,random.choice(pal_),'stroke="#ffffff" stroke-width="1.1" stroke-linejoin="round"'))
    # 3층 e-스타치과 층: 따뜻한 불빛
    g.append(poly(W(p0,p1,0,1,Z2+.2,Z3),'#ffd98a',' opacity=".38"'))
    # 위에서 아래로 빛 그라데이션
    g.append(poly(W(p0,p1,0,1,0,KH),'url(#wl)'))
    ks.append(f'<g style="filter:brightness({br})">'+''.join(g)+'</g>')
# 간판: 남쪽 면(신촌로 쪽) — KFC 글자, e-스타치과 원본 로고
def onwall(p0,p1,t,z):
    a=P(p0[0]+(p1[0]-p0[0])*t,p0[1]+(p1[1]-p0[1])*t,z); b=P(p1[0],p1[1],0); c=P(p0[0],p0[1],0)
    ux,uy=b[0]-c[0],b[1]-c[1]; m=math.hypot(ux,uy); return a,ux/m,uy/m
(a,b),ux,uy=onwall(KF[3],KF[2],.74,Z1+9.5)
ks.append(f'<text font-size="17" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="1" transform="matrix({ux:.4f} {uy:.4f} 0 1 {a:.1f} {b+6:.1f})">KFC</text>')
(a,b),ux,uy=onwall(KF[3],KF[2],.5,Z2+5.2)
ks.append(f'<g transform="matrix({ux:.4f} {uy:.4f} 0 1 {a:.1f} {b:.1f})"><rect x="-54" y="-14" width="108" height="28" rx="4" fill="#ffffff" opacity=".92"/><image href="elogo.png" x="-50" y="-12" width="100" height="24.3"/></g>')
# 모서리 기둥선
for p in (KF[2],):
    q0=P(p[0],p[1],0); q1=P(p[0],p[1],KH); ks.append(f'<path d="M{q0[0]:.1f} {q0[1]:.1f}L{q1[0]:.1f} {q1[1]:.1f}" stroke="#ffffff" stroke-opacity=".7" stroke-width="1.4"/>')
# 옥상
ks.append(poly([P(x,y,KH) for x,y in KF],'#e4e8ec'))
ks.append(poly([P(x,y,KH) for x,y in inset(KF,.1)],'#d3d9df'))
ks.append(poly([P(x,y,KH) for x,y in inset(KF,.14)],'#eef1f4'))
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
for x,y in along(SR[1:],-56,34,lambda x,y: 280<x<365 or 385<x<500 or 495<x<545 or 555<x<600 or 630<x<680 or x<40 or x>960): trees.append((x,y,10))
for x,y in along(SR[1:],56,36,lambda x,y: 455<x<520 or 560<x<720 or x<40 or x>960): trees.append((x,y,10))
for x,y in along([(516,330),(522,150),(528,0)],13,46,lambda x,y:y>300): trees.append((x,y,8))
for x,y in along([(371,190),(398,128),(418,0)],-24,44): trees.append((x,y,9))
def tree(x,y,r):
    bx,by=P(x,y,0); tx,ty=P(x,y,5); R=r*K*.6; g=random.choice(['t1','t2','t3'])
    blobs=[(-.55,-.55,.62),(.55,-.6,.62),(0,-1.15,.72),(-.3,-.95,.55),(.35,-1.0,.5),(0,-.45,.6)]
    o=f'<ellipse cx="{bx+R*.7:.1f}" cy="{by+2:.1f}" rx="{R*1.15:.1f}" ry="{R*.42:.1f}" fill="rgba(60,80,50,.2)" filter="url(#blur2)"/><rect x="{tx-2.6:.1f}" y="{ty-R*.4:.1f}" width="5.2" height="{by-ty+R*.4:.1f}" rx="2.6" fill="#8b6a4e"/>'
    o+=f'<g>'+''.join(f'<circle cx="{tx+dx*R:.1f}" cy="{ty+dy*R:.1f}" r="{rr*R:.1f}" fill="url(#{g})"/>' for dx,dy,rr in blobs)
    o+=f'<circle cx="{tx-R*.35:.1f}" cy="{ty-R*1.3:.1f}" r="{R*.28:.1f}" fill="#d9f0a8" opacity=".55"/><circle cx="{tx-R*.75:.1f}" cy="{ty-R*.75:.1f}" r="{R*.18:.1f}" fill="#d9f0a8" opacity=".45"/></g>'
    B.append((y+.5,o))
for x,y,r in trees: tree(x,y,r)
B.sort(key=lambda t:t[0])
# ---------- route
R_=[(EX1[0]-16,EX1[1]+2)]+[srpt(x,-53) for x in (540,500,460,420,380)]+[(366,244),(338,232),(326,228)]
q=[P(*p) for p in R_]; d='M'+' L'.join(f'{a:.1f} {b:.1f}' for a,b in q)
L.append(f'<path d="{d}" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/><path d="{d}" fill="none" stroke="#c9932f" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 13"/>')
ax,ay=q[-1]; L.append(f'<path d="M{ax+20:.1f} {ay-6:.1f}L{ax:.1f} {ay:.1f}L{ax+15:.1f} {ay+15:.1f}" stroke="#c9932f" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
# exits (naver style yellow numbered)
def entrance(x,y,n,big=False,face=1):
    # small glass entrance pavilion: footprint 16x9, opening faces south(face=1) or north(-1)
    w,d,h=(15,6.5,13) if big else (11,6,10)
    fp=[(x-w,y-d),(x+w,y-d),(x+w,y+d),(x-w,y+d)]
    o=[poly([(a+12,b+9) for a,b in [P(*p) for p in fp]],'rgba(70,80,100,.24)','filter="url(#blur)"')]
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
entrance(EX1[0],EX1[1],1,True)
for n,xx,off in [(2,640,-66),(4,742,-66),(8,495,64),(5,808,64)]:
    a,b=P(*srpt(xx,off)); L.append(f'<g transform="translate({a:.1f} {b:.1f})" filter="url(#sh)"><circle r="17" fill="#ffd21f" stroke="#3b3b3b" stroke-width="2"/><text y="7" font-size="20" font-weight="900" text-anchor="middle" fill="#222">{n}</text></g>')
a,b=P(EX1[0],EX1[1]+8,0); L.append(f'<g transform="translate({a-190:.1f} {b+30:.1f})"><rect y="-21" width="124" height="42" rx="21" fill="#3b2a22"/><text x="62" y="8" font-size="21" font-weight="800" text-anchor="middle" fill="#ffd21f">1번 출구</text></g>')
# labels
def roadlabel(x,y,txt,ang,size=30,bg='#5d6678'):
    a,b=P(x,y,0); return f'<text x="{a:.1f}" y="{b+size*.35:.1f}" font-size="{size}" font-weight="900" fill="#fff" text-anchor="middle" stroke="{bg}" stroke-width="7" paint-order="stroke" transform="rotate({ang} {a:.1f} {b:.1f})">{txt}</text>'
L.append(roadlabel(236,272,'신촌로',22,28,'#7a6f66'))
a,b=P(414,40,0); L.append(f'<g transform="translate({a:.1f} {b:.1f}) rotate(-80)"><rect x="-62" y="-19" width="124" height="38" rx="19" fill="#5a4436"/><text y="8" font-size="21" font-weight="800" text-anchor="middle" fill="#fff">연세로</text></g>')
a,b=P(452,212,HH); L.append(f'<text x="{a:.1f}" y="{b:.1f}" font-size="38" font-weight="900" text-anchor="middle" fill="#4a3d36">현대백화점</text><text x="{a:.1f}" y="{b+42:.1f}" font-size="28" font-weight="800" text-anchor="middle" fill="#4a3d36">신촌점</text>')
a,b=P(594,48,34); L.append(f'<text x="{a:.1f}" y="{b+6:.1f}" font-size="19" font-weight="800" text-anchor="middle" fill="#5a4436" stroke="#fff8ee" stroke-width="5" paint-order="stroke">현대유플렉스</text>')
a,b=P(690,420,0); L.append(f'<g transform="translate({a-140:.1f} {b-30:.1f})" filter="url(#sh)"><rect width="280" height="72" rx="36" fill="#00a84d" stroke="#fff" stroke-width="4"/><circle cx="38" cy="36" r="23" fill="#fff"/><text x="38" y="45" font-size="26" font-weight="900" text-anchor="middle" fill="#00a84d">2</text><text x="74" y="48" font-size="32" font-weight="900" fill="#fff">신촌역</text><text x="186" y="46" font-size="20" font-weight="800" fill="#d6f5e2">2호선</text></g>')
# pin + logo label
a,b=P(311.7,194,KH)
L.append(f'<g transform="translate({a:.1f} {b-4:.1f})"><path d="M0 0C-22-28-34-42-34-62a34 34 0 0 1 68 0c0 20-12 34-34 62z" fill="url(#pin)" stroke="#fff" stroke-width="4"/><circle cy="-62" r="14" fill="#d8b46a"/><circle cy="-62" r="7" fill="#fff8e8"/></g>')
L.append(f'<g transform="translate({a-205:.1f} {b-262:.1f})" filter="url(#sh)"><rect width="410" height="132" rx="30" fill="#fff" stroke="#c9a35b" stroke-width="3"/><image href="elogo.png" x="28" y="18" width="354" height="86"/><rect x="133" y="104" width="144" height="50" rx="25" fill="#3b2a22" stroke="#fff" stroke-width="4"/><text x="205" y="138" font-size="25" font-weight="900" text-anchor="middle" fill="#fff">3층</text></g>')
L.append(f'<path d="M{a:.1f} {b-108:.1f}L{a:.1f} {b-100:.1f}" stroke="#c9a35b" stroke-width="3"/>')
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
<linearGradient id="wl" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".45"/><stop offset=".7" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#4a5568" stop-opacity=".2"/></linearGradient>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="4" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .18  0 0 0 1.4 -.55"/></filter>
<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="9"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .45  0 0 0 0 .3  0 0 0 .9 -.3"/></filter>
<radialGradient id="t1" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#a9dc6e"/><stop offset=".6" stop-color="#6bb04a"/><stop offset="1" stop-color="#3f8236"/></radialGradient>
<radialGradient id="t2" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#b8e27a"/><stop offset=".6" stop-color="#76b851"/><stop offset="1" stop-color="#47893a"/></radialGradient>
<radialGradient id="t3" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#9fd46a"/><stop offset=".6" stop-color="#5fa446"/><stop offset="1" stop-color="#367532"/></radialGradient>
<filter id="blur2"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="rough" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2.4"/></filter>
<pattern id="tile" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="none"/><path d="M0 .5H14M.5 0V14" stroke="#ffffff" stroke-opacity=".45" stroke-width="1"/></pattern>
<linearGradient id="tileS" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#eef0f2"/><stop offset="1" stop-color="#d4d8dc"/></linearGradient>
<linearGradient id="tileE" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d9dde1"/><stop offset="1" stop-color="#bfc4ca"/></linearGradient>
<linearGradient id="vglass" x1="0" x2="1"><stop offset="0" stop-color="#9fc3dc"/><stop offset=".5" stop-color="#d8ebf6"/><stop offset="1" stop-color="#7ea8c6"/></linearGradient>
<linearGradient id="portal" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#cfe2ef"/><stop offset=".5" stop-color="#7e9fb8"/><stop offset="1" stop-color="#4f6e86"/></linearGradient>
<linearGradient id="teal" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#a9d5d2"/><stop offset=".5" stop-color="#6fb0ad"/><stop offset="1" stop-color="#4f8f90"/></linearGradient>
<linearGradient id="kwin" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#8fa9c8"/><stop offset=".55" stop-color="#4c5f80"/><stop offset="1" stop-color="#ffd59a"/></linearGradient>
<filter id="blur"><feGaussianBlur stdDeviation="5"/></filter><filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity=".18"/></filter></defs>
<g filter="url(#rough)">{''.join(G)}</g><g filter="url(#rough)">{''.join(soft(s) for _,s in B)}</g><rect width="1600" height="1000" fill="url(#sun)" opacity=".45" style="mix-blend-mode:soft-light"/><rect width="1600" height="1000" filter="url(#grain)" opacity=".22" style="mix-blend-mode:multiply"/>{''.join(L)}</svg>'''
open('nv7.html','w').write(html)
