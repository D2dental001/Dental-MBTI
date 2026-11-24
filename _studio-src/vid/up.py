import cv2, sys, time
from cv2 import dnn_superres
sr=dnn_superres.DnnSuperResImpl_create(); sr.readModel('/tmp/edsr/models/EDSR_x2.pb'); sr.setModel('edsr',2)
jobs={'tour8':('../sd/sub/c01_04_roll_8.gif',(0,0,728,505)),'tour4':('../sd/sub/c01_04_roll_4.gif',(0,0,728,505)),'tour1':('../sd/sub/c01_04_roll_1.gif',(0,0,728,505)),'tour5':('../sd/sub/c01_04_roll_5.gif',(0,0,728,505)),'care':('../v3/skin.png',(1060,0,2000,560)),'bld':('../v5/src/building.png',None)}
from PIL import Image
import numpy as np
for n,(p,box) in jobs.items():
    t=time.time(); im=Image.open(p).convert('RGB')
    if box: im=im.crop(box)
    a=cv2.cvtColor(np.asarray(im),cv2.COLOR_RGB2BGR); o=sr.upsample(a); cv2.imwrite(f'up/{n}.png',o); print(n,o.shape,round(time.time()-t,1),flush=True)
