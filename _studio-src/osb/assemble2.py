import os,re
B=os.path.dirname(os.path.abspath(__file__));S=os.path.dirname(B)
r=lambda p:open(p,encoding='utf-8').read()
html=r(f'{B}/shell2.html');guide=r(f'{B}/guide.js')
gcss=re.search(r'const GUIDE_CSS = `(.*?)`;',guide,re.S).group(1)
for k,v in {'/*GUIDE_CSS*/':gcss,'/*THEMES*/':r(f'{B}/themes.js'),'/*GUIDE*/':guide,'/*BLOCKS*/':r(f'{B}/blocks.js')+'\n'+r(f'{B}/pages.js')+'\n'+r(f'{B}/balance.js')+'\n'+r(f'{B}/luxe.js')+'\n'+r(f'{B}/estar.js')+'\n'+r(f'{B}/modoo.js'),'/*APP*/':r(f'{B}/app2.js')}.items():
    assert k in html,k; html=html.replace(k,v.replace('</script>','<\\/script>'))
open(f'{S}/os/hp-studio.html','w',encoding='utf-8').write(html);print(os.path.getsize(f'{S}/os/hp-studio.html')//1024,'KB')
v=r(f'{B}/view.html')
for k,val in {'/*THEMES*/':r(f'{B}/themes.js'),'/*BLOCKS*/':r(f'{B}/blocks.js')+'\n'+r(f'{B}/pages.js')+'\n'+r(f'{B}/balance.js')+'\n'+r(f'{B}/luxe.js')+'\n'+r(f'{B}/estar.js')+'\n'+r(f'{B}/modoo.js')}.items():
    assert k in v,k; v=v.replace(k,val.replace('</script>','<\\/script>'))
open(f'{S}/os/hp-view.html','w',encoding='utf-8').write(v);print('view',os.path.getsize(f'{S}/os/hp-view.html')//1024,'KB')
