


class post{
    constructor(title,link,thumbnail,blurb){
        this.title=title
        this.link=link
        this.thumbnail=thumbnail
        this.blurb=blurb
    }
    add_to_page(){
        let posttable=document.createElement("table")
        posttable.className="post"

        let row=document.createElement("tr")
        posttable.appendChild(row)

        let col1=document.createElement("th")
        let img=document.createElement("img")
        img.className="post_thumbnail"
        img.src=this.thumbnail
        col1.appendChild(img)
        row.appendChild(col1)

        let col2=document.createElement("th")
        col2.className="post_data"
        row.appendChild(col2)

        let titlediv=document.createElement("div")
        titlediv.className="post_title"
        col2.appendChild(titlediv)

        let link=document.createElement("a")
        link.href=this.link
        link.appendChild(document.createTextNode(this.title))
        titlediv.appendChild(link)

        let textdiv=document.createElement("div")
        textdiv.className="post_text"
        textdiv.appendChild(document.createTextNode(this.blurb))
        col2.appendChild(textdiv)

        let list=document.getElementsByClassName("post_list")[0]
        list.appendChild(posttable)
    }
}

console.log("main.js")

let postlist=[]

fetch("/posts/posts.json").then((rsp)=>{
    return rsp.json()
}).then((data)=>{
    let arr=data.array;
    for(let i of arr){
        postlist.push(new post(i.title,i.link,i.pic,i.blurb));
    }
    for(let p of postlist){
        p.add_to_page()
    }
})
