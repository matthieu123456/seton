function copyTpl() {
    return document.querySelector('#tpl_notes').content.lastElementChild.cloneNode(true);
}

function createNote() {
    console.log("débug : dans la fonction createNote()");
    const t = window.prompt('Titre de la note ?');
    if(t != null){
        create(t, null).then((res) => {
            const id = res.result.id;
            console.log("débug : id qui sera créé : " + id);
            //insertNoteBlock(id, t, '', null, null, null);
            retrieve(id);
        });
    } 
}

function list() {
    fetch('/api/')
        .then((e) => { return e.json(); })
        .then((r) => {
            for (let l of r.notes) {
                insertNoteBlock(l.rowid, l.title, l.content, l.tag, l.dateCreated, l.dateUpdated);
            }
        });
}

async function change(id, title, content){
    console.log(title);
    console.log(content);
    console.log("débug : dans la fonction change");
    let res = await fetch('/api/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'title': title, 'content': content})
    })
    return res.json();
}

function getNoteBlock(id) {
    return document.querySelector('li[data-noteid="' + id + '"]');
}

function tag(id, tag) {
    console.log("débug : dans la fonction tag");
    fetch('/api/' + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'tag': tag })
    })
        .then((e) => { return e.json(); })
        .then((r) => {
            if(null === tag) {
                delete getNoteBlock(id).dataset.tag;
            } else {
                getNoteBlock(id).dataset.tag = tag;
            }
        });
}

function untag(id) {
    tag(id, null);
}

function isTagged(id) {
    return ('important' == getNoteBlock(id).dataset.tag);
}

function insertNoteBlock(id, title, content, tag, dateCreated, dateUpdated){
    //ici on va gérer l'insertion des blocs dans la page web
    console.log("débug : dans la fonction insertNoteBlock pour construire la page");
    console.log(id + " - " + title + " " + content + " " + tag + " " + dateCreated + " " + dateUpdated);
    
    const blocnotes = document.querySelector("#notes");
    let note = copyTpl();
    note.dataset.noteid = id;
    blocnotes.appendChild(note);
    let notetitle = document.querySelector(`[data-noteid="${id}"]`).querySelector(".title");
    let notecontent = document.querySelector(`[data-noteid="${id}"]`).querySelector(".content");
    let notedateC = document.querySelector(`[data-noteid="${id}"]`).querySelector(".dateCreated");
    let notedateU = document.querySelector(`[data-noteid="${id}"]`).querySelector(".dateUpdated");
    let notesave = document.querySelector(`[data-noteid="${id}"]`).querySelector(".save");
    let notetag = document.querySelector(`[data-noteid="${id}"]`).querySelector(".tag");
    let notedelete = document.querySelector(`[data-noteid="${id}"]`).querySelector(".delete");
    let noteformulaire = document.querySelector(`[data-noteid="${id}"]`).querySelector(".noteform");

    notetitle.value = title;
    notecontent.textContent = content;
    notedateC.innerHTML = dateCreated;
    notedateU.innerHTML = dateUpdated;
    
    if(tag == "important"){
        getNoteBlock(id).dataset.tag = tag;
    }
    
    notetitle.addEventListener("keydown", (event) => {
        console.log("changement titre");
        getNoteBlock(id).dataset.unsave = 1;
    });
    notecontent.addEventListener("keydown", (event) => {
        console.log("changement contenu");
        getNoteBlock(id).dataset.unsave = 1;
    });

    noteformulaire.addEventListener('submit', (event) => {
        event.preventDefault();
        if(event.submitter.value == notesave.value){
            console.log("débug : save");
            change(id, notetitle.value, notecontent.value);
            getNoteBlock(id).dataset.unsave = 0;
        }
        if(event.submitter.value == notetag.value){
            console.log("débug : tag");
            if(isTagged(id)){
                untag(id);
            }
            else window.tag(id, "important");
        }
        if(event.submitter.value == notedelete.value){
            console.log("débug : delete");
            let res = fetch('/api/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            blocnotes.removeChild(note);
        }
    });
}

async function create(titre, texte){
    console.log("débug : dans la fonction create");
    let res = await fetch('/api/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'title': titre, 'content': texte})
    })
    return res.json();
}

function retrieve(id){
    fetch('/api/' + id)
        .then((e) => { return e.json(); })
        .then((r) => {
            console.log("débug : dans la fonction retrieve");
            insertNoteBlock(id, r.note.title, r.note.content, r.note.tag, r.note.dateCreated, r.note.dateUpdated);
        });
}

document.addEventListener("DOMContentLoaded", function(event){
    const liens_new = document.getElementsByClassName("new");
    
    for(let i=0; i < liens_new.length; i++) {
        console.log("débug : dans le for qui compte les liens new");
        liens_new[i].addEventListener("click", createNote);
    }

    list();
});
