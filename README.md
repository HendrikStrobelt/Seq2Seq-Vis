# S2Splay

1) Install
```bash
git clone git@github.com:HendrikStrobelt/S2Splay.git
cd S2Splay
./setup.sh     #runs pip (server-side) and npm (client-side)
```

- checkout OpenNMT and start the OpenMNT Server: `th tools/rest_translation_server.lua  -model onmt_baseline_wmt15-all.en-de_epoch13_7.19_release.t7 -withAttn`

- Start Vis Server: `S2SPlay:> python server.py --port 8080`

- Enjoy-- localhost:8080/client/S2SAttn.html
