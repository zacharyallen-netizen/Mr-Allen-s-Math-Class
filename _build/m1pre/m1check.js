/* ===== Math 1 answer types (added to the pre-test engine's runCheck) ===== */
const M1=(function(){
  const SUPD={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','⁺':'+'};
  function norm(raw){
    let s=String(raw==null?'':raw).trim();
    s=s.replace(/[−–—]/g,'-').replace(/[×·⋅∙•]/g,'*').replace(/÷/g,'/').replace(/π/g,'pi');
    s=s.replace(/\*\*/g,'^');
    s=s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g,m=>'^('+m.replace(/./g,c=>SUPD[c])+')');   // x² -> x^(2), x⁻² -> x^(-2)
    s=s.replace(/[½⅓⅔¼¾]/g,c=>({'½':'(1/2)','⅓':'(1/3)','⅔':'(2/3)','¼':'(1/4)','¾':'(3/4)'})[c]);
    s=s.replace(/∞/g,'inf');
    s=s.replace(/∛/g,'cbrt').replace(/√/g,'sqrt');
    s=s.replace(/ₙ/g,'n').replace(/a_n/gi,'an');
    s=s.replace(/≤|=</g,'<=').replace(/≥|=>/g,'>=');
    return s.toLowerCase().replace(/\s+/g,'');
  }
  /* ---- tiny expression parser: + - * / ^, ( ), implicit ×, sqrt cbrt, one-letter variables ---- */
  function tokens(s){
    const t=[];let i=0;
    while(i<s.length){
      const c=s[i];
      if(/[0-9.]/.test(c)){let j=i;while(j<s.length&&/[0-9.]/.test(s[j]))j++;const v=s.slice(i,j);if((v.match(/\./g)||[]).length>1)throw 0;t.push({k:'n',v:parseFloat(v)});i=j;continue;}
      if(s.startsWith('sqrt',i)){t.push({k:'f',v:'sqrt'});i+=4;continue;}
      if(s.startsWith('cbrt',i)){t.push({k:'f',v:'cbrt'});i+=4;continue;}
      if(s.startsWith('pi',i)){t.push({k:'n',v:Math.PI});i+=2;continue;}
      if(/[a-z]/.test(c)){t.push({k:'v',v:c});i++;continue;}
      if('+-*/^()'.includes(c)){t.push({k:c});i++;continue;}
      if(c==='['){t.push({k:'('});i++;continue;}
      if(c===']'){t.push({k:')'});i++;continue;}
      throw 0;
    }
    return t;
  }
  function parse(str){
    const t=tokens(str);let p=0;
    const peek=()=>t[p], eat=k=>{if(!t[p]||t[p].k!==k)throw 0;return t[p++];};
    function expr(){let n=term();while(peek()&&(peek().k==='+'||peek().k==='-')){const o=t[p++].k;n={o:o,a:n,b:term()};}return n;}
    function startsAtom(x){return x&&(x.k==='n'||x.k==='v'||x.k==='f'||x.k==='(');}
    function term(){let n=unary();
      while(peek()&&(peek().k==='*'||peek().k==='/'||startsAtom(peek()))){
        let o='*';if(peek().k==='*'||peek().k==='/')o=t[p++].k;else o='i';
        n={o:o==='i'?'*':o,a:n,b:unary(),imp:o==='i'};}
      return n;}
    function unary(){if(peek()&&peek().k==='-'){p++;return {o:'neg',a:unary()};}if(peek()&&peek().k==='+'){p++;return unary();}return power();}
    function power(){const b=atom();if(peek()&&peek().k==='^'){p++;return {o:'^',a:b,b:unary()};}return b;}
    function atom(){const x=t[p++];if(!x)throw 0;
      if(x.k==='n')return {o:'n',v:x.v};
      if(x.k==='v')return {o:'v',v:x.v};
      if(x.k==='f'){return {o:x.v,a:power()};}
      if(x.k==='('){const e=expr();eat(')');return {o:'()',a:e};}
      throw 0;}
    const r=expr();if(p!==t.length)throw 0;return r;
  }
  function ev(n,env){
    switch(n.o){
      case 'n':return n.v;
      case 'v':if(!(n.v in env))throw 0;return env[n.v];
      case '()':return ev(n.a,env);
      case 'neg':return -ev(n.a,env);
      case '+':return ev(n.a,env)+ev(n.b,env);
      case '-':return ev(n.a,env)-ev(n.b,env);
      case '*':return ev(n.a,env)*ev(n.b,env);
      case '/':return ev(n.a,env)/ev(n.b,env);
      case '^':return Math.pow(ev(n.a,env),ev(n.b,env));
      case 'sqrt':return Math.sqrt(ev(n.a,env));
      case 'cbrt':return Math.cbrt(ev(n.a,env));
    }
    throw 0;
  }
  function tryParse(s){try{return parse(s);}catch(e){return null;}}
  function num(s){const a=tryParse(s);if(!a)return NaN;try{return ev(a,{});}catch(e){return NaN;}}
  function close(a,b,tol){if(!isFinite(a)||!isFinite(b))return false;return Math.abs(a-b)<=(tol==null?Math.max(1e-7,Math.abs(b)*1e-7):tol);}
  /* strip a leading name like y=, f(x)=, p(t)=, an=, (f+g)(x)=, l= */
  function stripLHS(s){
    const i=s.indexOf('=');if(i<0)return s;
    if(s.indexOf('=',i+1)>=0)return null;
    const L=s.slice(0,i);
    if(/^[a-z]{1,2}(\([a-z]\))?$/.test(L)||/^\([a-z][+\-*\/][a-z]\)\([a-z]\)$/.test(L))return s.slice(i+1);
    return null;
  }
  const SAMPLES=[[1.37,2.21,0.83],[2.9,1.13,3.41],[0.61,3.07,1.79],[1.91,0.73,2.53],[3.3,2.6,1.2]];
  function sameExpr(stu,key,vars){
    const A=tryParse(stu),B=tryParse(key);if(!A||!B)return false;
    for(const smp of SAMPLES){const env={};vars.forEach((v,i)=>env[v]=smp[i%smp.length]+0.17*i);
      let a,b;try{a=ev(A,env);b=ev(B,env);}catch(e){return false;}
      if(!isFinite(a)||!isFinite(b)||Math.abs(a-b)>1e-6*Math.max(1,Math.abs(b)))return false;}
    return true;
  }
  function topIsProduct(n){while(n.o==='neg')n=n.a;return n.o==='*'||n.o==='^';}
  function hasSum(n){if(!n||typeof n!=='object')return false;if(n.o==='+'||n.o==='-')return true;return hasSum(n.a)||hasSum(n.b);}
  function cleanUnits(s){const m=s.match(/^([-+]?[0-9.\/]+)[a-z$%°]*$/);return m?m[1]:s;}
  /* ---- answer types ---- */
  const T={};
  T.n=(c,raw)=>{  // number: ['n', value, tol]
    let s=norm(raw).replace(/^[a-z]{1,2}(\([a-z0-9]\))?(=|≈)/,'').replace(/[$,%°]/g,'').replace(/≈/g,'');
    let v=num(s);if(!isFinite(v))v=num(cleanUnits(s));
    if(!isFinite(v))v=parseNumber(raw);
    return close(v,c[1],c[2]);
  };
  T.expr=(c,raw)=>{ // ['expr', key, vars, {form:'fact'|'mono'|'paren', need:'regex'}]
    let s=stripLHS(norm(raw).replace(/(\d),(?=\d{3}(?!\d))/g,'$1'));if(s==null||s==='')return false;
    const o=c[3]||{};
    if(o.need&&!(new RegExp(o.need)).test(s))return false;
    const A=tryParse(s);if(!A)return false;
    if(o.form==='fact'&&!topIsProduct(A))return false;
    if(o.form==='mono'){if(/[()]/.test(s.replace(/\^\(-?[0-9\/]+\)/g,'')))return false;if(hasSum(A))return false;
      const vs=s.replace(/sqrt|cbrt|pi/g,'').match(/[a-z]/g)||[];if(new Set(vs).size!==vs.length)return false;}
    if(o.form==='paren'&&!/\(/.test(s))return false;
    if(o.form==='expand'&&/[()]/.test(s.replace(/\^\([^()]*\)/g,'')))return false;
    return sameExpr(s,c[1],c[2]);
  };
  function pieces(s){
    s=s.replace(/^\{|\}$/g,'').replace(/(and|or)/g,',').replace(/;/g,',');
    s=s.replace(/[a-z]=/g,',');                 // x=2,x=-3  ->  ,2,,-3
    let out=[];
    s.split(',').filter(x=>x!=='').forEach(x=>{
      if(x.includes('±')||x.includes('+-')){const k=x.replace('+-','±').indexOf('±');const xx=x.replace('+-','±');
        const a=xx.slice(0,k),b=xx.slice(k+1);out.push((a||'0')+'+('+b+')');out.push((a||'0')+'-('+b+')');}
      else out.push(x);});
    return out;
  }
  T.set=(c,raw)=>{ // ['set', [values], tol]
    const s=norm(raw);if(!s)return false;
    const vals=pieces(s).map(num);if(vals.some(v=>!isFinite(v)))return false;
    const tol=c[2]==null?1e-6:c[2];
    const uniq=[];vals.forEach(v=>{if(!uniq.some(u=>Math.abs(u-v)<=tol))uniq.push(v);});
    const key=c[1];
    return uniq.length===key.length&&key.every(k=>uniq.some(u=>Math.abs(u-k)<=tol));
  };
  T.pt=(c,raw)=>{ // ['pt', x, y]
    let s=norm(raw).replace(/^[a-z]=?(?=\()/,'');
    s=s.replace(/^\((.*)\)$/,'$1');
    let m=s.match(/^x=(.+),y=(.+)$/)||s.match(/^(.+),(.+)$/);if(!m)return false;
    return close(num(m[1]),c[1],1e-6)&&close(num(m[2]),c[2],1e-6);
  };
  function flip(o){return {'<':'>','>':'<','<=':'>=','>=':'<='}[o];}
  T.ineq=(c,raw)=>{ // ['ineq', var, op, value, loose]  loose: < and <= both fine
    const s=norm(raw);const v=c[1];let op,val;
    let m=s.match(new RegExp('^'+v+'(<=|>=|<|>)(.+)$'));
    if(m){op=m[1];val=num(m[2]);}
    else if((m=s.match(new RegExp('^(.+?)(<=|>=|<|>)'+v+'$')))){op=flip(m[2]);val=num(m[1]);}
    else if((m=s.match(/^\(-inf(?:inity)?,(.+)([\)\]])$/))){op=m[2]===']'?'<=':'<';val=num(m[1]);}
    else if((m=s.match(/^([\(\[])(.+),inf(?:inity)?\)$/))){op=m[1]==='['?'>=':'>';val=num(m[2]);}
    else return false;
    const want=c[2];
    const sameDir=op[0]===want[0], sameStrict=op.length===want.length;
    return close(val,c[3],1e-6)&&sameDir&&(sameStrict||!!c[4]);
  };
  T.ineq2=(c,raw)=>{ // ['ineq2', var, lo, loIncl, hi, hiIncl]
    const s=norm(raw);const v=c[1];let m,lo,hi,li,hiI;
    if((m=s.match(new RegExp('^(.+?)(<=|<)'+v+'(<=|<)(.+)$')))){lo=num(m[1]);li=m[2]==='<=';hi=num(m[4]);hiI=m[3]==='<=';}
    else if((m=s.match(new RegExp('^(.+?)(>=|>)'+v+'(>=|>)(.+)$')))){hi=num(m[1]);hiI=m[2]==='>=';lo=num(m[4]);li=m[3]==='>=';}
    else if((m=s.match(/^([\(\[])(.+),(.+)([\)\]])$/))){lo=num(m[2]);hi=num(m[3]);li=m[1]==='[';hiI=m[4]===']';}
    else return false;
    return close(lo,c[2],1e-6)&&close(hi,c[4],1e-6)&&li===c[3]&&hiI===c[5];
  };
  T.lineineq=(c,raw)=>{ // ['lineineq', op, m, b]  : y op m x + b, any equivalent form
    const s=norm(raw);const m=s.match(/^(.+?)(<=|>=|<|>)(.+)$/);if(!m)return false;
    const L=tryParse(m[1]),R=tryParse(m[3]);if(!L||!R)return false;
    const op=m[2];const strict=op.length===1, kstrict=c[1].length===1;if(strict!==kstrict)return false;
    const f=(x,y)=>ev(L,{x:x,y:y})-ev(R,{x:x,y:y});
    const test=(d,o)=>o[0]==='<'?d<0:d>0;
    try{
      for(let i=0;i<6;i++){const x=-4+i*1.7, yb=c[2]*x+c[3];if(Math.abs(f(x,yb))>1e-6)return false;}   // same boundary line
      for(let i=0;i<12;i++){const x=-5+i*0.9, y=c[2]*x+c[3]+((i%2)?2.3:-1.9);
        const kt=test(y-(c[2]*x+c[3]),c[1]), st=test(f(x,y),op);if(kt!==st)return false;}
    }catch(e){return false;}
    return true;
  };
  T.eqn=(c,raw)=>{ // ['eqn', [accepted equations]] exact form, spaces ignored
    const s=norm(raw);return c[1].some(a=>norm(a)===s);
  };
  T.words=(c,raw)=>{ // ['words', [[alt,alt],[alt]]] every group needs one word
    const s=' '+String(raw||'').toLowerCase().replace(/[−–]/g,'-').replace(/[^a-z0-9.\- ]/g,' ').replace(/\s+/g,' ')+' ';
    return c[1].every(g=>g.some(w=>s.includes(' '+w+' ')));
  };
  T.any=(c,raw)=>c.slice(1).some(k=>runCheck(k,raw));
  return {T:T,norm:norm,num:num,parse:tryParse,sameExpr:sameExpr};
})();
