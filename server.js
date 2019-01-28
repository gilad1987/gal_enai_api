const express = require('express');
const app = express();
var mammoth = require("mammoth");

async function getList(parent) {

    let ul = `<ul style="direction: rtl; text-align: right;">`;

    if (parent.children && parent.children.length) {
        for (const child of parent.children) {

            if (child.type === 'directory') {

                const _ul = await getList(child);
                ul += `<li><div>${child.name == parent.name ? '' : child.name}</div>${_ul}</li>`;
            }
            let htmlPage;
            if (child.type === 'file' && child.name!=='.DS_Store') {
                try {
                    htmlPage = await mammoth.convertToHtml({path: child.path});
                } catch (e) {
                    console.log(child.path);
                    console.log("==========");
                    console.log(child);
                    console.log("==========");
                    console.log(e);
                }
                // const li = `<li><div class="name"> ${child.name.split('.')[0]}</div><div class="content" style="display: none;"></div></li>`;
                const li = `<li><div class="name"> ${child.name.split('.')[0]}</div><div class="content" style="display: none;">${htmlPage.value}</div></li>`;
                ul += li;

            }

        }
    }

    ul += `</ul>`;
    return await ul;
}


app.get('/', async (req, res) => {
    const dirTree = require('directory-tree');
    const filteredTree = dirTree('./ginzburg_books');
    let html = '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body>';
    html += '<style>#tree{min-width: 30%;} .name{cursor: pointer;} body{direction: rtl} #content{    flex: 1 1 auto;} .wrapper{ display: flex; }</style><div class="wrapper"><div id="tree">';
    try {
        html += await getList(filteredTree);

    } catch (e) {
        console.log(e);
    }
    html += '</div>';
    html += "<div style='position: relative'><div id='content' style='max-width: 600px; top:0;max-height: 100%; overflow-y: scroll;'>content</div></div></div><script>document.addEventListener('click',(e)=>{ const target = e.target; if(!target.classList.contains('name')) {return;} const content = target.nextSibling.innerHTML; if(content){ document.getElementById('content').innerHTML = content; } });</script>";

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(html);
    res.end();

});
app.get('/gal_enai', async (req, res) => {
    const dirTree = require('directory-tree');
    const filteredTree = dirTree('./ginzburg_books');
    let html = '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body>';
    html += '<style>#tree{min-width: 30%;} .name{cursor: pointer;} body{direction: rtl} #content{    flex: 1 1 auto;} .wrapper{ display: flex; }</style><div class="wrapper"><div id="tree">';
    try {
        html += await getList(filteredTree);

    } catch (e) {
        console.log(e);
    }
    html += '</div>';
    html += "<div style='position: relative'><div id='content' style='max-width: 600px; top:0;max-height: 100%; overflow-y: scroll;'>content</div></div></div><script>document.addEventListener('click',(e)=>{ const target = e.target; if(!target.classList.contains('name')) {return;} const content = target.nextSibling.innerHTML; if(content){ document.getElementById('content').innerHTML = content; } });</script>";

    html+="</body></html>";
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(html);
    res.end();

})

app.listen(3001, () => console.log('Example app listening on port 3001!'))
