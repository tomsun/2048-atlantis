// Make sure this matches the CSS definition
var atlantis_img_base = "http://tomsun.github.io/2048-atlantis/img";
var atlantis_places = {};
atlantis_places[2] = {"title": "Tävlingsdalen", "img": atlantis_img_base + "/tavling.png"};
atlantis_places[4] = {"title": "Metis", "img": atlantis_img_base + "/metis.png"};
atlantis_places[8] = {"title": "Skapadalen", "img": atlantis_img_base + "/skapa.png"};
atlantis_places[16] = {"title": "Asteria", "img": atlantis_img_base + "/asteria.png"};
atlantis_places[32] = {"title": "Lelantos", "img": atlantis_img_base + "/lelantos.png"};
atlantis_places[64] = {"title": "Oceanis", "img": atlantis_img_base + "/oceanis.png"};
atlantis_places[128] = {"title": "Hyperion", "img": atlantis_img_base + "/hyperion.png"};
atlantis_places[256] = {"title": "Globalt-dalen", "img": atlantis_img_base + "/globalt.png"};
atlantis_places[512] = {"title": "Actiondalen", "img": atlantis_img_base + "/action.png"};
atlantis_places[2024] = {"title": "Vattendalen", "img": atlantis_img_base + "/vatten.png"};
atlantis_places[4096] = {"title": "Atlantis", "img": atlantis_img_base + "/atlantis.png"};

function atlantis_init() {
  var imgs_preload = new Array(
    'action.png',
    'asteria.png',
    'atlantis.png',
    'globalt.png',
    'hyperion.png',
    'lelantos.png',
    'metis.png',
    'oceanis.png',
    'science.png',
    'skapa.png',
    'starfish.png',
    'tavling.png',
    'vatten.png'
  )

  var container = document.getElementsByClassName("container")[0]

  for (var i in imgs_preload) {
    container.innerHTML+= '<img class="preload" src="./img/' + imgs_preload[i] + '" />'
  }
}

atlantis_init()
