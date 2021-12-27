
/*
<title>Ray Tracing a Black Hole on The GPU</title>
<link rel="icon" href="/logo.png">
<link rel="stylesheet" type="text/css" href="/style.css">
<meta charset="utf-8">
<div class="post_header">
  Ray Tracing a Black Hole on The GPU
</div>
*/

let func=(title)=>{
  let head=document.getElementsByTagName("head")[0]
  let name=document.createElement("title")
  name.appendChild(document.createTextNode(title))
  head.appendChild(name)
  let style=document.createElement('link')
  style.rel="stylesheet"
  style.type="text/css"
  style.href="/style.css"
  head.appendChild(style)
  let logo=document.createElement("link")
  logo.rel="icon"
  logo.href="/logo.png"
  head.appendChild(logo)
  let meta=document.createElement("meta")
  meta.charset="utf-8"
  head.appendChild(meta)

  let body=document.getElementsByTagName("body")[0]
  let ptable=document.createElement("table")
  ptable.className="post_header"
  body.appendChild(ptable)

  let row=document.createElement("tr")
  ptable.appendChild(row)


  let ptitle=document.createElement("th")
  ptitle.className="title"
  ptitle.appendChild(document.createTextNode(title))
  row.appendChild(ptitle)

  let home=document.createElement("th")
  home.className="home"
  let homelink=document.createElement("a")
  homelink.href="/"
  homelink.appendChild(document.createTextNode("home."))
  home.appendChild(homelink)
  row.appendChild(home)
}
func(POST_TITLE)
