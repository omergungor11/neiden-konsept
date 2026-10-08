import concurrent.futures, hashlib, json, pathlib, urllib.request
from PIL import Image
root = pathlib.Path('qa/H05/builder/responsive-evidence')
root.mkdir(exist_ok=True)
rows = [('971e82e195a66983','H7n1L97Ku2shlmdqtD0ivHx34Dk',512,[390,810,1440,1620]),('5081a3d1c8f20898','ntx4RF0pVgkv50EiHx03cgEVBeA',512,[390]),('b138d993b4500882','S5SlUxzXWxG7YPWY61P4MrOl23Q',512,[390]),('5081a3d1c8f20898','ntx4RF0pVgkv50EiHx03cgEVBeA',1024,[810,1440,1620]),('b138d993b4500882','S5SlUxzXWxG7YPWY61P4MrOl23Q',1024,[810,1440,1620])]
def download(row):
    asset_id,name,size,viewports=row
    url=f'https://framerusercontent.com/images/{name}.png?scale-down-to={size}&width=2400&height=1600'
    request=urllib.request.Request(url,headers={'Accept':'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8','User-Agent':'Mozilla/5.0'})
    with urllib.request.urlopen(request,timeout=45) as response:
        data=response.read(); mime=response.headers.get('Content-Type'); headers=dict(response.headers); final=response.url
    extension={'image/avif':'avif','image/webp':'webp','image/png':'png','image/jpeg':'jpg'}[mime]
    path=root/f'{hashlib.sha256(url.encode()).hexdigest()[:16]}.{extension}'
    path.write_bytes(data)
    with Image.open(path) as image: width,height=image.size
    return {'source_url':url,'canonicalAssetId':asset_id,'viewports':viewports,'local_evidence_path':str(path),'contentType':mime,'width':width,'height':height,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'response_headers':headers,'final_url':final}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: results=list(pool.map(download,rows))
(root/'responses.json').write_text(json.dumps(results,indent=2))
print(json.dumps([{k:r[k] for k in ['canonicalAssetId','viewports','local_evidence_path','contentType','width','height','sha256']} for r in results],indent=2))
