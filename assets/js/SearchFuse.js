/**
 * Fuse.js v7.0.0 - Lightweight fuzzy-search (http://fusejs.io)
 */
Fuse = (function(){"use strict";function e(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function t(t){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?e(Object(r),!0).forEach((function(e){c(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):e(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,v(r.key),r)}}function o(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function c(e,t,n){return(t=v(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&u(e,t)}function s(e){return s=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},s(e)}function u(e,t){return u=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},u(e,t)}function h(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function l(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=s(e);if(t){var i=s(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return h(this,n)}}function f(e){return function(e){if(Array.isArray(e))return d(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return d(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?d(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function v(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:String(t)}function g(e){return Array.isArray?Array.isArray(e):"[object Array]"===S(e)}var y=1/0;function p(e){return null==e?"":function(e){if("string"==typeof e)return e;var t=e+"";return"0"==t&&1/e==-y?"-0":t}(e)}function m(e){return"string"==typeof e}function k(e){return"number"==typeof e}function M(e){return!0===e||!1===e||function(e){return b(e)&&null!==e}(e)&&"[object Boolean]"==S(e)}function b(e){return"object"===n(e)}function x(e){return null!=e}function w(e){return!e.trim().length}function S(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}var L=function(e){return"Missing ".concat(e," property in key")},_=function(e){return"Property 'weight' in key '".concat(e,"' must be a positive integer")},O=Object.prototype.hasOwnProperty,j=function(){function e(t){var n=this;r(this,e),this._keys=[],this._keyMap={};var i=0;t.forEach((function(e){var t=A(e);n._keys.push(t),n._keyMap[t.id]=t,i+=t.weight})),this._keys.forEach((function(e){e.weight/=i}))}return o(e,[{key:"get",value:function(e){return this._keyMap[e]}},{key:"keys",value:function(){return this._keys}},{key:"toJSON",value:function(){return JSON.stringify(this._keys)}}]),e}();function A(e){var t=null,n=null,r=null,i=1,o=null;if(m(e)||g(e))r=e,t=I(e),n=C(e);else{if(!O.call(e,"name"))throw new Error(L("name"));var c=e.name;if(r=c,O.call(e,"weight")&&(i=e.weight)<=0)throw new Error(_(c));t=I(c),n=C(c),o=e.getFn}return{path:t,id:n,weight:i,src:r,getFn:o}}function I(e){return g(e)?e:e.split(".")}function C(e){return g(e)?e.join("."):e}var E={useExtendedSearch:!1,getFn:function(e,t){var n=[],r=!1;return function e(t,i,o){if(x(t))if(i[o]){var c=t[i[o]];if(!x(c))return;if(o===i.length-1&&(m(c)||k(c)||M(c)))n.push(p(c));else if(g(c)){r=!0;for(var a=0,s=c.length;a<s;a+=1)e(c[a],i,o+1)}else i.length&&e(c,i,o+1)}else n.push(t)}(e,m(t)?t.split("."):t,0),r?n:n[0]},ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1},$=t(t(t(t({},{isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:function(e,t){return e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1}}),{includeMatches:!1,findAllMatches:!1,minMatchCharLength:1}),{location:0,threshold:.6,distance:100}),E),F=/[^ ]+/g,R=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=t.getFn,i=void 0===n?$.getFn:n,o=t.fieldNormWeight,c=void 0===o?$.fieldNormWeight:o;r(this,e),this.norm=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3,n=new Map,r=Math.pow(10,t);return{get:function(t){var i=t.match(F).length;if(n.has(i))return n.get(i);var o=1/Math.pow(i,.5*e),c=parseFloat(Math.round(o*r)/r);return n.set(i,c),c},clear:function(){n.clear()}}}(c,3),this.getFn=i,this.isCreated=!1,this.setIndexRecords()}return o(e,[{key:"setSources",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.docs=e}},{key:"setIndexRecords",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.records=e}},{key:"setKeys",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.keys=t,this._keysMap={},t.forEach((function(t,n){e._keysMap[t.id]=n}))}},{key:"create",value:function(){var e=this;!this.isCreated&&this.docs.length&&(this.isCreated=!0,m(this.docs[0])?this.docs.forEach((function(t,n){e._addString(t,n)})):this.docs.forEach((function(t,n){e._addObject(t,n)})),this.norm.clear())}},{key:"add",value:function(e){var t=this.size();m(e)?this._addString(e,t):this._addObject(e,t)}},{key:"removeAt",value:function(e){this.records.splice(e,1);for(var t=e,n=this.size();t<n;t+=1)this.records[t].i-=1}},{key:"getValueForItemAtKeyId",value:function(e,t){return e[this._keysMap[t]]}},{key:"size",value:function(){return this.records.length}},{key:"_addString",value:function(e,t){if(x(e)&&!w(e)){var n={v:e,i:t,n:this.norm.get(e)};this.records.push(n)}}},{key:"_addObject",value:function(e,t){var n=this,r={i:t,$:{}};this.keys.forEach((function(t,i){var o=t.getFn?t.getFn(e):n.getFn(e,t.path);if(x(o))if(g(o)){for(var c=[],a=[{nestedArrIndex:-1,value:o}];a.length;){var s=a.pop(),u=s.nestedArrIndex,h=s.value;if(x(h))if(m(h)&&!w(h)){var l={v:h,i:u,n:n.norm.get(h)};c.push(l)}else g(h)&&h.forEach((function(e,t){a.push({nestedArrIndex:t,value:e})}))}r.$[i]=c}else if(m(o)&&!w(o)){var f={v:o,n:n.norm.get(o)};r.$[i]=f}})),this.records.push(r)}},{key:"toJSON",value:function(){return{keys:this.keys,records:this.records}}}]),e}();function P(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=n.getFn,i=void 0===r?$.getFn:r,o=n.fieldNormWeight,c=void 0===o?$.fieldNormWeight:o,a=new R({getFn:i,fieldNormWeight:c});return a.setKeys(e.map(A)),a.setSources(t),a.create(),a}function N(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.errors,r=void 0===n?0:n,i=t.currentLocation,o=void 0===i?0:i,c=t.expectedLocation,a=void 0===c?0:c,s=t.distance,u=void 0===s?$.distance:s,h=t.ignoreLocation,l=void 0===h?$.ignoreLocation:h,f=r/e.length;if(l)return f;var d=Math.abs(a-o);return u?f+d/u:d?1:f}var W=32;function T(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},i=r.location,o=void 0===i?$.location:i,c=r.distance,a=void 0===c?$.distance:c,s=r.threshold,u=void 0===s?$.threshold:s,h=r.findAllMatches,l=void 0===h?$.findAllMatches:h,f=r.minMatchCharLength,d=void 0===f?$.minMatchCharLength:f,v=r.includeMatches,g=void 0===v?$.includeMatches:v,y=r.ignoreLocation,p=void 0===y?$.ignoreLocation:y;if(t.length>W)throw new Error("Pattern length exceeds max of ".concat(W,"."));for(var m,k=t.length,M=e.length,b=Math.max(0,Math.min(o,M)),x=u,w=b,S=d>1||g,L=S?Array(M):[];(m=e.indexOf(t,w))>-1;){var _=N(t,{currentLocation:m,expectedLocation:b,distance:a,ignoreLocation:p});if(x=Math.min(_,x),w=m+k,S)for(var O=0;O<k;)L[m+O]=1,O+=1}w=-1;for(var j=[],A=1,I=k+M,C=1<<k-1,E=0;E<k;E+=1){for(var F=0,R=I;F<R;)N(t,{errors:E,currentLocation:b+R,expectedLocation:b,distance:a,ignoreLocation:p})<=x?F=R:I=R,R=Math.floor((I-F)/2+F);I=R;var P=Math.max(1,b-R+1),T=l?M:Math.min(b+R,M)+k,z=Array(T+2);z[T+1]=(1<<E)-1;for(var D=T;D>=P;D-=1){var K=D-1,q=n[e.charAt(K)];if(S&&(L[K]=+!!q),z[D]=(z[D+1]<<1|1)&q,E&&(z[D]|=(j[D+1]|j[D])<<1|1|j[D+1]),z[D]&C&&(A=N(t,{errors:E,currentLocation:K,expectedLocation:b,distance:a,ignoreLocation:p}))<=x){if(x=A,(w=K)<=b)break;P=Math.max(1,2*b-w)}}if(N(t,{errors:E+1,currentLocation:b,expectedLocation:b,distance:a,ignoreLocation:p})>x)break;j=z}var B={isMatch:w>=0,score:Math.max(.001,A)};if(S){var J=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:$.minMatchCharLength,n=[],r=-1,i=-1,o=0,c=e.length;o<c;o+=1){var a=e[o];a&&-1===r?r=o:a||-1===r||((i=o-1)-r+1>=t&&n.push([r,i]),r=-1)}return e[o-1]&&o-r>=t&&n.push([r,o-1]),n}(L,d);J.length?g&&(B.indices=J):B.isMatch=!1}return B}function z(e){for(var t={},n=0,r=e.length;n<r;n+=1){var i=e.charAt(n);t[i]=(t[i]||0)|1<<r-n-1}return t}var D=function(){function e(t){var n=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=i.location,c=void 0===o?$.location:o,a=i.threshold,s=void 0===a?$.threshold:a,u=i.distance,h=void 0===u?$.distance:u,l=i.includeMatches,f=void 0===l?$.includeMatches:l,d=i.findAllMatches,v=void 0===d?$.findAllMatches:d,g=i.minMatchCharLength,y=void 0===g?$.minMatchCharLength:g,p=i.isCaseSensitive,m=void 0===p?$.isCaseSensitive:p,k=i.ignoreLocation,M=void 0===k?$.ignoreLocation:k;if(r(this,e),this.options={location:c,threshold:s,distance:h,includeMatches:f,findAllMatches:v,minMatchCharLength:y,isCaseSensitive:m,ignoreLocation:M},this.pattern=m?t:t.toLowerCase(),this.chunks=[],this.pattern.length){var b=function(e,t){n.chunks.push({pattern:e,alphabet:z(e),startIndex:t})},x=this.pattern.length;if(x>W){for(var w=0,S=x%W,L=x-S;w<L;)b(this.pattern.substr(w,W),w),w+=W;if(S){var _=x-W;b(this.pattern.substr(_),_)}}else b(this.pattern,0)}}return o(e,[{key:"searchIn",value:function(e){var t=this.options,n=t.isCaseSensitive,r=t.includeMatches;if(n||(e=e.toLowerCase()),this.pattern===e){var i={isMatch:!0,score:0};return r&&(i.indices=[[0,e.length-1]]),i}var o=this.options,c=o.location,a=o.distance,s=o.threshold,u=o.findAllMatches,h=o.minMatchCharLength,l=o.ignoreLocation,d=[],v=0,g=!1;this.chunks.forEach((function(t){var n=t.pattern,i=t.alphabet,o=t.startIndex,y=T(e,n,i,{location:c+o,distance:a,threshold:s,findAllMatches:u,minMatchCharLength:h,includeMatches:r,ignoreLocation:l}),p=y.isMatch,m=y.score,k=y.indices;p&&(g=!0),v+=m,p&&k&&(d=[].concat(f(d),f(k)))}));var y={isMatch:g,score:g?v/this.chunks.length:1};return g&&r&&(y.indices=d),y}}]),e}(),K=function(){function e(t){r(this,e),this.pattern=t}return o(e,[{key:"search",value:function(){}}],[{key:"isMultiMatch",value:function(e){return q(e,this.multiRegex)}},{key:"isSingleMatch",value:function(e){return q(e,this.singleRegex)}}]),e}();function q(e,t){var n=e.match(t);return n?n[1]:null}var B=function(e){a(n,e);var t=l(n);function n(e){return r(this,n),t.call(this,e)}return o(n,[{key:"search",value:function(e){var t=e===this.pattern;return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}}],[{key:"type",get:function(){return"exact"}},{key:"multiRegex",get:function(){return/^="(.*)"$/}},{key:"singleRegex",get:function(){return/^=(.*)$/}}]),n}(K),J=function(e){a(n,e);var t=l(n);function n(e){return r(this,n),t.call(this,e)}return o(n,[{key:"search",value:function(e){var t=-1===e.indexOf(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}],[{key:"type",get:function(){return"inverse-exact"}},{key:"multiRegex",get:function(){return/^!"(.*)"$/}},{key:"singleRegex",get:function(){return/^!(.*)$/}}]),n}(K),U=function(e){a(n,e);var t=l(n);function n(e){return r(this,n),t.call(this,e)}return o(n,[{key:"search",value:function(e){var t=e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}}],[{key:"type",get:function(){return"prefix-exact"}},{key:"multiRegex",get:function(){return/^\^"(.*)"$/}},{key:"singleRegex",get:function(){return/^\^(.*)$/}}]),n}(K),V=function(e){a(n,e);var t=l(n);function n(e){return r(this,n),t.call(this,e)}return o(n,[{key:"search",value:function(e){var t=!e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}],[{key:"type",get:function(){return"inverse-prefix-exact"}},{key:"multiRegex",get:function(){return/^!\^"(.*)"$/}},{key:"singleRegex",get:function(){return/^!\^(.*)$/}}]),n}(K),G=function(e){a(n,e);var t=l(n);function n(e){return r(this,n),t.call(this,e)}return o(n,[{key:"search",value:function(e){var t=e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[e.length-this.pattern.length,e.length-1]}}}],[{key:"type",get:function(){return"suffix-exact"}},{key:"multiRegex",get:function(){return/^"(.*)"\$$/}},{key:"singleRegex",get:function(){return/^(.*)\$$/}}]),n}(K),H=function(e){a(n,e);var t=l(n);function n(e){return r(this,n),t.call(this,e)}return o(n,[{key:"search",value:function(e){var t=!e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}],[{key:"type",get:function(){return"inverse-suffix-exact"}},{key:"multiRegex",get:function(){return/^!"(.*)"\$$/}},{key:"singleRegex",get:function(){return/^!(.*)\$$/}}]),n}(K),Q=function(e){a(n,e);var t=l(n);function n(e){var i,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},c=o.location,a=void 0===c?$.location:c,s=o.threshold,u=void 0===s?$.threshold:s,h=o.distance,l=void 0===h?$.distance:h,f=o.includeMatches,d=void 0===f?$.includeMatches:f,v=o.findAllMatches,g=void 0===v?$.findAllMatches:v,y=o.minMatchCharLength,p=void 0===y?$.minMatchCharLength:y,m=o.isCaseSensitive,k=void 0===m?$.isCaseSensitive:m,M=o.ignoreLocation,b=void 0===M?$.ignoreLocation:M;return r(this,n),(i=t.call(this,e))._bitapSearch=new D(e,{location:a,threshold:u,distance:l,includeMatches:d,findAllMatches:g,minMatchCharLength:p,isCaseSensitive:k,ignoreLocation:b}),i}return o(n,[{key:"search",value:function(e){return this._bitapSearch.searchIn(e)}}],[{key:"type",get:function(){return"fuzzy"}},{key:"multiRegex",get:function(){return/^"(.*)"$/}},{key:"singleRegex",get:function(){return/^(.*)$/}}]),n}(K),X=function(e){a(n,e);var t=l(n);function n(e){return r(this,n),t.call(this,e)}return o(n,[{key:"search",value:function(e){for(var t,n=0,r=[],i=this.pattern.length;(t=e.indexOf(this.pattern,n))>-1;)n=t+i,r.push([t,n-1]);var o=!!r.length;return{isMatch:o,score:o?0:1,indices:r}}}],[{key:"type",get:function(){return"include"}},{key:"multiRegex",get:function(){return/^'"(.*)"$/}},{key:"singleRegex",get:function(){return/^'(.*)$/}}]),n}(K),Y=[B,X,U,V,H,G,J,Q],Z=Y.length,ee=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,te=new Set([Q.type,X.type]),ne=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=n.isCaseSensitive,o=void 0===i?$.isCaseSensitive:i,c=n.includeMatches,a=void 0===c?$.includeMatches:c,s=n.minMatchCharLength,u=void 0===s?$.minMatchCharLength:s,h=n.ignoreLocation,l=void 0===h?$.ignoreLocation:h,f=n.findAllMatches,d=void 0===f?$.findAllMatches:f,v=n.location,g=void 0===v?$.location:v,y=n.threshold,p=void 0===y?$.threshold:y,m=n.distance,k=void 0===m?$.distance:m;r(this,e),this.query=null,this.options={isCaseSensitive:o,includeMatches:a,minMatchCharLength:u,findAllMatches:d,ignoreLocation:l,location:g,threshold:p,distance:k},this.pattern=o?t:t.toLowerCase(),this.query=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e.split("|").map((function(e){for(var n=e.trim().split(ee).filter((function(e){return e&&!!e.trim()})),r=[],i=0,o=n.length;i<o;i+=1){for(var c=n[i],a=!1,s=-1;!a&&++s<Z;){var u=Y[s],h=u.isMultiMatch(c);h&&(r.push(new u(h,t)),a=!0)}if(!a)for(s=-1;++s<Z;){var l=Y[s],f=l.isSingleMatch(c);if(f){r.push(new l(f,t));break}}}return r}))}(this.pattern,this.options)}return o(e,[{key:"searchIn",value:function(e){var t=this.query;if(!t)return{isMatch:!1,score:1};var n=this.options,r=n.includeMatches;e=n.isCaseSensitive?e:e.toLowerCase();for(var i=0,o=[],c=0,a=0,s=t.length;a<s;a+=1){var u=t[a];o.length=0,i=0;for(var h=0,l=u.length;h<l;h+=1){var d=u[h],v=d.search(e),g=v.isMatch,y=v.indices,p=v.score;if(!g){c=0,i=0,o.length=0;break}if(i+=1,c+=p,r){var m=d.constructor.type;te.has(m)?o=[].concat(f(o),f(y)):o.push(y)}}if(i){var k={isMatch:!0,score:c/i};return r&&(k.indices=o),k}}return{isMatch:!1,score:1}}}],[{key:"condition",value:function(e,t){return t.useExtendedSearch}}]),e}(),re=[];function ie(e,t){for(var n=0,r=re.length;n<r;n+=1){var i=re[n];if(i.condition(e,t))return new i(e,t)}return new D(e,t)}var oe="$and",ce="$or",ae="$path",se="$val",ue=function(e){return!(!e[oe]&&!e[ce])},he=function(e){return c({},oe,Object.keys(e).map((function(t){return c({},t,e[t])})))};function le(e,t){var n=(arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}).auto,r=void 0===n||n;return ue(e)||(e=he(e)),function e(n){var i=Object.keys(n),o=function(e){return!!e[ae]}(n);if(!o&&i.length>1&&!ue(n))return e(he(n));if(function(e){return!g(e)&&b(e)&&!ue(e)}(n)){var c=o?n[ae]:i[0],a=o?n[se]:n[c];if(!m(a))throw new Error(function(e){return"Invalid value for key ".concat(e)}(c));var s={keyId:C(c),pattern:a};return r&&(s.searcher=ie(a,t)),s}var u={children:[],operator:i[0]};return i.forEach((function(t){var r=n[t];g(r)&&r.forEach((function(t){u.children.push(e(t))}))})),u}(e)}function fe(e,t){var n=e.matches;t.matches=[],x(n)&&n.forEach((function(e){if(x(e.indices)&&e.indices.length){var n={indices:e.indices,value:e.value};e.key&&(n.key=e.key.src),e.idx>-1&&(n.refIndex=e.idx),t.matches.push(n)}}))}function de(e,t){t.score=e.score}var ve=function(){function e(n){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=arguments.length>2?arguments[2]:void 0;r(this,e),this.options=t(t({},$),i),this.options.useExtendedSearch,this._keyStore=new j(this.options.keys),this.setCollection(n,o)}return o(e,[{key:"setCollection",value:function(e,t){if(this._docs=e,t&&!(t instanceof R))throw new Error("Incorrect 'index' type");this._myIndex=t||P(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}},{key:"add",value:function(e){x(e)&&(this._docs.push(e),this._myIndex.add(e))}},{key:"remove",value:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){return!1},t=[],n=0,r=this._docs.length;n<r;n+=1){var i=this._docs[n];e(i,n)&&(this.removeAt(n),n-=1,r-=1,t.push(i))}return t}},{key:"removeAt",value:function(e){this._docs.splice(e,1),this._myIndex.removeAt(e)}},{key:"getIndex",value:function(){return this._myIndex}},{key:"search",value:function(e){var t=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).limit,n=void 0===t?-1:t,r=this.options,i=r.includeMatches,o=r.includeScore,c=r.shouldSort,a=r.sortFn,s=r.ignoreFieldNorm,u=m(e)?m(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e);return function(e,t){var n=t.ignoreFieldNorm,r=void 0===n?$.ignoreFieldNorm:n;e.forEach((function(e){var t=1;e.matches.forEach((function(e){var n=e.key,i=e.norm,o=e.score,c=n?n.weight:null;t*=Math.pow(0===o&&c?Number.EPSILON:o,(c||1)*(r?1:i))})),e.score=t}))}(u,{ignoreFieldNorm:s}),c&&u.sort(a),k(n)&&n>-1&&(u=u.slice(0,n)),function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=n.includeMatches,i=void 0===r?$.includeMatches:r,o=n.includeScore,c=void 0===o?$.includeScore:o,a=[];return i&&a.push(fe),c&&a.push(de),e.map((function(e){var n=e.idx,r={item:t[n],refIndex:n};return a.length&&a.forEach((function(t){t(e,r)})),r}))}(u,this._docs,{includeMatches:i,includeScore:o})}},{key:"_searchStringList",value:function(e){var t=ie(e,this.options),n=this._myIndex.records,r=[];return n.forEach((function(e){var n=e.v,i=e.i,o=e.n;if(x(n)){var c=t.searchIn(n),a=c.isMatch,s=c.score,u=c.indices;a&&r.push({item:n,idx:i,matches:[{score:s,value:n,norm:o,indices:u}]})}})),r}},{key:"_searchLogical",value:function(e){var t=this,n=le(e,this.options),r=function e(n,r,i){if(!n.children){var o=n.keyId,c=n.searcher,a=t._findMatches({key:t._keyStore.get(o),value:t._myIndex.getValueForItemAtKeyId(r,o),searcher:c});return a&&a.length?[{idx:i,item:r,matches:a}]:[]}for(var s=[],u=0,h=n.children.length;u<h;u+=1){var l=e(n.children[u],r,i);if(l.length)s.push.apply(s,f(l));else if(n.operator===oe)return[]}return s},i=this._myIndex.records,o={},c=[];return i.forEach((function(e){var t=e.$,i=e.i;if(x(t)){var a=r(n,t,i);a.length&&(o[i]||(o[i]={idx:i,item:t,matches:[]},c.push(o[i])),a.forEach((function(e){var t,n=e.matches;(t=o[i].matches).push.apply(t,f(n))})))}})),c}},{key:"_searchObjectList",value:function(e){var t=this,n=ie(e,this.options),r=this._myIndex,i=r.keys,o=r.records,c=[];return o.forEach((function(e){var r=e.$,o=e.i;if(x(r)){var a=[];i.forEach((function(e,i){a.push.apply(a,f(t._findMatches({key:e,value:r[i],searcher:n})))})),a.length&&c.push({idx:o,item:r,matches:a})}})),c}},{key:"_findMatches",value:function(e){var t=e.key,n=e.value,r=e.searcher;if(!x(n))return[];var i=[];if(g(n))n.forEach((function(e){var n=e.v,o=e.i,c=e.n;if(x(n)){var a=r.searchIn(n),s=a.isMatch,u=a.score,h=a.indices;s&&i.push({score:u,key:t,value:n,idx:o,norm:c,indices:h})}}));else{var o=n.v,c=n.n,a=r.searchIn(o),s=a.isMatch,u=a.score,h=a.indices;s&&i.push({score:u,key:t,value:o,norm:c,indices:h})}return i}}]),e}();return ve.version="7.0.0",ve.createIndex=P,ve.parseIndex=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.getFn,r=void 0===n?$.getFn:n,i=t.fieldNormWeight,o=void 0===i?$.fieldNormWeight:i,c=e.keys,a=e.records,s=new R({getFn:r,fieldNormWeight:o});return s.setKeys(c),s.setIndexRecords(a),s},ve.config=$,function(){re.push.apply(re,arguments)}(ne),ve})();
(function (sj) {
    "use strict";

    sj.addEvent = function(el, type, handler) {
      if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
    }
    sj.removeEvent = function(el, type, handler) {
      if (el.detachEvent) el.detachEvent('on'+type, handler); else el.removeEventListener(type, handler);
    }
    sj.onReady = function(ready) {
      // in case the document is already rendered
      if (document.readyState!='loading') ready();
      // modern browsers
      else if (document.addEventListener) document.addEventListener('DOMContentLoaded', ready);
      // IE <= 8
      else document.attachEvent('onreadystatechange', function(){
          if (document.readyState=='complete') ready();
      });
    }

    async function getSearchData(dataUrl) {
        let response = await fetch(dataUrl);
        let responseText = response.text();
        return responseText;
    }

    function searchInit() {
        var dataUrl = "/assets/js/SearchData.json";

        getSearchData(dataUrl)
            .then(function(responseText) {
            var docs = JSON.parse(responseText);
            var keysRestriction = new URLSearchParams(window.location.search).get("keys");
            var keys = ['title', 'content', 'tags', 'url', 'date', 'book', 'author_id'];
            if (keysRestriction) {
              keys = keysRestriction.split(',');
            }

            var fuse = new Fuse(Object.values(docs), {
                keys: keys,
                findAllMatches: false,
                ignoreFieldNorm: true,
                ignoreLocation: true,
                includeMatches: true,
                includeScore: true,
                isCaseSensitive: false,
                minMatchCharLength: 2,
                shouldSort: true,
                threshold: 0.2, // set this to 0 to require a perfect match
                useExtendedSearch: true, // ref: https://www.fusejs.io/examples.html#extended-search
            });
            searchLoaded(fuse);
        }).catch(function(err) {
            alert('Failed to load search data: ' + err);
        });
    }

    function searchLoaded(fuse) {
        var searchInput = document.getElementById('search-input');
        var searchResults = document.getElementById('search-results');
        var currentInput;
        var currentSearchIndex = 0;

        function update() {
            currentSearchIndex++;

            var input = searchInput.value;
            var isBang = input.endsWith('!');

            if (input === currentInput) {
                return;
            }

            currentInput = input;
            searchResults.innerHTML = '';
            if (input === '') {
                return;
            }

            var results = fuse.search(input);
            if (results[0] && results[0].score <= 0.3) {
                results = results.filter(function(result){
                    return result.score < 0.5;
                });
            }

            var countResultsDiv = document.createElement('small');
            countResultsDiv.classList.add('search-result-count');
            countResultsDiv.innerText = results.length.toLocaleString() + ' result' + (results.length != 1 ? 's' : '') + ' found';
            searchResults.appendChild(countResultsDiv);

            if (results.length > 0) {
                var resultsList = document.createElement('ul');
                resultsList.classList.add('search-results-list');
                searchResults.appendChild(resultsList);
                if (isBang) {
                    return window.location.href = results[0].item.url;
                }
                addResults(resultsList, results, 0, 10, 100, currentSearchIndex);
            }

            function addResults(resultsList, results, start, batchSize, batchMillis, searchIndex) {
                if (searchIndex != currentSearchIndex) {
                    return;
                }
                for (var i = start; i < (start + batchSize); i++) {
                    if (i == results.length) {
                        return;
                    }
                    addResult(resultsList, results[i]);
                }
                setTimeout(function() {
                    addResults(resultsList, results, start + batchSize, batchSize, batchMillis, searchIndex);
                }, batchMillis);
            }

            function addResult(resultsList, result) {
                var doc = result.item;
                var resultsListItem = document.createElement('li');
                resultsListItem.classList.add('search-results-list-item');
                resultsList.appendChild(resultsListItem);

                var resultLink = document.createElement('a');
                resultLink.classList.add('search-result');
                resultLink.setAttribute('href', doc.url);
                resultsListItem.appendChild(resultLink);

                var resultTitle = document.createElement('div');
                resultTitle.classList.add('search-result-title');
                resultLink.appendChild(resultTitle);

                var resultDoc = document.createElement('div');
                resultDoc.classList.add('search-result-doc');
                resultDoc.innerHTML = "";
                resultTitle.appendChild(resultDoc);
                var resultDocTitle = document.createElement('div');
                resultDocTitle.classList.add('search-result-doc-title');
                resultDocTitle.innerHTML = doc.doc;
                resultDoc.appendChild(resultDocTitle);
                var resultDocOrSection = resultDocTitle;
                if (doc.doc != doc.title) {
                    resultDoc.classList.add('search-result-doc-parent');
                    var resultSection = document.createElement('div');
                    resultSection.classList.add('search-result-section');
                    resultSection.innerHTML = doc.title;
                    resultTitle.appendChild(resultSection);
                    resultDocOrSection = resultSection;
                }

                var titlePositions = result.matches.filter(function(match){
                    return match.key == 'title';
                }).map(function(match){
                    return match.indices[0];
                });
                // result = {item: {title: "title", content: "content", tags: "tags", url: "url"}, matches: [{key: "title", indices: [[0, 3], [30, 34]], value: "title"}, {key: "content", indices: [[0, 3]], velue: "content"}]}
                var contentPositions = result.matches.filter(function(match){
                    return match.key == 'content';
                }).map(function(match){
                    return match.indices.sort(function(a, b){
                        // sort by biggest match first
                        return (b[1] - b[0]) - (a[1] - a[0]);
                    });
                })[0];
                if (titlePositions.length > 0) {
                    resultDocOrSection.innerHTML = '';
                    addHighlightedText(resultDocOrSection, doc.title, 0, doc.title.length, titlePositions);
                }

                if (contentPositions) {
                    var resultPreviews = document.createElement('div');
                    resultPreviews.classList.add('search-result-previews');
                    resultLink.appendChild(resultPreviews);

                    var previewBuffer = 15;
                    var position = contentPositions[0];
                    var resultPreview = document.createElement('div');
                    resultPreview.classList.add('search-result-preview');
                    resultPreviews.appendChild(resultPreview);
                    resultPreview.appendChild(document.createTextNode('... '));
                    addHighlightedText(resultPreview, doc.content, Math.max(0, position[0] - previewBuffer), position[1] + previewBuffer, [position]);
                    resultPreview.appendChild(document.createTextNode(' ...'));
                } else if (doc.content) {
                    var resultPreviews = document.createElement('div');
                    resultPreviews.classList.add('search-result-previews');
                    resultLink.appendChild(resultPreviews);

                    var resultPreview = document.createElement('div');
                    resultPreview.classList.add('search-result-preview');
                    resultPreviews.appendChild(resultPreview);
                    resultPreview.textContent = doc.content.substring(0, 75) + '...';
                }
                if (doc.date) {
                    var resultDateDiv = document.createElement('div');
                    resultDateDiv.classList.add('search-result-date');
                    var resultDate = document.createElement('small');
                    resultDate.innerHTML = doc.date.split('T')[0];
                    resultDateDiv.appendChild(resultDate);
                    resultLink.appendChild(resultDateDiv);
                } else if (doc.type) {
                    var resultDateDiv = document.createElement('div');
                    resultDateDiv.classList.add('search-result-date');
                    var resultDate = document.createElement('small');
                    resultDate.innerHTML = doc.type.charAt(0).toUpperCase() + doc.type.slice(1);
                    resultDateDiv.appendChild(resultDate);
                    resultLink.appendChild(resultDateDiv);
                }
            }

            function addHighlightedText(parent, text, start, end, positions) {
                var index = start;
                for (var i in positions) {
                    var position = positions[i];
                    var span = document.createElement('span');
                    span.innerHTML = text.substring(index, position[0]);
                    parent.appendChild(span);
                    index = position[1] + 1;
                    var highlight = document.createElement('span');
                    highlight.classList.add('search-result-highlight');
                    highlight.innerHTML = text.substring(position[0], index);
                    parent.appendChild(highlight);
                }
                var span = document.createElement('span');
                span.innerHTML = text.substring(index, end);
                parent.appendChild(span);
            }
        }

        sj.onReady(function(){
            update();
        });
    }

    sj.onReady(function(){
        (function ensureLoaded() {
            // if Fuse isn't available on the page, wait 100ms and try again
            if (typeof Fuse === 'undefined') {
                setTimeout(ensureLoaded, 100);
                return;
            }
            searchInit();
        })();
    });
    function searchViaQuery() {
      var search = new URLSearchParams(window.location.search).get("q");
      if (!search) { return; }

      var searchInput = document.getElementById("search-input");
      searchInput.value = search;
    }

    searchViaQuery();
})(window.sj = window.sj || {});
