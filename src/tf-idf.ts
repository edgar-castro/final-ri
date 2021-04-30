type objNoticia = { id: number, journal: string, title: string, content: string };
type objTFIDF = { id: number, term: string, weights: number[] };
type objDocWeight = { id: number, weight: number };
type objDocVector = { id: number, weights: number[] };

const stop_words:string[] = ['a', 'acá', 'ahí', 'ajena', 'ajeno', 'ajenas', 'ajenos', 'al', 'algo', 'algún', 'alguna', 
    'alguno', 'algunas', 'algunos', 'allá', 'allí', 'ambos', 'ante', 'antes', 'aquel', 'aquella', 'aquello', 'aquellas', 
    'aquellos', 'aquí', 'arriba', 'así', 'atrás', 'aun', 'aunque', 'bajo', 'bastante', 'bien', 'cabe', 'cada', 'casi',
    'cierto', 'cierta', 'ciertos', 'ciertas', 'como', 'con', 'conmigo', 'conseguimos', 'conseguir', 'consigo', 'consigue',
    'consiguen', 'consigues', 'contigo', 'contra', 'cual', 'cuales', 'cualquier', 'cualquiera', 'cualquieras', 'cuan',
    'cuando', 'cuanto', 'cuanta', 'cuantas', 'de', 'dejar', 'del', 'demás', 'demasiada', 'demasiado', 'demasiadas',
    'demasiados', 'dentro', 'desde', 'donde', 'dos', 'el', 'él', 'ella', 'ello', 'ellas', 'ellos', 'empleáis', 'emplean',
    'emplear', 'empleas', 'empleo', 'en', 'encima', 'entonces', 'entre', 'era', 'eras', 'eramos', 'eran', 'eres', 'es', 
    'esa', 'ese', 'eso', 'esas', 'esos', 'esta', 'sestas', 'estaba', 'estado', 'estáis', 'estamos', 'están', 'estar', 
    'este', 'esto', 'estos', 'estoy', 'etc', 'fin', 'fue', 'fueron', 'fui', 'fuimos', 'gueno', 'ha', 'hace', 'haces', 
    'hacéis', 'hacemos', 'hacen', 'hacer', 'hacia', 'hago', 'hasta', 'incluso', 'intenta', 'intentas', 'intentáis', 
    'intentamos', 'intentan', 'intentar', 'intento', 'ir', 'jamás', 'junto', 'juntos', 'la', 'lo', 'las', 'los', 'largo', 
    'más', 'me', 'menos', 'mi', 'mis', 'mía', 'mías', 'mientras', 'mío', 'míos', 'misma', 'mismo', 'mismas', 'mismos', 
    'modo', 'mucha', 'muchas', 'muchísima', 'muchísimo', 'muchísimas', 'muchísimos', 'mucho', 'muchos', 'muy', 'nada', 
    'ni', 'ningún', 'ninguna', 'ninguno', 'ningunas', 'ningunos', 'no', 'nos', 'nosotras', 'nosotros', 'nuestra', 
    'nuestro', 'nuestras', 'nuestros', 'nunca', 'os', 'otra', 'otro', 'otras', 'otros', 'para', 'parecer', 'pero', 
    'poca', 'poco', 'pocas', 'pocos', 'podéis', 'podemos', 'poder', 'podría', 'podrías', 'podríais', 'podríamos', 
    'podrían', 'por', 'por qué', 'porque', 'primero', 'puede', 'pueden', 'puedo', 'pues', 'que', 'qué', 'querer', 
    'quién', 'quiénes', 'quienesquiera', 'quienquiera', 'quizá', 'quizás', 'sabe', 'sabes', 'saben', 'sabéis', 'sabemos', 
    'saber', 'se', 'según', 'ser', 'si', 'sí', 'siempre', 'siendo', 'sin', 'sino', 'so', 'sobre', 'sois', 'solamente', 
    'solo', 'sólo', 'somos', 'soy', 'sr', 'sra', 'sres', 'sta', 'su', 'sus', 'suya', 'suyo', 'suyas', 'suyos', 'tal', 
    'tales', 'también', 'tampoco', 'tan', 'tanta', 'tanto', 'tantas', 'tantos', 'te', 'tenéis', 'tenemos', 'tener', 
    'tengo', 'ti', 'tiempo', 'tiene', 'tienen', 'toda', 'todo', 'todos', 'tomar', 'trabaja', 'trabajo', 'trabajáis', 
    'trabajamos', 'trabajan', 'trabajar', 'trabajas', 'tras', 'tú', 'tu', 'tus', 'tuya', 'tuyo', 'tuyas', 'tuyos', 
    'último', 'ultimo', 'un', 'una', 'uno', 'unas', 'unos', 'usa', 'usas', 'usáis', 'usamos', 'usan', 'usar', 'uso', 
    'usted', 'ustedes', 'va', 'van', 'vais', 'valor', 'vamos', 'varias', 'varios', 'vaya', 'verdadera', 'vosotras', 
    'vosotros', 'voy', 'vuestra', 'vuestro', 'vuestras', 'vuestros', 'y', 'ya', 'yo'];

const raiz=['abue','abue','admon','anarco','anfeta','aparca','arbi','arqui','arqui','arqui','arqui','auto','barna',
    'beis','bibe','bici','biblio','biblio','bio','bisa','bisa','bolche','boli','boli','bono','bono','borra','busca','bus','cai','cami','campa',
    'capi','carca','cari','celu','ceni','cerve','chacha','chacho','chiqui','chiqui','chori','chumi','chuche','ciber','cicla','cine','cintu','coca',
    'coca','cole','cole','comi','comi','compa','compa','comper','compu','confe','confi','conge','copi','coreo','corto','cosquis',
    'coti','cumpa','cumple','deco','deco','deli','demo','depa','desca','desco','din','dire','disco','diver','eco','electro','estereo',
    'facu','fax','festi','fisi','fisio','fluo','fonazo','fonendo','fono','foto','frigo','fula','fut','gili','gine','grana',
    'guarde','hetero','hiper','homo','hospi','ilu','impeque','info','inge','inge','inge','inge','inox','insti','jo','kilo','lesbi','limpia','limpia','lipo',
    'lito','lumpen','lunfa','majara','mamo','mani','masoca','mate','mega','metro','micro','micro','micro','micro','micro','mila',
    'mili','moto','narco','ofi','otorrino','pandi','pasti','pati','peli','pelu','pende',
    'peni','peque','pere','peri','pisci','poli','poli','poli','poli','porfa','porno','prefe','prepa',
    'presi','primer','primer','price','pringui','profe','profe','promo','prosti','prota','prote','psico','psiqui', 'publi','puti','quillo',
    'quilla','quimio','refri','regu','repe','resi','ridi','rotu','saca','sado','secre','segun','seño','soco','sudaca','suje','super','super',
    'tatu','taxi','tele','tico','torti','tranqui','trici','trigo','trole','trompu','ulti','uni','urba','vacas','vice','vitro','voli','zapas','zoo'];

   const significado=['abuelo','abuela','administracion','anarquista','anfetamina','aparcacoches','arbitro','arquitecto','arquitecta','arquitectos','arquitectas','automovil','barcelona',
    'beisbol','biberon','bicicleta','bibliografia','biblioteca','biografia','bisabuelo','bisabuela','bolchevique','boliche','boligrafo','bonoloto','bonobus','borrador','buscapersonas','autobus','cadiz','camiseta','campamento',
    'capitan','carcamal','cariño','celular','cenicero','cerveza','muchacha','muchacho','chiquito','chiquita','chorizo','chumino','chucheria','cibercafe','bicicleta','cinematografia','cinturon','cocacola',
    'cocaina','colegio','colectivo','comisario','comida','compañero','compadre','conpermiso','computadora','confesionario','confianza','congelador','copiloto','coreografia','cortometraje','cosquillas',
    'cotilleo','cumpadre','cumpleaños','decodificador','decoracion','delicioso','demostracion','departamento','descafeinado','descodificador','dinero','director','discoteca','divertido','ecografia','electrocardiograma','estereofonico',
    'facultad','telefax','festival','fisica','fisioterapeuta','fluorescente','telefonazo','fonendoscopio','telefono','fotografia','frigorifico','fulastre','futbol','gilipollas','ginecologo','granada',
    'guarderia','heterosexual','hipermercado','homosexual','hospital','ilusion','impecable','informacion','ingeniero','ingenieros','ingenieras','ingeniera','inoxidable','instituto','jolines','kilogramo','lesbiana','limpiaparabrisas','limpibotas','liposuccion',
    'litogtafia','lumpemproletario','lunfarno','majareta','mamografia','manifestacion','masoquista','matematicas','megabyte','metropolitano','microbus','microfono','micromercado','microondas','microcomponente','milanesa',
    'militar','motocicleta','narcotraficante','oficina','otorrinolaringologo','pandilla','pastilla','patilla','pelicula','peluqueria','pendejo',
    'penitencia','pequeño','pereza','periferico','piscina','policia','polideportivo','politecnico','politico','porfavor','pornografia','preferido','preparatoria',
    'presidente','primero','primera','pricesa','pringado','profer','profera','promocion','prostituta','protagonista','proteccion','psicologia','psiquiatra', 'publicidad','puticlub','chiquillo',
    'chiquilla','quimioterapia','refrigerador','regular','repetido','residencia','ridiculo','rotulador','sacapuntas','sadismo','secretaria','segundo','señorita','socorrista','sudamericano','sujetador','superintendente','supermercado',
    'tatuaje','taximetro','television','costarricence','tortilleria','tranquilo','triciclo','trigonometria','trolebus','trompudo','ultimo','universidad','urbanizacion','vacaciones','vicepresidente','vitroceramica','voleibal','zapatillas','zoologico'];
//Funcion que convierte la entrada (archivo de texto) en un arreglo de objet
//Separa el indice de la noticis, el titulo y su contenido.


const getCorpus = (input: string): objNoticia[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(input, 'text/xml');
    const periodicos = xmlDoc.getElementsByTagName('periodico');
    const noticias = xmlDoc.getElementsByTagName('cuerpo');
    const corpus: objNoticia[] = [];
    for(let i = 0; i < periodicos.length; i++){
        const separator = noticias[i].innerHTML.indexOf('.');
        const _title = noticias[i].innerHTML.slice(0, separator);
        const _content = noticias[i].innerHTML.slice(separator + 1);
        corpus.push({
            id: i,
            journal: periodicos[i].innerHTML.trim(),
            title: _title,
            content: _content,
        })
    }
    return corpus;
}

const processCorpus = (corpus: objNoticia[]): objNoticia[] => {
    return corpus.map((x) => {
        return {
            id: x.id,
            journal: x.journal,
            title: preprocessDocument(x.title),
            content: preprocessDocument(x.content)
        }
    });
}

const preprocessDocument = (document: string): string => {
    return removeStopWords(lexicalAnalysis(document), stop_words).split(' ')
        .map(x => lematizacion(x)).join(' ');
}

const lexicalAnalysis = (document: string): string => {
    let temp = document.toLowerCase();
    // temp = temp.replace(/\n/g, ' ');
    // temp = temp.replace(/\r/g, ' ');
    temp = temp.replace(/[.,/#!¡¿?$%^&*;:+{}...=-_`~()“”'"“-…–]/g, '').replace(/[0-9]+/g, '');
    temp = temp.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return temp;
}

const removeStopWords = (document: string, stop_words: string[]): string => {
    return document.split(' ').filter(e => !stop_words.includes(e)).join(' ');
}

const lematizacion = (document:string):string=>{
    const index=significado.indexOf(document);
    if(index <=-1)return document;
    return raiz[index];
}

const getWords = (corpus: objNoticia[]): string[] => {
    const words = new Set<string>();
    for(const document of corpus)
        (document.title + ' ' + document.content).split(' ').
            forEach(e => {
                words.add(e); 
        });
    return Array.from(words);
}

const get_tf_idf = (corpus: objNoticia[], words: string[]): objTFIDF[] => {
    const f = get_f(corpus, words);
    const tf=get_tf(f);
    const idf = get_idf(f,words);
    const temp: objTFIDF[] = [];
    for(let i = 0; i < idf.length; i++)
        if(words[i] !== ' ')
        temp.push({
            id: i,
            term: words[i],
            weights: tf[i].map(x => {
                let num = x * idf[i][1];
                num = Number.isInteger(num) ? num : parseFloat(num.toFixed(3));
                return num;
            }),
        });
    return temp;
}

const get_f = (corpus: objNoticia[], words: string[]): number[][] => {
    const f: number[][] = [];
    for(const word of words)
        f.push(ocurrencesInCorpus(word, corpus));
    return f;
}

const ocurrencesInCorpus = (word: string, corpus: objNoticia[]): number[]=> {
    const arr: number[] = [];
    for(const document in corpus)
        arr.push(ocurrencesInDocument(word,corpus[document].title + ' ' + corpus[document].content));
    return arr;
}

const ocurrencesInDocument = (word: string, document: string): number => {
    let cont = 0;
    //for(const w of preprocessDocument(document).split(' '))
    for(const w of document.split(' '))
        if(word === w.toLowerCase())
            cont++;
    return cont;
} 

const get_tf=(f: number[][]): number[][] =>  {
    const tf: number[][] = [];
    for(let i = 0; i < f.length; i++){
        tf.push(getWordFT(f[i]));
    }
    return tf;
}

const ft=(n:number): number =>{
    if(n <= 0) return 0;
    const res= (1 + Math.log2(n));
    return Number.isInteger(res) ? res : parseFloat(res.toFixed(3));
}  

const getWordFT = (array_frec:number[]): number[] => {
    return array_frec.map(ft);
}

const get_idf = (f: number[][],words: string[]): number[][] => {
    const idf: number[][] = [];
    for(let i = 0; i < f.length; i++){
        idf.push(getWordIDF(f[i]));
    }
    return idf;
}

const getWordIDF=(array_frec:number[]):number[]=>{
    const docs_appearances = array_frec.filter(x => x > 0).length;
    const idf_arr: number [] = [];
    idf_arr.push(docs_appearances);
    const idf_log = Math.log2(array_frec.length / docs_appearances);
    idf_arr.push(Number.isInteger(idf_log) ? idf_log : parseFloat(idf_log.toFixed(3)));
    return idf_arr;
}

const getDocumentWeight = (weights: number[]): number => {
    return weights.reduce((prev, current) => prev + current);
}

const getQueryWeights = (query_weights: objTFIDF[]): objDocWeight[] => { 
    const temp: objDocWeight[] = [];
    let cont = 0;
    for(let i = 0; i < query_weights[0].weights.length; i++){
        for(let j = 0; j < query_weights.length; j++)
            cont += query_weights[j].weights[i];
        temp.push({ id: i, weight: cont});
        cont = 0;
    }

    return temp;
}

const getCosineSimilarity=(documents: objTFIDF[],queryVec: objDocVector):objDocWeight[]=>{
    const docsVector:objDocVector[]=getDocVector(documents);
    console.log(docsVector.length);
    const temp: objDocWeight[] = [];
    for(let i = 0; i < docsVector.length; i++){
        temp.push({ id: i, weight: getCosine(docsVector[i],queryVec)});
    }
    return temp;
}
const getCosine=(doc: objDocVector,query: objDocVector):number=>{
    let productoPunto=0;
    let magnitudDoc=0;
    let magnitudQuery=0;
    for(let i = 0; i < doc.weights.length; i++){
        productoPunto+=doc.weights[i]*query.weights[i];
        magnitudDoc+=Math.pow(doc.weights[i],2);
        magnitudQuery+=Math.pow(query.weights[i],2);
    }
    const magnitud=Math.sqrt(magnitudDoc)*Math.sqrt(magnitudQuery);
    let num=productoPunto/magnitud;
        num = Number.isInteger(num) ? num : parseFloat(num.toFixed(4));
    return num;
}

const getDocVector=(documents: objTFIDF[]):objDocVector[]=>{
    const vector:objDocVector[]=[];
    for(let i = 0; i < documents[0].weights.length; i++){
        const temp:number[]=[];
        for(let j = 0; j < documents.length; j++)
            temp.push(documents[j].weights[i]);
        vector.push({ id: i, weights: temp});
    }
    return vector;
}

const getQueryVector=(corpus: objNoticia[],query: string, words: string[], idf: number[][]):objDocVector=>{
    const f: number[] = [];
    for(const word of words)
        f.push(ocurrencesInDocument(word, query));
    const tf: number[] = [];
    for(let i = 0; i < f.length; i++)
        tf.push(ft(f[i]));
    const temp:objDocVector={id:0,weights:[]};
    for(let i = 0; i < idf.length; i++)
        if(words[i] !== ' '){
            let num = tf[i] * idf[i][1];
            num = Number.isInteger(num) ? num : parseFloat(num.toFixed(3));
            temp.weights.push(num);
        }
    console.log(temp.weights.length);
    return temp;
    
}

export { 
    objNoticia,
    objDocWeight,
    getCorpus,
    processCorpus,
    getWords,
    preprocessDocument,
    get_f,
    get_tf,
    get_idf,
    get_tf_idf,
    getDocumentWeight,
    getQueryWeights,
    objTFIDF,
    objDocVector,
    getCosineSimilarity, 
    getCosine, 
    getDocVector,
    getQueryVector,
}