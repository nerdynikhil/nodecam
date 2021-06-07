let dbAccess;
let request=indexedDB.open("Camera",1);

request.addEventListener("success",function(){
    dbAccess=request.result;
});

request.addEventListener("upgradeneeded",function(){
    let db=request.result;
    db.createObjectStore("gallery",{keyPath: "mId" });
});

request.addEventListener("error",function(){
    alert("some error occured");
});

function addMedia(type,media){
    let tx=dbAccess.transaction("gallery","readwrite");
    let galleryObjectStore=tx.objectStore("gallery");
    let data={
        mId:Date.now(),
        type,
        media,
    };
    galleryObjectStore.add(data);
}