//ver 0.1
let cmudict = {}

async function loadCmudict(obj=cmudict,path='./cmudict-0.7b',splitter="  ") { //split double-space
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(path);
      const responseText = await response.text();
      
      const lines = responseText.split('\n');
      
      lines.forEach(line => {
        let data = line.trim().split(splitter); 
        obj[data[0]] = data[1];
      });
  
      resolve(true);
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

//let cmudictReady =loadCmudict();

function get_arpa(word){
  return cmudict[word.toUpperCase()]
}
  

async function text2arpa(text){
  await cmudictReady
  const inputText = text
  let result = []
  let non_converted = []
  var words = inputText.split(" ")
  words.forEach(word => {
      const arpa = get_arpa(word)
      if (typeof arpa == "undefined"){
      result.push("@"+word)
      non_converted.push(word)
      }else{
      result.push(arpa)
      }
  });
  
  return {"result":result,"non_converted":non_converted}
}

export { text2arpa, loadCmudict};