let path ,param=[] , curentPath ={};
let routeList = [
    {
        url: "/admin",
        templete: "View/admin.html",
        contriller : "",
        title: "صفحة المشرف"
    },
    {
        url: "/home",
        templete: "View/h1ome.html",
        contriller : "",
        title: "شبكة الوحدة الإخبارية"
    },
    {
        url: "/home/:id",
        templete: "View/h1ome.html",
        contriller : "",
        id:"",
        title: "شبكة الوحدة الإخبارية"
    },
    {
        url: "/home/:id/:titel/:ex",
        templete: "View/h1ome.html",
        contriller : "",
        id:"",
        title: "شبكة الوحدة الإخبارية"
    }
];
 
function analyzeUrl() {
    let option ,find = false;
    path="";
    curentPath ={};
    param={};
    let url = window.location.href;
    url = url.substr(url.search("#")+2).split("/");
    console.log(url);
    let root = url[0];
    url.splice(0,1);
    routeList.forEach(route =>{
        option = route.url.substr(route.url.search("/")+1).split("/:");
        if (root == option[0] && url.length == (option.length-1)){
            find = true;
            path = option[0];
            option.splice(0,1);
            param={};
            option.forEach((element , index)=> {
                param[element] = url[index];
            });
            curentPath=route;
        }  
    });
 
    if (find == false) {
        path = "";
        param = {};
        curentPath ={};
    }
 
    console.log(curentPath);
    console.log("Path : "+path);
    console.log("Param : ");
    console.log(param);
    console.log("Title is:")
    console.log( curentPath.title);
 
    document.title = curentPath.title;
 
}