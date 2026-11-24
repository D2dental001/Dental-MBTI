import math
A=math.radians(14); CX,CY=830,560; K=.78
def P(x,y): x*=K;y*=K; return (CX+x*math.cos(A)-y*math.sin(A), CY+x*math.sin(A)+y*math.cos(A))
def poly(pts,**k):
    d=' '.join(f'{a:.1f},{b:.1f}' for a,b in (P(*p) for p in pts))
    at=' '.join(f'{kk.replace("_","-")}="{v}"' for kk,v in k.items()); return f'<polygon points="{d}" {at}/>'
def rect(x0,y0,x1,y1,**k): return poly([(x0,y0),(x1,y0),(x1,y1),(x0,y1)],**k)
def line(pts,**k):
    d='M'+' L'.join(f'{a:.1f} {b:.1f}' for a,b in (P(*p) for p in pts))
    at=' '.join(f'{kk.replace("_","-")}="{v}"' for kk,v in k.items()); return f'<path d="{d}" fill="none" {at}/>'
def T(x,y,s,size=20,w=500,fill="#5b4d43",anchor="middle",rot=False,cls="",extra=""):
    a,b=P(x,y); r=f' transform="rotate(14 {a:.1f} {b:.1f})"' if rot else ''
    c=f' class="{cls}"' if cls else ''
    return f'<text x="{a:.1f}" y="{b:.1f}" font-size="{size}" font-weight="{w}" fill="{fill}" text-anchor="{anchor}"{r}{c} {extra}>{s}</text>'
o=[]
# background blocks (north)
for b in [(-1000,-60,-700,-260),(-680,-60,-440,-250),(-1000,-290,-700,-520),(-680,-280,-440,-520),(-420,-280,-280,-520),(210,-290,520,-520),(540,-60,800,-260),(820,-60,1100,-260),(540,-290,1100,-520),
          (-1000,60,-640,260),(-620,60,-300,260),(-280,60,0,300),(30,90,250,300),(330,60,620,260),(640,60,1100,260),(-1000,290,-300,600),(-280,330,250,600)]:
    o.append(rect(*b,fill="#ebe3d6",rx=0))
# roads
o.append(rect(-260,-60,-238,-700,fill="#fffaf2"))   # alley between KFC & Hyundai
o.append(rect(120,-60,195,-800,fill="#fffaf2"))      # 연세로
o.append(line([(157,-80),(157,-780)],stroke="#e3d6c3",stroke_width=3,stroke_dasharray="16 14"))
o.append(rect(270,60,330,700,fill="#fffaf2"))        # south road (서강로 방향)
o.append(rect(-1200,-60,1300,60,fill="#fffaf2"))      # 신촌로
o.append(line([(-1200,-60),(1300,-60)],stroke="#ddd0bd",stroke_width=2)); o.append(line([(-1200,60),(1300,60)],stroke="#ddd0bd",stroke_width=2))
o.append(line([(-1200,0),(1300,0)],stroke="#e3d6c3",stroke_width=3,stroke_dasharray="22 18"))
# crosswalks
for xc in (-249,157):
    for k in range(5): o.append(rect(xc-30+k*13,-75,xc-24+k*13,-62,fill="#eadfce"))
# subway line 2 + station
o.append(line([(-1200,22),(1300,22)],stroke="#00a84d",stroke_width=10,stroke_linecap="round",opacity=".16"))
o.append(line([(-1200,22),(1300,22)],stroke="#00a84d",stroke_width=3,stroke_dasharray="2 12",stroke_linecap="round",opacity=".8"))
o.append(rect(90,8,640,40,fill="#00a84d",opacity=".22"))
# buildings
o.append(rect(-440,-62,-282,-250,fill="#2e2622",filter="url(#sh)"))           # KFC/e-star building
o.append(rect(-440,-62,-282,-92,fill="#c8102e"))
o.append(rect(-216,-62,100,-360,fill="#5a4a40",filter="url(#sh)"))            # Hyundai
o.append(rect(-216,-62,100,-84,fill="#46392f"))
o.append(rect(212,-420,520,-700,fill="#d9cfc0"))                              # U-PLEX
o.append(rect(210,-62,520,-260,fill="#e4dacb"))                               # olive young block
# walking route
o.append(line([(232,-90),(232,-104),(-300,-104),(-300,-92)],stroke="#b8925a",stroke_width=5,stroke_linecap="round",stroke_linejoin="round",stroke_dasharray="1 11"))
# labels
o.append(T(-58,-200,"현대백화점",40,700,"#f4eee5",cls="sr"))
o.append(T(-58,-160,"신촌점",22,500,"#d8c7ad"))
o.append(T(366,-560,"현대유플렉스",22,500,"#8c7a66"))
o.append(T(365,-150,"올리브영",19,500,"#a7967f"))
o.append(T(-361,-150,"KFC",26,700,"#fff"))
o.append(T(-361,-118,"건물",16,500,"#e8d9bf"))
o.append(T(-640,-14,"신 촌 로",32,700,"#8c7a66",rot=True))
o.append(T(-1010,-14,"← 홍대 · 신촌로터리",20,500,"#a7967f",anchor="start",rot=True))
o.append(T(1020,-14,"이대 · 아현 →",22,500,"#a7967f",anchor="end",rot=True))
o.append(T(157,-830,"↑ 연세로 · 연세대",22,500,"#8c7a66"))
o.append(T(300,740,"서강로 ↓",20,500,"#a7967f"))
# station pill
sx,sy=P(460,150)
o.append(f'<g transform="translate({sx-150:.0f} {sy-26:.0f})"><rect width="300" height="52" rx="26" fill="#00a84d"/><circle cx="27" cy="26" r="17" fill="#fff"/><text x="27" y="33" text-anchor="middle" font-size="20" font-weight="700" fill="#00a84d">2</text><text x="54" y="34" font-size="23" font-weight="700" fill="#fff">신촌역 (지하)</text></g>')
# exits
def ex(x,y,n,main=False):
    a,b=P(x,y)
    if main: return f'<g transform="translate({a:.0f} {b:.0f})"><rect x="-28" y="-28" width="56" height="56" rx="14" fill="#00a84d" filter="url(#sh)"/><text y="11" text-anchor="middle" font-size="32" font-weight="700" fill="#fff">{n}</text></g>'
    return f'<g transform="translate({a:.0f} {b:.0f})" opacity=".55"><circle r="15" fill="#fff" stroke="#00a84d" stroke-width="2.5"/><text y="6" text-anchor="middle" font-size="16" font-weight="700" fill="#00a84d">{n}</text></g>'
o+= [ex(60,78,8),ex(420,-80,2),ex(600,-74,4),ex(650,80,5),ex(232,-80,1,True)]
a,b=P(232,-80); o.append(f'<g transform="translate({a+44:.0f} {b+4:.0f})"><rect x="0" y="-19" width="118" height="38" rx="19" fill="#00a84d"/><text x="59" y="7" text-anchor="middle" font-size="19" font-weight="700" fill="#fff">1번 출구</text></g>')
# route note
a,b=P(-60,-10); o.append(f'<g transform="translate({a:.0f} {b:.0f}) rotate(14)"><rect x="-150" y="-44" width="300" height="34" rx="17" fill="#2e2622"/><text y="-20" text-anchor="middle" font-size="17" font-weight="700" fill="#e9d6b2">현대백화점 앞을 지나 서쪽으로 직진</text></g>')
# pin + callout with floor stack
px,py=P(-361,-250)
o.append(f'<g transform="translate({px:.0f} {py-6:.0f})"><path d="M0 0C-24-30-36-46-36-66a36 36 0 0 1 72 0c0 20-12 36-36 66z" fill="#c9a876" stroke="#2e2622" stroke-width="3"/><circle cy="-66" r="13" fill="#2e2622"/></g>')
cx,cy=60,60
o.append(f'''<g transform="translate({cx:.0f} {cy:.0f})"><rect width="330" height="250" rx="16" fill="#fff" filter="url(#sh)"/>
<text x="24" y="44" class="it" font-size="26" fill="#b8925a">e-Star Dental Clinic</text>
<text x="24" y="78" font-size="22" font-weight="700" fill="#2e2622">신촌로 79, KFC 건물 3층</text>
<g transform="translate(24 98)"><rect width="282" height="40" rx="6" fill="url(#gold)"/><text x="14" y="27" class="sr" font-size="20" fill="#2e2622">3F</text><text x="60" y="27" class="sr" font-size="20" fill="#2e2622">e-스타치과</text>
<rect y="46" width="282" height="34" rx="6" fill="#efe9df"/><text x="14" y="69" font-size="16" font-weight="700" fill="#a7967f">2F</text>
<rect y="86" width="282" height="40" rx="6" fill="#c8102e"/><text x="14" y="113" font-size="18" font-weight="700" fill="#fff">1F</text><text x="60" y="113" font-size="20" font-weight="700" fill="#fff">KFC 신촌역점</text></g></g>''')
o.append(f'<path d="M{cx+330:.0f} {cy+170:.0f}Q{px-20:.0f} {cy+190:.0f} {px-10:.0f} {py-80:.0f}" fill="none" stroke="#b8925a" stroke-width="2" stroke-dasharray="4 6"/>')
# info card bottom-left
o.append('''<g transform="translate(50 770)"><rect width="560" height="196" rx="14" fill="#fff" filter="url(#sh)"/>
<text x="30" y="44" class="it" font-size="28" fill="#b8925a">How to find us</text>
<text x="30" y="88" font-size="25" font-weight="700" fill="#2e2622">2호선 신촌역 1번 출구로 나와</text>
<text x="30" y="124" font-size="22" fill="#5b4d43">현대백화점 앞을 지나 서쪽으로 직진</text>
<text x="30" y="158" font-size="22" fill="#5b4d43">골목 건너 KFC 건물 3층이 e-스타치과</text></g>''')
o.append('<g transform="translate(1530 80)"><circle r="34" fill="#fff" filter="url(#sh)"/><path d="M0-22l9 26H-9z" fill="#2e2622"/><text y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#8c7a66">N</text></g>')
o.append('<text x="1570" y="980" text-anchor="end" font-size="17" fill="#b3a38c">약도는 이해를 돕기 위한 그림으로 실제 축척과 다릅니다</text>')
head=open('head.svg').read()
open('map.html','w').write(head+'\n'.join(o)+'\n</svg>')
