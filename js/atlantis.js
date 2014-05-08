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
