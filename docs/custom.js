function highlightPage(val) {

    var current_page = document.getElementById('current_page').innerHTML;

    var search = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
    //esclusione dei tag html
    search = '(?!<[^<]*)' + search + '(?![^<]*>)';

    var re = new RegExp(search, 'g');
    var re_mark_op = new RegExp('<mark>','g');
    var re_mark_cl = new RegExp('</mark>','g');

    var el = document.getElementById('pageContainer'+current_page);
    if(el){
        if(el.hasChildNodes()){
            var tex_layer = el.children[2];
            if(tex_layer.childElementCount > 0){
                if (val.length > 0){
                    tex_layer.innerHTML = tex_layer.innerHTML.replace(re_mark_op,'').replace(re_mark_cl,'').replace(re, `<mark>$&</mark>`);
                }
                else {
                    tex_layer.innerHTML = tex_layer.innerHTML.replace(re_mark_op,'').replace(re_mark_cl,'');
                }
            } 
        }
    }

}

function removeHighlight(page){

    var page_num = parseInt(document.getElementById('page_num').innerHTML);

    if(page > 0 && page < (page_num + 1)){

        var re_mark_op = new RegExp('<mark>','g');
        var re_mark_cl = new RegExp('</mark>','g');
        
        var el = document.getElementById('pageContainer'+page);
        if(el){
            if(el.hasChildNodes()){

                var tex_layer = el.children[2];
                if(tex_layer.childElementCount > 0){
                    tex_layer.innerHTML = tex_layer.innerHTML.replace(re_mark_op,'').replace(re_mark_cl,'');
                    
                } 

            }
        }
        
    }

}

function goToPage(){
    var page_num = parseInt(document.getElementById('page_num').innerHTML);
    var goal_page = parseInt(document.getElementById('go_to').value);
    var current_page = parseInt(document.getElementById('current_page').innerHTML);
    var val = document.getElementById('typed-text').value;

    if(goal_page > page_num || goal_page < 1){
        alert('offset');
    }else if(isNaN(goal_page)){
        alert('is not a number');
    }else{
        removeHighlight(current_page);
        window.location.href = "#page" + goal_page; 
        
    }
    
}

// set interval per le pagine
function pageLoop(val){

     
    if (val.length > 0){
        document.getElementById('com_container').classList.add('hide');
        document.getElementById('occ_container').classList.remove('hide');
    }else{
        document.getElementById('com_container').classList.remove('hide');
        document.getElementById('occ_container').classList.add('hide');
    }

    for (var i = 1; i < 99999; i++)
        window.clearInterval(i);

    var occ_list_div = document.getElementById('occ_list');
    //clear the list
    occ_list_div.innerHTML = '';

    if(val.length >0){

        let pp = 1;
        let limiter = parseInt(document.getElementById('page_num').innerHTML) +1;
        let pdfUrl = document.getElementById('doc_name').innerHTML ; 
        let pdf = PDFJS.getDocument(pdfUrl);

        function myTimer() {
            if(pp == limiter){
                clearInterval(intervalLoop);
            }else{

                pdfParser(pdf,pp,val,occ_list_div);
                pp++;
            
            }
        }
       
        myTimer();
        let intervalLoop = setInterval(myTimer, 6000);


    }

}

function pdfParser(pdf,page_num,val,occ_list_div){

    pdf.then(function(pdf) { 
                    
        var page = pdf.getPage(page_num);
        page.then(function(page) { 

            var textContent = page.getTextContent();
            textContent.then(function(text){ 
                itemsLoop(text.items,page_num,val,occ_list_div);
            
            });
        }); 
    });

}

function itemsLoop(items,page_num,val,occ_list_div){

    var intervalLoop = setInterval(myTimer, 20);
    var limiter = items.length;
    var count = 0;
    var occ = 0;
    
    function myTimer() {
        if(count == limiter){
            clearInterval(intervalLoop);
        }else{

            var str = items[count].str;

            if(str.includes(val)){
                  
                occ++;
                var re = new RegExp(val,"g");

                text = str.replace(re,'<span id="highlight">$&</span>');
                var el = occ_list_div.querySelector('button[value="'+ str +'"]');
                if(!el){
                    var break_node = document.createElement("br");
                    var hr = document.createElement("hr");
                    var button = document.createElement("button");
                    button.setAttribute('onclick','moveToElemByPage('+ page_num +')');
                    button.setAttribute('value', str);
                    button.innerHTML = text + ' [pag. ' + page_num + ']';
                    occ_list_div.appendChild(button);
                    occ_list_div.appendChild(break_node);
                    occ_list_div.appendChild(hr);
                    occ_list_div.appendChild(break_node);
                }
                

            }

            count++;

        }

    }

}
