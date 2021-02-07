# Client for Seq2Seq-Vis

For just using the tool you don't need to do anything here.

If you want to change/customize the frontend, here are some short hints:

1) install `nodejs`
2) `cd client`
3) install dependencies and webpack: `node install`
4) run build: `npm run build` or live watch: `npm run watch`

Warning: the stack is from 2019 and requires some very specific webpack modules. 


Folder structure:
```
/assets, /css, /fonts ==> assets, styles, local fonts used
/ts/api         ==> calls to backend and return types
/ts/controller  ==> view controller meta classes
/ts/etc         ==> helpers
/ts/vis         ==> visualziation components (super-class: VisualComponent.ts)```
