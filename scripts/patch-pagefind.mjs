import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const pagefindJs = join(process.cwd(), '.vitepress/dist/pagefind/pagefind.js')
let content = readFileSync(pagefindJs, 'utf8')

// Find the exact_search detection and add a fix
// Original problematic code:
// let exact_search=/^\s*".+"\s*$/.test(term);
// if(exact_search){log(`Running an exact search`);}
// ... Chinese segmentation runs regardless ...
// term=term_chunks.join(" ").replace(/\s{2,}/g," ").trim();

// Fixed: extract exact phrase BEFORE segmentation, skip segmentation for exact_search
const fixedSearchFn = `
async search(term,options2={}){options2={verbose:false,filters:{},sort:{},...options2};const log=(str)=>{if(options2.verbose)console.log(str);};log(\`Starting search on \${this.basePath}\`);let start=Date.now();let ptr=await this.getPtr();let filter_only=term===null;term=term??"";
let exact_search=/^\\s*".+"\\s*$/$.test(term);
let searchTerm = term;
if(exact_search){
  log(\`Running an exact search\`);
  searchTerm = term.replace(/^\\s*"(.+)"\\s*$/, '$1');
}
let trueLanguage=null;try{trueLanguage=Intl.getCanonicalLocales(this.loadedLanguage)[0];}catch(err2){}
const term_chunks=[];
if(!exact_search && trueLanguage&&typeof Intl.Segmenter!=="undefined"){
  const graphemeSegmenter=new Intl.Segmenter(trueLanguage,{granularity:"grapheme"});
  if(needsWordSegmentation(trueLanguage)){
    const wordSegmenter=new Intl.Segmenter(trueLanguage,{granularity:"word"});
    for(const{segment:word}of wordSegmenter.segment(searchTerm)){
      const wordChunks=[];
      for(const{segment:grapheme}of graphemeSegmenter.segment(word)){
        if(this.includeCharacters?.includes(grapheme)){wordChunks.push(grapheme);}
        else if(!/^[\\p{Pd}|\\p{Pe}|\\p{Pf}|\\p{Pi}|\\p{Po}|\\p{Ps}]$/u.test(grapheme)){wordChunks.push(grapheme.toLocaleLowerCase());}
      }
      if(wordChunks.length>0){term_chunks.push(wordChunks.join(""));}
    }
    term=term_chunks.join(" ").replace(/\\s{2,}/g," ").trim();
  }else{
    for(const{segment:grapheme}of graphemeSegmenter.segment(searchTerm)){
      if(this.includeCharacters?.includes(grapheme)){term_chunks.push(grapheme);}
      else if(!/^[\\p{Pd}|\\p{Pe}|\\p{Pf}|\\p{Pi}|\\p{Po}|\\p{Ps}]$/u.test(grapheme)){term_chunks.push(grapheme.toLocaleLowerCase());}
    }
    term=term_chunks.join("").replace(/\\s{2,}/g," ").trim();
  }
}else{
  for(const char of searchTerm){
    if(this.includeCharacters?.includes(char)){term_chunks.push(char);}
    else if(!/^[\\p{Pd}|\\p{Pe}|\\p{Pf}|\\p{Pi}|\\p{Po}|\\p{Ps}]$/u.test(char)){term_chunks.push(char.toLocaleLowerCase());}
  }
  term=term_chunks.join("").replace(/\\s{2,}/g," ").trim();
}
const originalTerm=term;term=normalizeDiacritics(term);log(\`Normalized search term to \${term}\`);if(!term?.length&&!filter_only){return{results:[],unfilteredResultCount:0,filters:{},totalFilters:{},timings:{preload:Date.now()-start,search:Date.now()-start,total:Date.now()-start}};}
let sort_list=this.stringifySorts(options2.sort);log(\`Stringified sort to \${sort_list}\`);
const filter_list=this.stringifyFilters(options2.filters);log(\`Stringified filters to \${filter_list}\`);
let index_resp=this.backend.request_indexes(ptr,term);let index_array=JSON.parse(index_resp);
let filter_resp=this.backend.request_filter_indexes(ptr,filter_list);let filter_array=JSON.parse(filter_resp);
let chunks=index_array.filter((v)=>v).map((chunk)=>this.loadChunk(chunk));
let filter_chunks=filter_array.filter((v)=>v).map((chunk)=>this.loadFilterChunk(chunk));
await Promise.all([...chunks,...filter_chunks]);log(\`Loaded necessary chunks to run search\`);
if(options2.preload){log(\`Preload \u2014 bailing out of search operation now.\`);return null;}
ptr=await this.getPtr();let searchStart=Date.now();
let result=this.backend.search(ptr,term,originalTerm,filter_list,sort_list,exact_search,this.exactDiacritics);
log(\`Got the raw search result: \${result}\`);`

// Replace the search function - use a more targeted approach
// Find the search function and replace the problematic section
const searchStartMarker = 'async search(term,options2={}){options2={verbose:false,filters:{},sort:{},...options2};const log=(str)=>{if(options2.verbose)console.log(str);};log(`Starting search on ${this.basePath}`);let start=Date.now();let ptr=await this.getPtr();let filter_only=term===null;term=term??"";let exact_search=/^\\s*".+"\\s*$/$.test(term);if(exact_search){log(`Running an exact search`);}let trueLanguage=null;try{trueLanguage=Intl.getCanonicalLocales(this.loadedLanguage)[0];}catch(err2){}const term_chunks=[];if(trueLanguage&&typeof Intl.Segmenter!=="undefined"){const graphemeSegmenter=new Intl.Segmenter(trueLanguage,{granularity:"grapheme"});if(needsWordSegmentation(trueLanguage)){const wordSegmenter=new Intl.Segmenter(trueLanguage,{granularity:"word"});for(const{segment:word}of wordSegmenter.segment(term)){const wordChunks=[];for(const{segment:grapheme}of graphemeSegmenter.segment(word)){if(this.includeCharacters?.includes(grapheme)){wordChunks.push(grapheme);}else if(!/^[\\p{Pd}|\\p{Pe}|\\p{Pf}|\\p{Pi}|\\p{Po}|\\p{Ps}]$/u.test(grapheme)){wordChunks.push(grapheme.toLocaleLowerCase());}}if(wordChunks.length>0){term_chunks.push(wordChunks.join(""));}}term=term_chunks.join(" ").replace(/\\s{2,}/g," ").trim();}else{for(const{segment:grapheme}of graphemeSegmenter.segment(term)){if(this.includeCharacters?.includes(grapheme)){term_chunks.push(grapheme);}else if(!/^[\\p{Pd}|\\p{Pe}|\\p{Pf}|\\p{Pi}|\\p{Po}|\\p{Ps}]$/u.test(grapheme)){term_chunks.push(grapheme.toLocaleLowerCase());}}term=term_chunks.join("").replace(/\\s{2,}/g," ").trim();}}else{for(const char of term){if(this.includeCharacters?.includes(char)){term_chunks.push(char);}else if(!/^[\\p{Pd}|\\p{Pe}|\\p{Pf}|\\p{Pi}|\\p{Po}|\\p{Ps}]$/u.test(char)){term_chunks.push(char.toLocaleLowerCase());}}term=term_chunks.join("").replace(/\\s{2,}/g," ").trim();}const originalTerm=term;term=normalizeDiacritics(term);log(`Normalized search term to ${term}`);if(!term?.length&&!filter_only){return{results:[],unfilteredResultCount:0,filters:{},totalFilters:{},timings:{preload:Date.now()-start,search:Date.now()-start,total:Date.now()-start}};}let sort_list=this.stringifySorts(options2.sort);log(`Stringified sort to ${sort_list}`);const filter_list=this.stringifyFilters(options2.filters);log(`Stringified filters to ${filter_list}`);let index_resp=this.backend.request_indexes(ptr,term);let index_array=JSON.parse(index_resp);let filter_resp=this.backend.request_filter_indexes(ptr,filter_list);let filter_array=JSON.parse(filter_resp);let chunks=index_array.filter((v)=>v).map((chunk)=>this.loadChunk(chunk));let filter_chunks=filter_array.filter((v)=>v).map((chunk)=>this.loadFilterChunk(chunk));await Promise.all([...chunks,...filter_chunks]);log(`Loaded necessary chunks to run search`);if(options2.preload){log(`Preload \u2014 bailing out of search operation now.`);return null;}ptr=await this.getPtr();let searchStart=Date.now();let result=this.backend.search(ptr,term,originalTerm,filter_list,sort_list,exact_search,this.exactDiacritics);log(`Got the raw search result: ${result}`);'

// The bundle is minified, so we need to find and replace the specific pattern
// Let's do a targeted replacement using the exact minified code pattern

// Pattern: let exact_search=/^\s*".+"\s*$/.test(term);if(exact_search){log(`Running an exact search`);}let trueLanguage
// Replace with: let exact_search=/^\s*".+"\s*$/.test(term);let searchTerm=term;if(exact_search){log(`Running an exact search`);searchTerm=term.replace(/^\s*"(.+)"\s*$/, '$1');}let trueLanguage
// And: if(trueLanguage&&typeof Intl.Segmenter!=="undefined")
// Replace with: if(!exact_search&&trueLanguage&&typeof Intl.Segmenter!=="undefined")
// And: for(const{segment:word}of wordSegmenter.segment(term)){
// Replace with: for(const{segment:word}of wordSegmenter.segment(searchTerm)){
// And: for(const{segment:grapheme}of graphemeSegmenter.segment(term)){
// Replace with: for(const{segment:grapheme}of graphemeSegmenter.segment(searchTerm)){
// And: for(const char of term){
// Replace with: for(const char of searchTerm){

const patterns = [
  // 1. Add searchTerm variable after exact_search detection and strip quotes
  {
    from: 'let exact_search=/^\\s*".+"\\s*$/.test(term);if(exact_search){log',
    to: 'let exact_search=/^\\s*".+"\\s*$/.test(term);let searchTerm=term;if(exact_search){searchTerm=term.replace(/^\\s*"(.+)"\\s*$/, \'$1\');log'
  },
  // 2. Skip segmentation for exact_search
  {
    from: 'if(trueLanguage&&typeof Intl.Segmenter!=="undefined"){const graphemeSegmenter',
    to: 'if(!exact_search&&trueLanguage&&typeof Intl.Segmenter!=="undefined"){const graphemeSegmenter'
  },
  // 3. Use searchTerm in wordSegmenter.segment()
  {
    from: 'for(const{segment:word}of wordSegmenter.segment(term)){',
    to: 'for(const{segment:word}of wordSegmenter.segment(searchTerm)){'
  },
  // 4. Use searchTerm in graphemeSegmenter.segment()
  {
    from: 'for(const{segment:grapheme}of graphemeSegmenter.segment(term)){',
    to: 'for(const{segment:grapheme}of graphemeSegmenter.segment(searchTerm)){'
  },
  // 5. Use searchTerm in non-CJK path
  {
    from: 'for(const char of term){',
    to: 'for(const char of searchTerm){'
  }
]

let modified = content
let applied = 0
for (const { from, to } of patterns) {
  if (modified.includes(from)) {
    modified = modified.replace(from, to)
    applied++
    console.log(`Applied pattern ${applied}`)
  } else {
    console.warn(`Pattern NOT found: ${from.substring(0, 80)}...`)
  }
}

if (applied === patterns.length) {
  writeFileSync(pagefindJs, modified)
  console.log('Pagefind.js patched successfully!')
} else {
  console.error(`Only ${applied}/${patterns.length} patterns applied. Aborting.`)
  process.exit(1)
}