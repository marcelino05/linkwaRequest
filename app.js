let ultimaRequest = null
const historyList = document.getElementById("history")

// elementos reutilizados (melhor performance)
const methodEl = document.getElementById("method")
const urlEl = document.getElementById("url")
const bodyEl = document.getElementById("body")
const headersEl = document.getElementById("headers")
const responseBox = document.getElementById("response")
const statusBox = document.getElementById("status")
const timeBox = document.getElementById("time")

function novaRequest() {
  
  const method = methodEl.value
  const url = urlEl.value
  const body = bodyEl.value
  const headers = headersEl.value
  
  if (url) {
    
    const li = document.createElement("li")
    li.textContent = method + " " + url
    li.className = "bord"
    
    let clickTimer = null

    // clique normal → carregar
li.addEventListener("click", () => {
  methodEl.value = method
  urlEl.value = url
  bodyEl.value = body
  headersEl.value = headers
})

// botão direito → remover
li.addEventListener("contextmenu", (e) => {
  e.preventDefault()
  
  if (confirm("Remover esta request?")) {
    li.remove()
  }
})
    
    historyList.prepend(li)
  }
  
  // limpar campos
  urlEl.value = ""
  bodyEl.value = ""
  headersEl.value = ""
  responseBox.textContent = "Nova requisição pronta..."
}


// ==========================
// REQUEST
// ==========================

async function sendRequest() {
  
  const start = Date.now()
  
  const method = methodEl.value
  const url = urlEl.value.trim()
  const body = bodyEl.value.trim()
  const headersInput = headersEl.value.trim()
  
  if (!url) {
    responseBox.textContent = "Digite uma URL válida"
    return
  }
  
  let customHeaders = {}
  
  if (headersInput) {
    try {
      customHeaders = JSON.parse(headersInput)
    } catch {
      responseBox.textContent = "Headers inválidos (JSON)"
      return
    }
  }
  
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders
    }
  }
  
  if (method !== "GET" && body) {
    try {
      options.body = JSON.stringify(JSON.parse(body))
    } catch {
      responseBox.textContent = "Body inválido (JSON)"
      return
    }
  }
  
  try {
    
    responseBox.innerHTML = "<span style='opacity:0.6'>Carregando...</span>"
    
    const res = await fetch(url, options)
    
    const time = Date.now() - start
    
    statusBox.textContent = "Status: " + res.status
    statusBox.style.color = res.ok ? "lightgreen" : "red"
    
    timeBox.textContent = " | Tempo: " + time + "ms"
    
    const type = res.headers.get("content-type") || ""
    
    let data
    let formatted = ""
    
    if (type.includes("application/json")) {
      data = await res.json()
      formatted = JSON.stringify(data, null, 2)
    } else {
      data = await res.text()
      formatted = data
    }
    
    const highlighted = hljs.highlightAuto(formatted)
    responseBox.innerHTML = highlighted.value
    
  } catch (err) {
    responseBox.textContent = "Erro: " + err.message
  }
}
