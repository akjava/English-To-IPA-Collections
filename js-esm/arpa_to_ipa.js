const vowels = {
    'AA0': 'ɑ',
    'AA1': 'ɑ',
    'AA2': 'ɑ',
    'AE0': 'æ',
    'AE1': 'æ',
    'AE2': 'æ',
    'AH0': 'ʌ',
    'AH1': 'ʌ',
    'AH2': 'ʌ',
    'AO0': 'ɔ',
    'AO1': 'ɔ',
    'AO2': 'ɔ',
    'AW0': 'aʊ',
    'AW1': 'aʊ',
    'AW2': 'aʊ',
    'AY0': 'aɪ',
    'AY1': 'aɪ',
    'AY2': 'aɪ',
    'EH0': 'ɛ',
    'EH1': 'ɛ',
    'EH2': 'ɛ',
    'ER0': 'ɝ',
    'ER1': 'ɝ',
    'ER2': 'ɝ',
    'EY0': 'eɪ',
    'EY1': 'eɪ',
    'EY2': 'eɪ',
    'IH0': 'ɪ',
    'IH1': 'ɪ',
    'IH2': 'ɪ',
    'IY0': 'i',
    'IY1': 'i',
    'IY2': 'i',
    'OW0': 'oʊ',
    'OW1': 'oʊ',
    'OW2': 'oʊ',
    'OY0': 'ɔɪ',
    'OY1': 'ɔɪ',
    'OY2': 'ɔɪ',
    'UH0': 'ʊ',
    'UH1': 'ʊ',
    'UH2': 'ʊ',
    'UW0': 'u',
    'UW1': 'u',
    'UW2': 'u'
  };

  const consonants = {
    'B': 'b',
    'CH': 'tʃ',
    'D': 'd',
    'DH': 'ð',
    'F': 'f',
    'G': 'ɡ',
    'HH': 'h',
    'JH': 'dʒ',
    'K': 'k',
    'L': 'l',
    'M': 'm',
    'N': 'n',
    'NG': 'ŋ',
    'P': 'p',
    'R': 'ɹ',
    'S': 's',
    'SH': 'ʃ',
    'T': 't',
    'TH': 'θ',
    'V': 'v',
    'W': 'w',
    'Y': 'j',
    'Z': 'z',
    'ZH': 'ʒ'
  };

  const arpa_to_ipa_lookup_tables = {
    ...vowels,
    ...consonants
  };

  class Syllable {
    constructor(ontop,nucleus, coder,accent) {
        this.ontop = ontop;   
        this.nucleus  = nucleus; // vowel
        
        this.coder = coder
        this.accent = accent; 
    }
  
    // 音節の詳細を表示するメソッド
    display() {
        console.log(`Ontop: ${this.ontop} Nucleus: ${this.nucleus}, Coder: ${this.coder}, Accent: ${this.accent}`);
    }
  }
  
  // Function to convert Arpabet to IPA
  function arpa_to_ipa(arpa,addStressMarkers=true) {
    let syllable = arpa_to_ipa_with_syllables(arpa)
    //console.log(syllable)
    return syallablesToString(syllable,addStressMarkers)
  }
  
  // Function to convert Arpabet to IPA and extract syllable information
  function arpa_to_ipa_with_syllables(arpa) {
    arpa = arpa.toUpperCase();
    const phonemes = arpa.split(' ');
    const syllables = [];
    let currentSyllable = { nucleus: null, ontop: "", coder:"", accent: -1 }; // Default accent is -1
  
    for (let i = 0; i < phonemes.length; i++) {
      const phoneme = phonemes[i];
      let ipaSymbol = arpa_to_ipa_lookup_tables[phoneme];
      if (ipaSymbol === undefined) {//for omitted vowel
        ipaSymbol = arpa_to_ipa_lookup_tables[phoneme+"0"];
        }
  
      if (ipaSymbol === undefined) {
        console.log(`Invalid Arpabet phoneme: ${phoneme}`);
        continue; // Skip invalid phonemes
      }
  
      // Check for vowel (Corrected condition)
      if (phoneme in vowels) {
        
        //console.log(`${phoneme} is vowel`)
        // Handle cases where there might be no accent marker
        let accent = -1; // Default accent is -1
        const lastChar = phoneme.slice(-1);
        if (!isNaN(lastChar)) { // Check if the last character is a number
          accent = parseInt(lastChar, 10);
        }
  
        // Found a vowel, create a new syllable
        //if (currentSyllable.vowel !== null || currentSyllable.consonant !== "") {
          syllables.push(new Syllable(currentSyllable.ontop,ipaSymbol, currentSyllable.coder, accent));
        //}
  
        currentSyllable = { nucleus: null, ontop: "", coder:"",accent: -1 };
      } else {
        // Consonant, add to current syllable
        currentSyllable.ontop += ipaSymbol;
      }
    }
  
    
    // Add the last syllable if it has content
    if (currentSyllable.nucleus !== null || currentSyllable.ontop !== "") {
      syllables.push(new Syllable(currentSyllable.ontop,currentSyllable.nucleus, currentSyllable.coder, currentSyllable.accent));
    }
  
    //console.log(syllables)
    let last_syallable = syllables[syllables.length-1]
    //console.log(last_syallable)
    if (last_syallable.nucleus!=null){
      if (last_syallable.accent<2){
        if(last_syallable.nucleus.endsWith("ː")){
          last_syallable.nucleus = last_syallable.nucleus.substring(0, last_syallable.nucleus.length-1)
        }
      }
    }
  
    return syllables;
  }
  
  function syallablesToString(syllables,addStressMarkers=True) {
    let ipaString = "";
    let primaryStressAdded = false;
  
    for (let i = 0; i < syllables.length; i++) {
      const syllable = syllables[i];
      //console.log(syllable.consonant)
      const nucleus = (syllable.nucleus != null) ? syllable.nucleus : "";
      let accent = ""
     
     //console.log(ipaString)
  
      if (syllable.accent === 1) {
        accent = "ˈ";
      } else if (syllable.accent === 2) {
        accent = "ˌ";
      } else if (syllable.accent === 0) {
        //ipaString = "ˌ" + ipaString;
      }
      if (addStressMarkers){
        ipaString += accent
      }
      ipaString += syllable.ontop + nucleus+syllable.coder;
    }
  
    return ipaString;
  }
  
  export { arpa_to_ipa };