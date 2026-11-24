import numpy as np, subprocess
from PIL import Image, ImageFilter, ImageOps, ImageEnhance
W,H,FPS=1920,1080,30; SCN=5.0; XF=1.2
CW,CH=2112,1188  # canvas 1.1x
def comp(im, fill=0.92):
    im=im.convert('RGB')
    bg=ImageOps.fit(im,(CW,CH),Image.LANCZOS).filter(ImageFilter.GaussianBlur(42))
    bg=ImageEnhance.Brightness(bg).enhance(.62)
    k=min(CW*fill/im.width, CH*fill/im.height); w,h=int(im.width*k),int(im.height*k)
    fg=im.resize((w,h),Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.4,45,2))
    m=np.ones((h,w),np.float32); f=int(min(w,h)*.10)
    r=np.linspace(0,1,f)**1.6
    m[:, :f]*=r[None,:]; m[:, -f:]*=r[::-1][None,:]; m[:f,:]*=r[:,None]; m[-f:,:]*=r[::-1][:,None]
    bg.paste(fg,((CW-w)//2,(CH-h)//2),Image.fromarray((m*255).astype('uint8')))
    return bg
U='up/'
src=[
 (comp(Image.open('../v5/src/tmjDevice.jpg').crop((0,900,3600,3000)),1.0),(1.10,.5,.5),(1.0,.5,.5)),
 (comp(Image.open(U+'tour8.png')),(1.0,.46,.5),(1.06,.54,.5)),
 (comp((lambda c:c.crop((70,0,c.width,c.height)))(Image.open(U+'care.png')),.94),(1.08,.5,.5),(1.0,.5,.5)),
 (comp(Image.open(U+'tour4.png')),(1.04,.54,.5),(1.04,.46,.5)),
 (comp(Image.open(U+'smile2.png'),.86),(1.0,.5,.5),(1.06,.5,.5)),
 (comp(Image.open(U+'tour5.png')),(1.06,.5,.5),(1.0,.5,.5)),
 (comp(Image.open(U+'tour1.png')),(1.0,.5,.5),(1.07,.5,.48)),
 (comp(Image.open('../v5/src/building.png'),.96),(1.02,.5,.56),(1.02,.5,.44)),
]
yy,xx=np.mgrid[0:H,0:W]; vig=np.clip(1-0.32*(((xx-W/2)/(W/2))**2+((yy-H/2)/(H/2))**2)**1.3,0.6,1)[...,None].astype(np.float32)
def grade(a):
    a=a/255.*np.array([1.03,1.0,0.955],np.float32); a=(a-0.5)*1.05+0.5; a=a*vig
    return np.clip(a*255,0,255).astype(np.uint8)
def frame(c,t,s0,s1):
    e=t*t*(3-2*t); z,cx,cy=[a+(b-a)*e for a,b in zip(s0,s1)]
    # z = zoom relative to full canvas fitting frame; canvas is 1.1x -> view width = CW/1.1/z*... 
    vw=CW/1.1/z*1.0; vh=vw*H/W
    x0=min(max(cx*CW-vw/2,0),CW-vw); y0=min(max(cy*CH-vh/2,0),CH-vh)
    return np.asarray(c.transform((W,H),Image.EXTENT,(x0,y0,x0+vw,y0+vh),Image.BICUBIC),np.float32)
n=len(src); per=int(SCN*FPS); xf=int(XF*FPS); step=per-xf; total=step*n
ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart','-an','tmp2.mp4'],stdin=subprocess.PIPE)
for f in range(total):
    i=f//step; lf=f-i*step
    a=frame(src[i][0],lf/per,src[i][1],src[i][2])
    if lf<xf:
        j=(i-1)%n; b=frame(src[j][0],(step+lf)/per,src[j][1],src[j][2]); k=lf/xf; k=k*k*(3-2*k); a=a*k+b*(1-k)
    o=grade(a); ff.stdin.write(o.tobytes())
    if lf==step//2: Image.fromarray(o).save(f'c2_{i}.jpg',quality=85)
    if f==step//3: Image.fromarray(o).save('poster2.jpg',quality=88)
ff.stdin.close(); print('ffmpeg',ff.wait(),total/FPS)
