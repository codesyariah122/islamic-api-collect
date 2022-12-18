function requestByChat(app) {
  let name = prompt("Who are You ? (your name / nick)");
  while (name === "" || name === null) {
    name = prompt("Please type your name ? (your name / nick)");
  }

  const url = "https://wa.me/6288222668778?text=";
  const contextWa = `
	Halo puji ermanto, Saya : ${name}, saya ingin request access token Api untuk Api ${app} ?
	`;
  window.open(`${url}${encodeURIComponent(contextWa)}`);
  console.log("OK deh kakak");
}
