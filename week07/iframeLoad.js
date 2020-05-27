let iframe = document.createElement('iframe');
import standards from './css-standards.json';
document.body.innerHTML = '';
document.body.appendChild(iframe);

function happen(element, event){
    return new Promise(resolve => {
        let handler = () => {
            let iframeDocument = element.contentDocument;
            let prodList = iframeDocument.getElementsByClassName('prod');
            resolve(prodList ? prodList : `not found in ${window.location.href}`);
            element.removeEventListener(event, handler);
        }
        element.addEventListener(event, handler)
    })
}

void async function(){
    for(let standard of standards) {
        iframe.src = standard.url;
        try{
            let res = await happen(iframe, 'load');
            console.log(res)
        } catch(error){
            console.log(error);
        }
    }
}()