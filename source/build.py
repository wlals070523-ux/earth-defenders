import base64, json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
def b64(p):
    return "data:image/jpeg;base64," + base64.b64encode(open(p, "rb").read()).decode()
img = {"start": b64("assets/start.jpg"), "map": b64("assets/map.jpg"), "cel": b64("assets/celebrate.jpg")}
css = open("style.css", encoding="utf-8").read() + "\n" + open("extra.css", encoding="utf-8").read()
js = "\n".join(open(f, encoding="utf-8").read() for f in ["core.js", "heroes.js", "screens1.js", "worlds.js", "finale.js", "main.js"])
music = "data:audio/mpeg;base64," + base64.b64encode(open("assets/bgm.mp3","rb").read()).decode()
t = open("template.html", encoding="utf-8").read()
out = t.replace("/*CSS*/", css).replace("/*IMG*/", json.dumps(img)).replace("/*MUSIC*/", json.dumps(music)).replace("/*JS*/", js)
os.makedirs("dist", exist_ok=True)
open("dist/earth-defenders.html", "w", encoding="utf-8").write(out)
open("dist/game.js", "w", encoding="utf-8").write("const IMG={};const MUSIC=\"\";\n" + js)
print("built", len(out) // 1024, "KB")
