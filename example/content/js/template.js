document.body.onload = function () {
	document.getElementById("templateContainer").innerHTML = templates["templates/1.tmpl"]({name: "world"})
}